-- ==============================================================================
-- SCHEMA DATABASE & STORAGE BUCKET: SHOP & DRIVE PONDOK LABU
-- Jalankan skrip SQL ini di SQL Editor pada Dashboard Supabase Anda
-- ==============================================================================

-- 1. Buat Tabel Produk (products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  brand_badge TEXT,
  badge TEXT,
  image_url TEXT NOT NULL,
  description TEXT,
  price_estimate TEXT NOT NULL,
  wa_message TEXT,
  show_in_banner BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexing untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_show_in_banner ON public.products(show_in_banner);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Publik / Pengunjung dapat membaca daftar produk
CREATE POLICY "Public read products"
  ON public.products
  FOR SELECT
  USING (true);

-- Policy: Anon / Authenticated dapat menambah & mengedit produk
CREATE POLICY "Allow anon insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anon update products"
  ON public.products
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow anon delete products"
  ON public.products
  FOR DELETE
  USING (true);

-- 3. Setup Storage Bucket untuk Foto Produk
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy Storage: Publik dapat melihat foto produk
CREATE POLICY "Public view product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

-- Policy Storage: Admin dapat mengunggah foto produk
CREATE POLICY "Allow upload product images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

-- Policy Storage: Admin dapat menghapus foto produk
CREATE POLICY "Allow delete product images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'product-images');
