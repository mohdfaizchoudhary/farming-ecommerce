insert into public.categories(name, slug, description, display_order)
values
  ('Egg Store & Egg-Based Foods', 'eggs-foods', 'Shop eggs and a variety of egg-based foods.', 1),
  ('Ready-to-Eat / Ready-to-Cook Foods', 'ready-to-cook', 'Explore prepared foods for quick meals and cooking.', 2),
  ('Raw Chicken & Meat', 'raw-meat', 'Fresh and chilled meat products.', 3),
  ('Supplements & Personal Care', 'supplements', 'Browse supplements and everyday personal care products.', 4),
  ('Skincare & Beauty', 'skincare-beauty', 'Skincare and beauty products.', 5),
  ('Pet Products', 'pet-products', 'Explore products for pets and their daily care.', 6),
  ('Breeding Rabbits', 'breeding-rabbits', 'Find breeding rabbits and review breed and health details.', 7),
  ('Pet Rabbits', 'pet-rabbits', 'Explore rabbits offered as pets.', 8),
  ('Buy & Sell Poultry', 'poultry-buy-sell', 'Connect with poultry listings and find the birds your farm needs.', 9),
  ('Hatching Eggs', 'hatching-eggs', 'Explore hatching egg batches, quantities and supplier details.', 10),
  ('Layer Birds', 'layer-birds', 'Find layer birds for your operation, with listing details to review.', 11),
  ('Buying Birds', 'buying-birds', 'Browse bird sourcing listings and connect with poultry suppliers.', 12),
  ('Chicken Sale', 'chicken-sale', 'Explore poultry meat listings with product and availability details.', 13),
  ('Chick Sale', 'chick-sale', 'Find chick listings and review batch and supplier information.', 14),
  ('Rabbit', 'rabbit', 'Browse rabbit listings and connect with suppliers.', 15),
  ('Farming & Livestock', 'farming-livestock', 'Farm livestock and poultry products.', 16)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    display_order = excluded.display_order,
    active = true;

alter table public.payments
  add column if not exists gateway_method text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'payments_gateway_method_check'
      and conrelid = 'public.payments'::regclass
  ) then
    alter table public.payments
      add constraint payments_gateway_method_check
      check (gateway_method is null or gateway_method in ('upi', 'card'));
  end if;
end;
$$;

drop function if exists public.create_customer_order(text, uuid, text, text, jsonb, numeric, jsonb);

create function public.create_customer_order(
  p_order_number text,
  p_user_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_delivery_snapshot jsonb,
  p_subtotal numeric,
  p_items jsonb,
  p_payment_method text,
  p_payment_status text,
  p_provider_order_id text,
  p_provider_payment_id text,
  p_gateway_method text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order_id uuid;
  v_item jsonb;
begin
  if p_payment_method is null or p_payment_method not in ('cod', 'razorpay') then
    raise exception 'Unsupported payment method.';
  end if;

  if p_payment_method = 'cod' and (
    p_payment_status is distinct from 'pending'
    or p_provider_order_id is not null
    or p_provider_payment_id is not null
    or p_gateway_method is not null
  ) then
    raise exception 'Invalid cash-on-delivery payment details.';
  end if;

  if p_payment_method = 'razorpay' and (
    p_payment_status is distinct from 'successful'
    or nullif(p_provider_order_id, '') is null
    or nullif(p_provider_payment_id, '') is null
    or p_gateway_method is null
    or p_gateway_method not in ('upi', 'card')
  ) then
    raise exception 'Invalid online payment details.';
  end if;

  insert into public.orders(
    order_number, user_id, customer_name, customer_email, delivery_snapshot,
    status, payment_status, payment_method, subtotal, grand_total
  )
  values (
    p_order_number, p_user_id, p_customer_name, p_customer_email, p_delivery_snapshot,
    'confirmed', p_payment_status, p_payment_method, p_subtotal, p_subtotal
  )
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    update public.product_variants
    set stock_quantity = stock_quantity - (v_item->>'quantity')::integer
    where id = (v_item->>'variant_id')::uuid
      and product_id = (v_item->>'product_id')::uuid
      and active = true
      and stock_quantity >= (v_item->>'quantity')::integer
      and price = (v_item->>'price')::numeric
      and exists (
        select 1
        from public.products p
        where p.id = public.product_variants.product_id
          and p.status = 'active'
      );

    if not found then
      raise exception 'Insufficient stock or product is unavailable.';
    end if;

    insert into public.order_items(
      order_id, product_id, variant_id, product_name_snapshot, sku_snapshot,
      unit_price, quantity, line_total
    )
    values (
      v_order_id,
      (v_item->>'product_id')::uuid,
      (v_item->>'variant_id')::uuid,
      v_item->>'name',
      v_item->>'sku',
      (v_item->>'price')::numeric,
      (v_item->>'quantity')::integer,
      (v_item->>'price')::numeric * (v_item->>'quantity')::integer
    );
  end loop;

  if p_payment_method = 'razorpay' then
    insert into public.payments(
      order_id, provider, provider_order_id, provider_payment_id,
      amount, currency, status, verified_at, gateway_method
    )
    values (
      v_order_id, 'razorpay', p_provider_order_id, p_provider_payment_id,
      p_subtotal, 'INR', 'captured', now(), p_gateway_method
    );
  end if;

  return v_order_id;
end;
$$;

revoke all on function public.create_customer_order(text, uuid, text, text, jsonb, numeric, jsonb, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.create_customer_order(text, uuid, text, text, jsonb, numeric, jsonb, text, text, text, text, text)
  to service_role;

notify pgrst, 'reload schema';
