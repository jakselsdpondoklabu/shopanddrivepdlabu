# Panduan Lengkap Konfigurasi & Optimasi SEO
### Shop & Drive Pondok Labu (`shopanddrivepdlabu.com`)

Panduan ini berisi penjelasan konfigurasi teknis SEO yang telah diterapkan pada website Anda, serta langkah demi langkah mendaftarkan website ke **Google Search Console**, **Google Maps (Local SEO)**, dan mesin pencari modern berbasis AI (Google AI Mode, ChatGPT Search, Perplexity).

---

## Daftar Isi
1. [Ringkasan Konfigurasi SEO yang Sudah Diterapkan](#1-ringkasan-konfigurasi-seo-yang-sudah-diterapkan)
2. [Langkah 1: Daftarkan Website ke Google Search Console](#2-langkah-1-daftarkan-website-ke-google-search-console)
3. [Langkah 2: Submit Sitemap XML ke Google](#3-langkah-2-submit-sitemap-xml-ke-google)
4. [Langkah 3: Sinkronisasi Google Business Profile (Local SEO Maps)](#4-langkah-3-sinkronisasi-google-business-profile-local-seo-maps)
5. [Langkah 4: Daftarkan ke Bing Webmaster Tools](#5-langkah-4-daftarkan-ke-bing-webmaster-tools)
6. [Penjelasan File Teknis SEO di Website](#6-penjelasan-file-teknis-seo-di-website)
7. [Target Kata Kunci Lokal (Local Keywords Checklist)](#7-target-kata-kunci-lokal-local-keywords-checklist)

---

## 1. Ringkasan Konfigurasi SEO yang Sudah Diterapkan

Sistem website kini telah dilengkapi fondasi SEO modern:
- ✅ **Meta Tags Lengkap**: Judul, deskripsi, kata kunci lokal, canonical URL, dan author.
- ✅ **Open Graph & Twitter Card**: Tampilan kartu pratinjau yang menarik saat link website dibagikan ke WhatsApp, Telegram, Facebook, dan Twitter.
- ✅ **Geo Meta Tags**: Koordinat GPS (`-6.282291, 106.819607`) dan wilayah (*Jakarta Selatan, ID-JK*) untuk mendongkrak peringkat pencarian lokal.
- ✅ **Structured Data (JSON-LD Schema.org)**: Format data resmi `AutoRepair` & `AutomotiveBusiness` yang terbaca oleh Google Rich Results dan AI Search Engine.
- ✅ **robots.txt**: Mengizinkan Googlebot, Bingbot, serta AI crawler resmi (GPTBot, ClaudeBot, PerplexityBot, Applebot).
- ✅ **sitemap.xml**: Peta indeks seluruh bagian website dan gambar banner untuk indexing cepat.
- ✅ **llms.txt**: Standar indeks rujukan AI generasi baru (GEO / Generative Engine Optimization) agar Shop & Drive Pondok Labu dikutip langsung oleh ChatGPT dan Google AI Overviews.

---

## 2. Langkah 1: Daftarkan Website ke Google Search Console

Google Search Console (GSC) adalah alat resmi dari Google agar website Anda terindeks dan muncul di halaman hasil pencarian Google.

1. Buka [https://search.google.com/search-console](https://search.google.com/search-console) dan login dengan akun Google bengkel.
2. Pada bagian **Pilih jenis properti**:
   - Pilih opsi **Awalan URL (URL Prefix)**.
   - Masukkan: `https://shopanddrivepdlabu.com`
   - Klik **Lanjutkan (Continue)**.
3. **Verifikasi Kepemilikan (Pilih salah satu cara tercepat):**
   - **Cara A (Rekomendasi via Cloudflare DNS - Paling Kuat):**
     * Pilih opsi verifikasi **Penyedia nama domain (Domain Name Provider)**.
     * Salin kode TXT yang diberikan Google (misal: `google-site-verification=xxxx...`).
     * Buka dashboard **Cloudflare** ➔ pilih domain Anda ➔ menu **DNS** ➔ **Records** ➔ **Add Record**:
       - Type: `TXT`
       - Name: `@`
       - Content: Tempel kode dari Google tadi.
       - TTL: `Auto`
       - Klik **Save**.
     * Kembali ke Google Search Console dan klik tombol **Verifikasi (Verify)**.
   - **Cara B (via Tag HTML):**
     * Salin meta tag yang diberikan Google, lalu tempelkan di bagian `<head>` pada file `index.html`.

---

## 3. Langkah 2: Submit Sitemap XML ke Google

Setelah properti terverifikasi di Google Search Console:

1. Di menu bilah sisi kiri Google Search Console, klik menu **Peta Situs (Sitemaps)**.
2. Pada kolom **Tambahkan peta situs baru (Add a new sitemap)**, ketik:
   ```
   sitemap.xml
   ```
3. Klik tombol **Kirim (Submit)**.
4. Status akan berubah menjadi centang hijau **Berhasil (Success)**.
5. Googlebot kini akan secara otomatis merayapi beranda, katalog produk, katalog layanan, promo, dan jam operasional bengkel secara berkala.

---

## 4. Langkah 3: Sinkronisasi Google Business Profile (Local SEO Maps)

Untuk bengkel fisik seperti Shop & Drive Pondok Labu, 70% pencarian pelanggan berasal dari **Google Maps ("ganti aki terdekat", "bengkel mobil dekat sini")**.

1. Buka [https://business.google.com](https://business.google.com) atau cari *"Shop & Drive - Pondok Labu"* di Google Maps saat login dengan akun admin toko.
2. Klik **Edit Profil (Edit Profile)**:
   - **Situs Web (Website)**: Pastikan terisi persis: `https://shopanddrivepdlabu.com`
   - **Nama Bisnis**: `Shop & Drive - Pondok Labu, Jakarta Selatan`
   - **Alamat**: `JL. Pondok Labu Raya no.138 Ragunan, Ps. Minggu, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12560`
   - **Nomor Telepon**: `(021) 780-0285` dan nomor WA `0851-1715-0285`.
   - **Jam Buka**: `Setiap Hari 08.00 - 20.00 WIB`.
3. Mengapa ini sangat penting?
   Konsistensi NAP (*Name, Address, Phone*) antara Google Maps dan data JSON-LD di website akan membuat Google memberikan skor otoritas tertinggi untuk ranking nomor 1 pada pencarian lokal kawasan Pondok Labu, Ragunan, Cilandak, Kemang, dan Pasar Minggu.

---

## 5. Langkah 4: Daftarkan ke Bing Webmaster Tools

1. Buka [https://www.bing.com/webmasters](https://www.bing.com/webmasters).
2. Login dan pilih opsi **Impor dari Google Search Console (Import from GSC)**.
3. Hanya dengan 1 klik, website akan langsung terverifikasi di mesin pencari Bing, Yahoo, dan asisten Microsoft Copilot tanpa perlu setting ulang DNS.

---

## 6. Penjelasan File Teknis SEO di Website

| File | Lokasi | Fungsi |
|---|---|---|
| **`index.html`** | `app/index.html` | Memuat meta tags, Geo tags, Open Graph (WhatsApp preview), dan Schema JSON-LD `AutoRepair`. |
| **`robots.txt`** | `app/public/robots.txt` | Memberikan izin resmi bagi Googlebot, Bingbot, dan AI Crawler (GPTBot, ClaudeBot, PerplexityBot) untuk merayapi konten. |
| **`sitemap.xml`** | `app/public/sitemap.xml` | Peta halaman dan gambar untuk Google Search Console. |
| **`llms.txt`** | `app/public/llms.txt` | Dokumen data terstruktur untuk AI Overviews & ChatGPT Search saat pengguna mencari rekomendasi bengkel resmi. |
| **`vercel.json`** | `app/vercel.json` | Mengatur caching header dan memastikan `sitemap.xml` disajikan dengan format XML murni. |

---

## 7. Target Kata Kunci Lokal (Local Keywords Checklist)

Halaman website dan metadata telah dioptimasi untuk menjaring kata kunci berdaya beli tinggi (high commercial intent) berikut:

- 🔋 **Aki Mobil & Delivery**:
  - *"ganti aki mobil pondok labu"*
  - *"toko aki gs astra fatmawati"*
  - *"battery home delivery pondok labu"*
  - *"tukar tambah aki bekas cilandak cinere"*
- 🛢️ **Oli Mesin**:
  - *"bengkel ganti oli pondok labu fatmawati"*
  - *"oli shell helix original jakarta selatan"*
  - *"promo ganti oli gratis jasa pondok labu"*
- 🚗 **Kaki-Kaki & Ban**:
  - *"spooring balancing pondok labu"*
  - *"bengkel shock absorber kyb fatmawati"*
  - *"toko ban bridgestone pondok labu"*

---
*Dokumentasi ini disiapkan khusus untuk Shop & Drive Pondok Labu.*
