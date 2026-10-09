-- ─────────────────────────────────────────────────────────────
-- VEXO schema — run in Supabase → SQL Editor (once)
-- ─────────────────────────────────────────────────────────────

-- Products shown in "Fresh fits for your next workout"
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  price          numeric(10,2) not null check (price >= 0),
  currency       text not null default 'USD',
  season         text not null default 'Winter',
  category       text not null default 'unisex' check (category in ('men', 'women', 'unisex')),
  image_url      text not null,              -- "/images/x.png" or a Supabase Storage public URL
  is_new_arrival boolean not null default true,
  sort           int not null default 0,
  created_at     timestamptz not null default now()
);
  
-- Safe to re-run: adds the column (+ constraint) if this table was created before "category" existed.
alter table public.products add column if not exists category text not null default 'unisex';
alter table public.products drop constraint if exists products_category_check;
alter table public.products add constraint products_category_check check (category in ('men', 'women', 'unisex'));

-- A collection/line label shown as a tag, e.g. "Men Originals", "Women Originals", "Originals".
alter table public.products add column if not exists collection text;
alter table public.products add column if not exists brand text;
alter table public.products add column if not exists material text;

-- Tabs in "Built for every season & rep"
create table if not exists public.edit_tabs (
  id         text primary key,               -- e.g. 'featured'
  label      text not null,
  image_a    text not null,
  image_b    text not null,
  sort       int not null default 0
);

-- Newsletter sign-ups from the footer
create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);

-- ── Row Level Security ─────────────────────────────────────────
alter table public.products    enable row level security;
alter table public.edit_tabs   enable row level security;
alter table public.subscribers enable row level security;

-- Anyone can READ the catalogue
drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select to anon, authenticated using (true);

drop policy if exists "public read edit_tabs" on public.edit_tabs;
create policy "public read edit_tabs" on public.edit_tabs for select to anon, authenticated using (true);

-- Anyone can SUBSCRIBE, but nobody can read the list with the anon key
drop policy if exists "public insert subscribers" on public.subscribers;
create policy "public insert subscribers" on public.subscribers for insert to anon, authenticated with check (true);

-- ─────────────────────────────────────────────────────────────
-- Cart (signed-in users only — one row per product per user)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity   int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.cart_items enable row level security;

