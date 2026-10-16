# Product Requirements Document (PRD)
**Project Name:** Super Shop&Drive Ampera (Landing Page & CMS)
**Objective:** Membangun *landing page* yang ringan, responsif, dan berorientasi pada konversi (Chat WhatsApp) untuk cabang Ampera, dilengkapi dengan Dashboard Admin (CRUD) mandiri.

## 1. Arsitektur & Teknologi (Tech Stack)
- **Frontend:** React.js dengan Tailwind CSS (Di-generate via Google Stitch).
- **Backend:** Node.js (Express) atau Python (FastAPI) via Antigravity.
- **Database:** SQLite (lokal/ringan) atau Supabase.
- **Deployment & Infrastruktur:** 
  - Frontend Hosting: Vercel / Cloud Run.
  - DNS & CDN: **Cloudflare** (Wajib diaktifkan untuk caching aset gambar dan keamanan tingkat lanjut).
  - Storage: Folder lokal `/assets` (dioptimasi ke format WebP).

## 2. Fitur Utama & Kebutuhan Pengguna
### A. Tampilan Publik (User Facing)
- **Orientasi Performa:** Implementasi *Lazy Loading* untuk gambar dan *section* bawah.
- **CTA Global:** Tombol *Floating* WhatsApp admin yang dinamis (membawa pesan default).
- **Navbar:** Logo cabang, Navigasi (Home, Layanan, Promo, Edukasi, Testimoni).
- **Hero Banner:** Carousel gambar dinamis dari database.
- **Daftar Produk/Layanan:** Grid menampilkan kategori (Aki, Oli, Ban) dengan harga dinamis.
- **Promo & Artikel:** Menampilkan list promo terbaru layaknya blog post.
- **Testimoni:** Slider ringan ulasan pelanggan.
- **Footer:** Google Maps cabang Ampera, jam operasional, link sosial media.

### B. Tampilan Admin (CMS)
- **Autentikasi:** Halaman Login khusus Admin (Protected Route).
- **Dashboard CRUD:**
  1. **Banner Manager:** Upload/Edit banner utama.
  2. **Product Manager:** Tambah, edit, hapus nama layanan/produk, harga, dan gambar.
  3. **Article/Promo Manager:** Tambah, edit, hapus artikel promo (Title, Deskripsi, Gambar).

## 3. Skema Database (Draft)
- `users` (id, username, password_hash, role)
- `banners` (id, image_url, alt_text, is_active)
- `products` (id, category, name, price, image_url, description)
- `articles` (id, title, slug, content, image_url, created_at)

## 4. Alur Integrasi Cloudflare (Deployment)
1. Pointing nameserver domain ke Cloudflare.
2. Setup DNS record (A/CNAME) mengarah ke server hosting (Vercel/Cloud Run).
3. Aktifkan *Auto Minify* (HTML, CSS, JS) di Cloudflare.
4. Set *Browser Cache TTL* minimal 1 bulan untuk folder `/assets`.