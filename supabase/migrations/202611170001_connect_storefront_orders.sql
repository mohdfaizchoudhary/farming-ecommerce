insert into public.categories(name, slug, description, display_order)
values
  ('Farming & Livestock', 'farming-livestock', 'Farm livestock and poultry products.', 20),
  ('Eggs & Egg Foods', 'eggs-foods', 'Eggs and egg-based products.', 21),
  ('Ready-to-Cook', 'ready-to-cook', 'Prepared food products ready to cook.', 22),
  ('Raw Chicken & Meat', 'raw-meat', 'Fresh and chilled meat products.', 23),
  ('Supplements & Care', 'supplements', 'Farm supplements and care products.', 24),
  ('Skincare & Beauty', 'skincare-beauty', 'Skincare and beauty products.', 25),
  ('Pet Care', 'pet-products', 'Pet products and nutrition.', 26)
on conflict (slug) do update
set name = excluded.name, description = excluded.description;

alter table public.order_items
  add column if not exists variant_id uuid references public.product_variants(id);

alter table public.user_roles enable row level security;
alter table public.product_images enable row level security;

grant select on public.categories, public.products, public.product_variants, public.product_images to anon, authenticated;
grant select on public.user_roles to authenticated;

drop policy if exists "read own admin role" on public.user_roles;
create policy "read own admin role" on public.user_roles
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "public active product images" on public.product_images;
create policy "public active product images" on public.product_images
  for select to anon, authenticated
  using (exists (
    select 1 from public.products p
    where p.id = product_images.product_id and p.status = 'active'
  ));

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'products'
     ) then
    execute 'alter publication supabase_realtime add table public.products';
  end if;
end;
$$;

create or replace function public.admin_upsert_catalog_product(
  p_product_id uuid,
  p_category_slug text,
  p_name text,
  p_slug text,
  p_sku text,
  p_description text,
  p_attributes jsonb,
  p_price numeric,
  p_mrp numeric,
  p_stock integer,
  p_unit_label text,
  p_image_url text,
  p_active boolean
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_product_id uuid;
  v_category_id uuid;
  v_variant_id uuid;
begin
  select id into v_category_id
  from public.categories
  where slug = p_category_slug and active = true;

  if v_category_id is null then
    raise exception 'Product category is unavailable.';
  end if;

  if p_product_id is null then
    insert into public.products(category_id, name, slug, sku, description, status, attributes)
    values (v_category_id, p_name, p_slug, p_sku, p_description,
      case when p_active then 'active' else 'draft' end, coalesce(p_attributes, '{}'::jsonb))
    returning id into v_product_id;
  else
    update public.products
    set category_id = v_category_id,
        name = p_name,
        slug = p_slug,
        sku = p_sku,
        description = p_description,
        status = case when p_active then 'active' else 'draft' end,
        attributes = coalesce(p_attributes, '{}'::jsonb)
    where id = p_product_id
    returning id into v_product_id;

    if v_product_id is null then
      raise exception 'Product not found.';
    end if;
  end if;

  select id into v_variant_id
  from public.product_variants
  where product_id = v_product_id
  order by id
  limit 1;

  if v_variant_id is null then
    insert into public.product_variants(
      product_id, sku, variant_name, unit_label, price, mrp, stock_quantity, active
    )
    values (
      v_product_id, p_sku || '-V1', 'Default', p_unit_label, p_price, p_mrp, p_stock, true
    );
  else
    update public.product_variants
    set variant_name = 'Default',
        sku = p_sku || '-V1',
        unit_label = p_unit_label,
        price = p_price,
        mrp = p_mrp,
        stock_quantity = p_stock,
        active = true
    where id = v_variant_id;
  end if;

  delete from public.product_images where product_id = v_product_id;
  if nullif(trim(p_image_url), '') is not null then
    insert into public.product_images(product_id, url, alt_text, sort_order)
    values (v_product_id, p_image_url, p_name, 0);
  end if;

  return v_product_id;
end;
$$;

create or replace function public.admin_archive_catalog_product(p_product_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.products set status = 'archived' where id = p_product_id;
  if not found then
    raise exception 'Product not found.';
  end if;
  update public.product_variants set active = false where product_id = p_product_id;
end;
$$;

create or replace function public.create_customer_order(
  p_order_number text,
  p_user_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_delivery_snapshot jsonb,
  p_subtotal numeric,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_item jsonb;
begin
  insert into public.orders(
    order_number, user_id, customer_name, customer_email, delivery_snapshot,
    status, payment_status, payment_method, subtotal, grand_total
  )
  values (
    p_order_number, p_user_id, p_customer_name, p_customer_email, p_delivery_snapshot,
    'confirmed', 'pending', 'cod', p_subtotal, p_subtotal
  )
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    update public.product_variants
    set stock_quantity = stock_quantity - (v_item->>'quantity')::integer
    where id = (v_item->>'variant_id')::uuid
      and product_id = (v_item->>'product_id')::uuid
      and active = true
      and stock_quantity >= (v_item->>'quantity')::integer;

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

  return v_order_id;
end;
$$;

create or replace function public.admin_update_order_status(
  p_order_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_status text;
  v_item record;
begin
  if p_status not in ('confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled') then
    raise exception 'Invalid order status.';
  end if;

  select status into v_old_status
  from public.orders
  where id = p_order_id
  for update;

  if v_old_status is null then
    raise exception 'Order not found.';
  end if;

  if v_old_status = 'cancelled' and p_status <> 'cancelled' then
    raise exception 'A cancelled order cannot be reopened.';
  end if;
  if p_status = 'cancelled' and v_old_status in ('shipped', 'delivered') then
    raise exception 'A shipped or delivered order cannot be cancelled.';
  end if;

  if p_status = 'cancelled' and v_old_status <> 'cancelled' then
    for v_item in
      select variant_id, quantity
      from public.order_items
      where order_id = p_order_id and variant_id is not null
    loop
      update public.product_variants
      set stock_quantity = stock_quantity + v_item.quantity
      where id = v_item.variant_id;
    end loop;
  end if;

  update public.orders set status = p_status where id = p_order_id;
end;
$$;

revoke all on function public.admin_upsert_catalog_product(uuid, text, text, text, text, text, jsonb, numeric, numeric, integer, text, text, boolean) from public, anon, authenticated;
revoke all on function public.admin_archive_catalog_product(uuid) from public, anon, authenticated;
revoke all on function public.create_customer_order(text, uuid, text, text, jsonb, numeric, jsonb) from public, anon, authenticated;
revoke all on function public.admin_update_order_status(uuid, text) from public, anon, authenticated;

grant execute on function public.admin_upsert_catalog_product(uuid, text, text, text, text, text, jsonb, numeric, numeric, integer, text, text, boolean) to service_role;
grant execute on function public.admin_archive_catalog_product(uuid) to service_role;
grant execute on function public.create_customer_order(text, uuid, text, text, jsonb, numeric, jsonb) to service_role;
grant execute on function public.admin_update_order_status(uuid, text) to service_role;
