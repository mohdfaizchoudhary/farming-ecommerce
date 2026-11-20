-- DESTRUCTIVE ONE-TIME RESET.
-- This removes all application data and all Supabase Auth users, then seeds demo
-- categories and products. Run manually in the intended Supabase project's SQL Editor.
-- First remove existing files in Storage > product-images; SQL cannot delete file contents.

begin;

delete from public.refunds;
delete from public.return_requests;
delete from public.shipments;
delete from public.stock_reservations;
delete from public.inventory_movements;
delete from public.inventory_batches;
delete from public.order_items;
delete from public.payments;
delete from public.orders;
delete from public.audit_logs;
delete from public.coupons;
delete from public.user_roles;
delete from public.addresses;
delete from public.profiles;
delete from public.product_images;
delete from public.product_variants;
delete from public.products;
delete from public.categories;
delete from auth.users;

insert into public.categories (name, slug, description, display_order)
values
  ('Buy & Sell Poultry', 'poultry-buy-sell', 'Connect with poultry listings and find birds for your farm.', 0),
  ('Hatching Eggs', 'hatching-eggs', 'Explore hatching egg batches and supplier details.', 1),
  ('Layer Birds', 'layer-birds', 'Find layer birds and review listing details.', 2),
  ('Buying Birds', 'buying-birds', 'Browse bird sourcing listings from poultry suppliers.', 3),
  ('Chicken Sale', 'chicken-sale', 'Explore poultry meat listings and availability.', 4),
  ('Chick Sale', 'chick-sale', 'Find chick listings and review batch details.', 5),
  ('Rabbit', 'rabbit', 'Browse rabbit listings and connect with suppliers.', 6),
  ('Breeding Rabbits', 'breeding-rabbits', 'Find breeding rabbits and review listing details.', 7),
  ('Pet Rabbits', 'pet-rabbits', 'Explore rabbits offered as pets.', 8),
  ('Farming & Livestock', 'farming-livestock', 'Farm livestock and poultry products.', 9),
  ('Eggs & Egg Foods', 'eggs-foods', 'Eggs and egg-based products.', 10),
  ('Ready-to-Cook', 'ready-to-cook', 'Prepared food products ready to cook.', 11),
  ('Raw Chicken & Meat', 'raw-meat', 'Fresh and chilled meat products.', 12),
  ('Supplements & Care', 'supplements', 'Farm supplements and care products.', 13),
  ('Skincare & Beauty', 'skincare-beauty', 'Skincare and beauty products.', 14),
  ('Pet Care', 'pet-products', 'Pet products and nutrition.', 15);

do $$
declare
  demo record;
  category_id uuid;
  product_id uuid;
begin
  for demo in
    select *
    from (values
      (
        'Hatching Eggs - Demo Pack',
        'hatching-eggs-demo-pack',
        'DEMO-HE-001',
        'hatching-eggs',
        'Demo listing. Confirm breed, batch details, handling and availability with the supplier before purchase.',
        399::numeric,
        449::numeric,
        12,
        'Pack of 6',
        'Standard',
        'Egg pack'
      ),
      (
        'Layer Birds - Demo Listing',
        'layer-birds-demo-listing',
        'DEMO-LB-001',
        'layer-birds',
        'Demo listing. Verify breed, age, health records, quantity and transport arrangements with the seller.',
        650::numeric,
        720::numeric,
        8,
        'Per bird',
        'Live Certified',
        'Layer bird'
      ),
      (
        'Day-Old Chicks - Demo Listing',
        'day-old-chicks-demo-listing',
        'DEMO-CH-001',
        'chick-sale',
        'Demo listing. Confirm breed, hatch date, vaccination information, minimum order and delivery conditions with the supplier.',
        75::numeric,
        90::numeric,
        50,
        'Per chick',
        'Live Certified',
        'Day-old chick'
      ),
      (
        'Fresh Chicken - Demo Pack',
        'fresh-chicken-demo-pack',
        'DEMO-FC-001',
        'chicken-sale',
        'Demo listing. Confirm product condition, weight, sourcing, handling, storage and delivery details with the seller.',
        285::numeric,
        320::numeric,
        16,
        'Per kg',
        'Cold-Chain',
        'Fresh chicken'
      ),
      (
        'Farm Feed Supplement - Demo Pack',
        'farm-feed-supplement-demo-pack',
        'DEMO-FS-001',
        'supplements',
        'Demo listing. Check the label, ingredients, intended use and supplier details before purchase.',
        499::numeric,
        599::numeric,
        30,
        '1 kg pack',
        'Standard',
        'Feed supplement'
      )
    ) as demo_rows(name, slug, sku, category_slug, description, price, mrp, stock, unit_label, handling, variant_type)
  loop
    select id
    into category_id
    from public.categories
    where slug = demo.category_slug and active = true;

    if category_id is null then
      raise exception 'Missing demo category: %', demo.category_slug;
    end if;

    insert into public.products (
      category_id, name, slug, sku, description, status, attributes
    )
    values (
      category_id,
      demo.name,
      demo.slug,
      demo.sku,
      demo.description,
      'active',
      jsonb_build_object('handling', demo.handling, 'variantType', demo.variant_type)
    )
    returning id into product_id;

    insert into public.product_variants (
      product_id, sku, variant_name, unit_label, price, mrp, stock_quantity, active
    )
    values (
      product_id,
      demo.sku || '-V1',
      'Default',
      demo.unit_label,
      demo.price,
      demo.mrp,
      demo.stock,
      true
    );

    insert into public.product_images (product_id, url, alt_text, sort_order)
    values (product_id, '/sms-farmstead-logo.jpeg', demo.name, 0);
  end loop;
end;
$$;

commit;
