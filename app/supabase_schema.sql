-- ==============================================================================
-- SKEMA DATABASE SUPABASE UNTUK SUPER SHOP & DRIVE AMPERA
-- Jalankan query ini di SQL Editor Supabase (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. TABEL KONTEN SITUS UTAMA (Hero Banners, Jam Buka, Promo, Layanan, Brand, dll.)
create table if not exists site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) untuk site_content
alter table site_content enable row level security;

-- Izinkan semua orang (publik/pengunjung) membaca konten website
drop policy if exists "Izinkan publik membaca konten situs" on site_content;
create policy "Izinkan publik membaca konten situs"
  on site_content for select
  using (true);

-- Izinkan insert/update (upsert) konten website
drop policy if exists "Izinkan admin menyimpan konten situs" on site_content;
create policy "Izinkan admin menyimpan konten situs"
  on site_content for all
  using (true)
  with check (true);


-- 2. TABEL KATALOG PRODUK & SUKU CADANG (Jika belum dibuat)
create table if not exists products (
  id text primary key,
  name text not null,
  category text not null,
  brand_badge text,
  badge text,
  image_url text,
  description text,
  price_estimate text,
  wa_message text,
  show_in_banner boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) untuk products
alter table products enable row level security;

drop policy if exists "Izinkan publik membaca produk" on products;
create policy "Izinkan publik membaca produk"
  on products for select
  using (true);

drop policy if exists "Izinkan admin mengelola produk" on products;
create policy "Izinkan admin mengelola produk"
  on products for all
  using (true)
  with check (true);
