-- Sample data using the images in /public/images. Safe to re-run.
insert into public.edit_tabs (id, label, image_a, image_b, sort) values
  ('featured',  'Featured',  '/images/pick-summer.png',     '/images/edit-look-2.png', 1),
  ('tops',      'Tops',      '/images/edit-hood.png',       '/images/edit-look-4.png', 2),
  ('shorts',    'Shorts',    '/images/edit-shorts.png',     '/images/edit-look-1.png', 3),
  ('layers',    'Layers',    '/images/feature-athlete.png', '/images/edit-look-3.png', 4),
  ('outerwear', 'Outerwear', '/images/pick-winter.png',     '/images/edit-look-4.png', 5),
  ('caps',      'Caps',      '/images/edit-hood.png',       '/images/edit-look-3.png', 6)
on conflict (id) do update set label = excluded.label, image_a = excluded.image_a, image_b = excluded.image_b, sort = excluded.sort;

delete from public.products where name like 'ASRV x Equinox%';
insert into public.products (name, price, season, category, collection, brand, material, image_url, sort) values
  ('ASRV x Equinox Lycra Hoodie', 116, 'Winter', 'men',    'Men Originals',   'ASRV x Equinox', 'Cotton-Poly Blend',  '/images/arrival-1.png', 1),
  ('ASRV x Equinox Tech Fleece',  116, 'Winter', 'men',    'Men Originals',   'ASRV x Equinox', 'Technical Nylon',    '/images/arrival-2.png', 2),
  ('ASRV x Equinox Sling Set',    116, 'Winter', 'women',  'Women Originals', 'ASRV x Equinox', 'Cotton-Poly Blend',  '/images/arrival-3.png', 3),
  ('ASRV x Equinox Anorak',       116, 'Winter', 'unisex', 'Originals',       'ASRV x Equinox', 'Technical Nylon',    '/images/arrival-4.png', 4),
  ('ASRV x Equinox Cargo',        124, 'Winter', 'men',    'Men Originals',   'ASRV x Equinox', 'Organic Cotton',     '/images/arrival-5.png', 5),
  ('ASRV x Equinox Shell',        132, 'Winter', 'women',  'Women Originals', 'ASRV x Equinox', 'Technical Nylon',    '/images/arrival-6.png', 6),
  ('ASRV x Equinox Lycra Short',   88, 'Summer', 'women',  'Women Originals', 'ASRV x Equinox', 'Cotton-Poly Blend',  '/images/arrival-7.png', 7),
  ('ASRV x Equinox Sand Set',      98, 'Summer', 'unisex', 'Originals',       'ASRV x Equinox', 'Organic Cotton',     '/images/arrival-8.png', 8),
  ('ASRV x Equinox Ribbed Polo',  104, 'Summer', 'men',    'Men Originals',   'ASRV x Equinox', 'Organic Cotton',     '/images/arrival-9.png', 9),
  ('ASRV x Equinox Wool Blazer',  168, 'Winter', 'men',    'Men Originals',   'ASRV x Equinox', 'Merino Wool',        '/images/arrival-10.png', 10),
  ('ASRV x Equinox Stripe Set',   112, 'Summer', 'men',    'Men Originals',   'ASRV x Equinox', 'Cotton-Poly Blend',  '/images/arrival-11.png', 11),
  ('ASRV x Equinox Knit Tee',      92, 'Summer', 'men',    'Men Originals',   'ASRV x Equinox', 'Organic Cotton',     '/images/arrival-12.png', 12),
  ('ASRV x Equinox Tailored Suit', 176, 'Winter', 'women',  'Women Originals', 'ASRV x Equinox', 'Merino Wool',       '/images/arrival-13.png', 13);

-- Catalog reference data (admin-managed master lists).
insert into public.categories (name, sort) values ('Men', 1), ('Women', 2), ('Unisex', 3) on conflict (name) do nothing;

insert into public.brands (name, sort) values
  ('ASRV x Equinox', 1), ('VEXO Originals', 2), ('VEXO Essentials', 3), ('VEXO Performance Lab', 4)
on conflict (name) do nothing;

insert into public.collections (name, sort) values
  ('Men Originals', 1), ('Women Originals', 2), ('Originals', 3), ('Essentials', 4), ('Performance', 5), ('Limited Edition', 6)
on conflict (name) do nothing;

insert into public.sizes (name, sort) values
  ('XS', 1), ('S', 2), ('M', 3), ('L', 4), ('XL', 5), ('XXL', 6)
on conflict (name) do nothing;

insert into public.colors (name, hex, sort) values
  ('Sand', '#e4d9c6', 1), ('White', '#ffffff', 2), ('Rust', '#b3542f', 3), ('Black', '#141414', 4),
  ('Olive', '#5f6b4a', 5), ('Navy', '#28344d', 6), ('Charcoal', '#3a3c3f', 7), ('Stone', '#b8ad9c', 8)
on conflict (name) do nothing;

insert into public.materials (name, sort) values
  ('Cotton-Poly Blend', 1), ('Organic Cotton', 2), ('Merino Wool', 3), ('Technical Nylon', 4),
  ('Recycled Polyester', 5), ('French Terry', 6), ('Ripstop Nylon', 7)
on conflict (name) do nothing;