-- A user sees their own cart rows; an admin can see everyone's (for the admin dashboard).
drop policy if exists "own cart select" on public.cart_items;
create policy "own cart select" on public.cart_items for select to authenticated
  using (auth.uid() = user_id or exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "own cart insert" on public.cart_items;
create policy "own cart insert" on public.cart_items for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "own cart update" on public.cart_items;
create policy "own cart update" on public.cart_items for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own cart delete" on public.cart_items;
create policy "own cart delete" on public.cart_items for delete to authenticated using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Admins — add a row here (Table Editor) to grant someone access to /admin.
-- No signup flow: you insert the row yourself with that user's id from
-- Authentication → Users.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- A signed-in user can only check their OWN row — enough to answer
-- "am I an admin?" without exposing who else is.
drop policy if exists "read own admin row" on public.admins;
create policy "read own admin row" on public.admins for select to authenticated using (user_id = auth.uid());

-- Only an admin can read the subscriber list (insert-only for everyone else, added above).
drop policy if exists "admin read subscribers" on public.subscribers;
create policy "admin read subscribers" on public.subscribers for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Only an admin can add new products (everyone else has read-only access, added above).
drop policy if exists "admin insert products" on public.products;
create policy "admin insert products" on public.products for insert to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Only an admin can edit an existing product.
drop policy if exists "admin update products" on public.products;
create policy "admin update products" on public.products for update to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Storage bucket for product photos uploaded from the admin "Add Product" form.
-- Public bucket: anyone can view the images (needed for next/image + the storefront),
-- but only an admin can upload into it.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "admin upload product-images" on storage.objects;
create policy "admin upload product-images" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

-- ─────────────────────────────────────────────────────────────
-- Orders — created by the "Make Payment" checkout action.
-- No real payment gateway: this records the order as placed.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  user_email text not null,
  total      numeric(10,2) not null check (total >= 0),
  currency   text not null default 'USD',
  status     text not null default 'placed' check (status in ('placed', 'fulfilled', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Coupon code + discount amount applied at checkout, if any — recorded on the
-- order so the receipt and admin view reflect what was actually charged.
alter table public.orders add column if not exists coupon_code text;
alter table public.orders add column if not exists discount numeric(10,2) not null default 0;

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  name        text not null,   -- snapshot, survives the product being renamed/deleted later
  price       numeric(10,2) not null,
  quantity    int not null check (quantity > 0)
);

alter table public.orders     enable row level security;
alter table public.order_items enable row level security;

-- A user sees their own orders; an admin sees every order.
drop policy if exists "own or admin read orders" on public.orders;
create policy "own or admin read orders" on public.orders for select to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "own insert orders" on public.orders;
create policy "own insert orders" on public.orders for insert to authenticated
  with check (user_id = auth.uid());

-- Only an admin can change an order's status (e.g. placed → fulfilled).
drop policy if exists "admin update orders" on public.orders;
create policy "admin update orders" on public.orders for update to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "own or admin read order_items" on public.order_items;
create policy "own or admin read order_items" on public.order_items for select to authenticated
  using (exists (
    select 1 from public.orders o
    where o.id = order_id and (o.user_id = auth.uid() or exists (select 1 from public.admins a where a.user_id = auth.uid()))
  ));

drop policy if exists "own insert order_items" on public.order_items;
create policy "own insert order_items" on public.order_items for insert to authenticated
  with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- Product likes — no account required. Each browser gets a random
-- id (stored in localStorage) that stands in for "who liked this".
-- ─────────────────────────────────────────────────────────────
create table if not exists public.product_likes (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  liker_key  text not null,
  created_at timestamptz not null default now(),
  unique (product_id, liker_key)
);

alter table public.product_likes enable row level security;

-- Public so the like count and "did I already like this" check work for signed-out visitors too.
drop policy if exists "public read product_likes" on public.product_likes;
create policy "public read product_likes" on public.product_likes for select to anon, authenticated using (true);

drop policy if exists "public insert product_likes" on public.product_likes;
create policy "public insert product_likes" on public.product_likes for insert to anon, authenticated with check (true);

drop policy if exists "public delete product_likes" on public.product_likes;
create policy "public delete product_likes" on public.product_likes for delete to anon, authenticated using (true);

-- ─────────────────────────────────────────────────────────────
-- Contact form submissions (/contact)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject    text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "public insert contact_messages" on public.contact_messages;
create policy "public insert contact_messages" on public.contact_messages for insert to anon, authenticated with check (true);

-- Only an admin can read submitted messages.
drop policy if exists "admin read contact_messages" on public.contact_messages;
create policy "admin read contact_messages" on public.contact_messages for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- Catalog reference data — admin-managed master lists that feed the
-- Add Product form (brand/collection/material) and the size/color
-- pickers shown on every product page.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.brands (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.collections (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.sizes (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.colors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  hex        text not null default '#141414',
  sort       int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.materials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories  enable row level security;
alter table public.brands      enable row level security;
alter table public.collections enable row level security;
alter table public.sizes       enable row level security;
alter table public.colors      enable row level security;
alter table public.materials   enable row level security;

-- Every reference table: anyone can read it (it drives public pages), only an admin can add/remove entries.
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select to anon, authenticated using (true);
drop policy if exists "admin insert categories" on public.categories;
create policy "admin insert categories" on public.categories for insert to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
drop policy if exists "admin delete categories" on public.categories;
create policy "admin delete categories" on public.categories for delete to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "public read brands" on public.brands;
create policy "public read brands" on public.brands for select to anon, authenticated using (true);
drop policy if exists "admin insert brands" on public.brands;
create policy "admin insert brands" on public.brands for insert to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
drop policy if exists "admin delete brands" on public.brands;
create policy "admin delete brands" on public.brands for delete to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "public read collections" on public.collections;
create policy "public read collections" on public.collections for select to anon, authenticated using (true);
drop policy if exists "admin insert collections" on public.collections;
create policy "admin insert collections" on public.collections for insert to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
drop policy if exists "admin delete collections" on public.collections;
create policy "admin delete collections" on public.collections for delete to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "public read sizes" on public.sizes;
create policy "public read sizes" on public.sizes for select to anon, authenticated using (true);
drop policy if exists "admin insert sizes" on public.sizes;
create policy "admin insert sizes" on public.sizes for insert to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
drop policy if exists "admin delete sizes" on public.sizes;
create policy "admin delete sizes" on public.sizes for delete to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "public read colors" on public.colors;
create policy "public read colors" on public.colors for select to anon, authenticated using (true);
drop policy if exists "admin insert colors" on public.colors;
create policy "admin insert colors" on public.colors for insert to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
drop policy if exists "admin delete colors" on public.colors;
create policy "admin delete colors" on public.colors for delete to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "public read materials" on public.materials;
create policy "public read materials" on public.materials for select to anon, authenticated using (true);
drop policy if exists "admin insert materials" on public.materials;
create policy "admin insert materials" on public.materials for insert to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
drop policy if exists "admin delete materials" on public.materials;
create policy "admin delete materials" on public.materials for delete to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- Product reviews — no account required, same pattern as likes:
-- anyone can read and write, so "Write a review" actually works.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name       text not null,
  rating     int not null check (rating between 1 and 5),
  comment    text not null,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "public read reviews" on public.reviews;
create policy "public read reviews" on public.reviews for select to anon, authenticated using (true);

drop policy if exists "public insert reviews" on public.reviews;
create policy "public insert reviews" on public.reviews for insert to anon, authenticated with check (true);

-- Only an admin can delete a product (everyone else has read-only access, added above).
drop policy if exists "admin delete products" on public.products;
create policy "admin delete products" on public.products for delete to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- NOTE: product_colors / product_sizes below are superseded by
-- product_variants (a size→color matrix: the admin picks a size,
-- then picks which colors exist in that size and the quantity of
-- each). The app no longer reads or writes these two tables — kept
-- only so existing data isn't dropped.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.product_colors (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  color_id   uuid not null references public.colors(id) on delete cascade,
  quantity   int not null default 0 check (quantity >= 0),
  unique (product_id, color_id)
);
create table if not exists public.product_sizes (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size_id    uuid not null references public.sizes(id) on delete cascade,
  quantity   int not null default 0 check (quantity >= 0),
  unique (product_id, size_id)
);

alter table public.product_colors enable row level security;
alter table public.product_sizes  enable row level security;

drop policy if exists "public read product_colors" on public.product_colors;
create policy "public read product_colors" on public.product_colors for select to anon, authenticated using (true);
drop policy if exists "admin write product_colors" on public.product_colors;
create policy "admin write product_colors" on public.product_colors for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "public read product_sizes" on public.product_sizes;
create policy "public read product_sizes" on public.product_sizes for select to anon, authenticated using (true);
drop policy if exists "admin write product_sizes" on public.product_sizes;
create policy "admin write product_sizes" on public.product_sizes for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- Per-product stock as a size→color matrix: a row exists only for a
-- (size, color) combination the admin has actually stocked. Admin
-- flow: pick a size, then pick which colors exist in that size and
-- the quantity of each — not two independent breakdowns.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.product_variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size_id    uuid not null references public.sizes(id) on delete cascade,
  color_id   uuid not null references public.colors(id) on delete cascade,
  quantity   int not null default 0 check (quantity >= 0),
  unique (product_id, size_id, color_id)
);

alter table public.product_variants enable row level security;

drop policy if exists "public read product_variants" on public.product_variants;
create policy "public read product_variants" on public.product_variants for select to anon, authenticated using (true);
drop policy if exists "admin write product_variants" on public.product_variants;
create policy "admin write product_variants" on public.product_variants for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- Return requests — a customer starts one from their order history;
-- one request per order in this simplified flow (no partial/item-level
-- returns). An admin would process it from the order's status.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.return_requests (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  reason     text not null,
  status     text not null default 'requested' check (status in ('requested', 'approved', 'rejected', 'completed')),
  created_at timestamptz not null default now(),
  unique (order_id)
);

alter table public.return_requests enable row level security;

drop policy if exists "own or admin read return_requests" on public.return_requests;
create policy "own or admin read return_requests" on public.return_requests for select to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "own insert return_requests" on public.return_requests;
create policy "own insert return_requests" on public.return_requests for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "admin update return_requests" on public.return_requests;
create policy "admin update return_requests" on public.return_requests for update to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- Coupons — admin-managed codes applied at checkout. Active coupons are
-- publicly readable so the cart can validate a code a customer types in;
-- only an admin can create/edit/delete them.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.coupons (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique,
  discount_type  text not null check (discount_type in ('percent', 'flat')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  active         boolean not null default true,
  expires_at     timestamptz,
  created_at     timestamptz not null default now()
);

alter table public.coupons enable row level security;

drop policy if exists "public read active coupons" on public.coupons;
create policy "public read active coupons" on public.coupons for select to anon, authenticated using (active = true);

drop policy if exists "admin read all coupons" on public.coupons;
create policy "admin read all coupons" on public.coupons for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admin write coupons" on public.coupons;
create policy "admin write coupons" on public.coupons for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
