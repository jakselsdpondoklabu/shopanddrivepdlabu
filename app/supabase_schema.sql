-- ==============================================================================
-- SCHEMA DATABASE & STORAGE BUCKET: SHOP & DRIVE PONDOK LABU
-- Jalankan skrip SQL ini di SQL Editor pada Dashboard Supabase Anda
-- Skrip ini sepenuhnya idempotent (aman dijalankan berulang kali tanpa error)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABEL KONTEN SITUS UTAMA (site_content)
-- Menyimpan konfigurasi dinamis (hero banners, jam operasional, promo, brand, dll)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
CREATE POLICY "Public read site_content"
  ON public.site_content
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow anon manage site_content" ON public.site_content;
CREATE POLICY "Allow anon manage site_content"
  ON public.site_content
  FOR ALL
  USING (true)
  WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 2. TABEL KATALOG PRODUK & SUKU CADANG (products)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  brand_badge TEXT,
  badge TEXT,
  image_url TEXT NOT NULL,
  description TEXT,
  price_estimate TEXT NOT NULL,
  discount_trade_in TEXT,
  wa_message TEXT,
  show_in_banner BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pastikan kolom discount_trade_in ada jika tabel sudah terlanjur dibuat sebelumnya
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_trade_in TEXT;

-- Indexing untuk kecepatan filter & query
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_show_in_banner ON public.products(show_in_banner);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products"
  ON public.products
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow anon insert products" ON public.products;
CREATE POLICY "Allow anon insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update products" ON public.products;
CREATE POLICY "Allow anon update products"
  ON public.products
  FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow anon delete products" ON public.products;
CREATE POLICY "Allow anon delete products"
  ON public.products
  FOR DELETE
  USING (true);


-- ------------------------------------------------------------------------------
-- 3. SEED DATA AWAL PRODUK (Agar tabel tidak kosong)
-- ------------------------------------------------------------------------------
INSERT INTO public.products (id, name, category, brand_badge, badge, image_url, description, price_estimate, discount_trade_in, wa_message, show_in_banner)
VALUES
  ('prod-1', 'Aki GS Astra Maintenance Free (Kering)', 'Aki Mobil', 'GS Astra', 'Garansi 24 Bulan', '/Assets/ganti aki.jpg', 'Bebas perawatan tanpa perlu isi air aki. Daya start tinggi dan umur pakai panjang untuk berbagai jenis mobil Jepang dan Eropa.', 'Rp 850.000', 'Trade-in aki s/d Rp 150.000', 'Halo Shop & Drive Pondok Labu, saya ingin tanya ketersediaan Aki GS Astra MF', true),
  ('prod-2', 'Aki Incoe Gold & Maintenance Free', 'Aki Mobil', 'Incoe Astra', 'Ekonomis & Handal', '/Assets/ganti aki.jpg', 'Produk resmi Astra Otoparts dengan harga terjangkau dan kualitas teruji untuk penggunaan harian.', 'Rp 680.000', 'Trade-in aki s/d Rp 120.000', 'Halo Shop & Drive Pondok Labu, saya ingin tanya harga Aki Incoe', true),
  ('prod-3', 'Oli Shell Helix HX8 5W-30 Synthetic', 'Oli Mesin', 'Shell', 'Fully Synthetic', '/Assets/ganti oli.webp', 'Formula Flexi Molecule Technology memberikan perlindungan maksimal mesin bensin modern terhadap keausan dan suhu ekstrem.', 'Rp 165.000', 'Gratis Biaya Jasa Ganti Oli', 'Halo Shop & Drive Pondok Labu, saya ingin beli Oli Shell Helix HX8 5W-30', true),
  ('prod-4', 'Oli Pertamina Fastron Gold 5W-30', 'Oli Mesin', 'Fastron', 'Resmi Pertamina', '/Assets/ganti oli.webp', 'Pelumas mesin bensin sintetis premium standar API SN/GF-5 untuk mesin turbo dan mobil berteknologi katup variabel.', 'Rp 145.000', 'Gratis Filter Oli (Syarat Berlaku)', 'Halo Shop & Drive Pondok Labu, saya ingin pesan Oli Pertamina Fastron Gold', true),
  ('prod-5', 'Shock Absorber Kayaba (KYB) Excel-G', 'Suspensi', 'Kayaba', 'Original Astra', '/Assets/bg3.jpg', 'Gas shock absorber performa tinggi untuk mobil Avanza, Innova, Xpander, Mobilio, Brio, Jazz, dan SUV harian.', 'Rp 750.000', 'Gratis Cek Kaki-Kaki & Diskon Pemasangan', 'Halo Shop & Drive Pondok Labu, saya ingin cek ketersediaan Shock Kayaba Excel-G', true),
  ('prod-6', 'Ban Bridgestone Ecopia & Turanza', 'Ban Mobil', 'Bridgestone', 'DOT Terbaru', '/Assets/bg2.jpg', 'Pilihan ban hemat bahan bakar dan senyap untuk kenyamanan berkendara di jalan perkotaan dan jalan tol.', 'Rp 650.000', 'Gratis Pasang, Balancing & Nitrogen', 'Halo Shop & Drive Pondok Labu, saya ingin tanya ukuran Ban Bridgestone', false),
  ('prod-7', 'Filter Oli Original Astra Otoparts', 'Suku Cadang', 'Aspira / Astra', 'OEM Standard', '/Assets/bg1.jpeg', 'Menyaring partikel kotoran dan serpihan gram besi halus pada oli mesin agar sirkulasi pelumasan tetap bersih sempurna.', 'Rp 45.000', 'Diskon 10% Pembelian Bundling Oli', 'Halo Shop & Drive Pondok Labu, saya ingin beli filter oli original Astra', false),
  ('prod-8', 'Kampas Rem Akebono / Aspira Original', 'Pengereman', 'Akebono', 'Pakem & Tidak Berisik', '/Assets/bg3.jpg', 'Brake pad tahan panas tinggi, tidak mengikis piringan cakram, dan memberikan daya henti responsif.', 'Rp 220.000', 'Gratis Cek Ketebalan Rem & Pembersihan', 'Halo Shop & Drive Pondok Labu, saya ingin tanya harga kampas rem Akebono', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  brand_badge = EXCLUDED.brand_badge,
  badge = EXCLUDED.badge,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description,
  price_estimate = EXCLUDED.price_estimate,
  discount_trade_in = EXCLUDED.discount_trade_in,
  wa_message = EXCLUDED.wa_message,
  show_in_banner = EXCLUDED.show_in_banner;


-- ------------------------------------------------------------------------------
-- 4. SETUP STORAGE BUCKET UNTUK FOTO PRODUK
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Hapus policy storage lama sebelum membuat yang baru (mencegah error 42710)
DROP POLICY IF EXISTS "Public view product images" ON storage.objects;
CREATE POLICY "Public view product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow upload product images" ON storage.objects;
CREATE POLICY "Allow upload product images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow update product images" ON storage.objects;
CREATE POLICY "Allow update product images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow delete product images" ON storage.objects;
CREATE POLICY "Allow delete product images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'product-images');
