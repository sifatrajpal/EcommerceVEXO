-- Sample data using the images in /public/images. Safe to re-run.
insert into public.edit_tabs (id, label, image_a, image_b, sort) values
  ('featured',  'Featured',  '/images/edit-hood.png',       '/images/edit-look-4.png', 1),
  ('tops',      'Tops',      '/images/pick-summer.png',     '/images/edit-look-2.png', 2),
  ('shorts',    'Shorts',    '/images/edit-shorts.png',     '/images/edit-look-1.png', 3),
  ('layers',    'Layers',    '/images/feature-athlete.png', '/images/edit-look-3.png', 4),
  ('outerwear', 'Outerwear', '/images/pick-winter.png',     '/images/edit-look-4.png', 5),
  ('caps',      'Caps',      '/images/edit-hood.png',       '/images/edit-look-3.png', 6)
on conflict (id) do update set label = excluded.label, image_a = excluded.image_a, image_b = excluded.image_b, sort = excluded.sort;

delete from public.products where name like 'ASRV x Equinox%';
insert into public.products (name, price, season, category, image_url, sort) values
  ('ASRV x Equinox Lycra Hoodie', 116, 'Winter', 'men',    '/images/arrival-1.png', 1),
  ('ASRV x Equinox Tech Fleece',  116, 'Winter', 'men',    '/images/arrival-2.png', 2),
  ('ASRV x Equinox Sling Set',    116, 'Winter', 'women',  '/images/arrival-3.png', 3),
  ('ASRV x Equinox Anorak',       116, 'Winter', 'unisex', '/images/arrival-4.png', 4),
  ('ASRV x Equinox Cargo',        124, 'Winter', 'men',    '/images/arrival-5.png', 5),
  ('ASRV x Equinox Shell',        132, 'Winter', 'women',  '/images/arrival-6.png', 6),
  ('ASRV x Equinox Lycra Short',   88, 'Summer', 'women',  '/images/arrival-7.png', 7),
  ('ASRV x Equinox Sand Set',      98, 'Summer', 'unisex', '/images/arrival-8.png', 8),
  ('ASRV x Equinox Ribbed Polo',  104, 'Summer', 'men',    '/images/arrival-9.png', 9),
  ('ASRV x Equinox Wool Blazer',  168, 'Winter', 'men',    '/images/arrival-10.png', 10),
  ('ASRV x Equinox Stripe Set',   112, 'Summer', 'men',    '/images/arrival-11.png', 11),
  ('ASRV x Equinox Knit Tee',      92, 'Summer', 'men',    '/images/arrival-12.png', 12),
  ('ASRV x Equinox Tailored Suit', 176, 'Winter', 'women',  '/images/arrival-13.png', 13);
