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
