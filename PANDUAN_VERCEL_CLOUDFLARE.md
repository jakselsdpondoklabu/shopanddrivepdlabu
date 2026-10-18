# Panduan Lengkap Menghubungkan Domain Cloudflare ke Vercel
### Khusus: Super Shop & Drive Ampera (`shopanddriveampera.com`)

Panduan ini berisi langkah demi langkah menghubungkan domain Anda yang terdaftar/dikelola di **Cloudflare** ke project website Anda di **Vercel**, lengkap dengan konfigurasi SSL/HTTPS agar tidak terjadi error redirect loop atau SSL handshake failed, serta panduan environment variables Supabase agar database tersinkronisasi di semua perangkat.

---

## Daftar Isi
1. [Langkah 1: Tambahkan Domain di Dashboard Vercel](#langkah-1-tambahkan-domain-di-dashboard-vercel)
2. [Langkah 2: Konfigurasi DNS Records di Cloudflare](#langkah-2-konfigurasi-dns-records-di-cloudflare)
3. [Langkah 3: Pengaturan Wajib SSL/TLS di Cloudflare (Kritis)](#langkah-3-pengaturan-wajib-ssltls-di-cloudflare-kritis)
4. [Langkah 4: Konfigurasi Proxy Cloudflare (Orange vs Grey Cloud)](#langkah-4-konfigurasi-proxy-cloudflare-orange-vs-grey-cloud)
5. [Langkah 5: Pengaturan Environment Variables Supabase di Vercel (Sinkronisasi Data)](#langkah-5-pengaturan-environment-variables-supabase-di-vercel)
6. [Troubleshooting & Solusi Error Umum](#troubleshooting--solusi-error-umum)

---

## Langkah 1: Tambahkan Domain di Dashboard Vercel

1. Buka [https://vercel.com](https://vercel.com) dan login ke akun Anda.
2. Masuk ke project website **shopanddriveampera**.
3. Klik tab **Settings** (di menu atas project) -> pilih **Domains** di bilah sisi kiri.
4. Pada kolom **Domain**, ketikkan domain utama Anda:
   - Masukkan: `shopanddriveampera.com` (atau domain yang Anda miliki).
   - Klik tombol **Add**.
5. Vercel akan merekomendasikan opsi:
   - Pilih rekomendasi standar Vercel: **Add `shopanddriveampera.com` and redirect `www.shopanddriveampera.com` to it** (atau sebaliknya).
6. Vercel akan menampilkan instruksi DNS Record yang diperlukan:
   - **Type A**:
     - Name: `@`
     - Value: `76.76.21.21`
   - **Type CNAME**:
     - Name: `www`
     - Value: `cname.vercel-dns.com`

---

## Langkah 2: Konfigurasi DNS Records di Cloudflare

1. Buka tab baru, masuk ke [https://dash.cloudflare.com](https://dash.cloudflare.com) dan login.
2. Klik nama domain Anda pada daftar domain.
3. Di menu sebelah kiri, klik **DNS** -> **Records**.
4. **Periksa record lama:**
   - Jika sudah ada Record `A` dengan nama `@` atau Record `CNAME` dengan nama `www` yang mengarah ke server hosting lama, silakan **Edit** atau **Hapus (Delete)** record lama tersebut terlebih dahulu.
5. **Tambahkan Record A (Apex / Root Domain):**
   - Klik **Add record**.
   - **Type**: `A`
   - **Name**: `@` (atau ketik domain Anda)
   - **IPv4 address**: `76.76.21.21`
   - **Proxy status**: **DNS only** (Awan warna abu-abu / Grey Cloud) terlebih dahulu. *(Setelah sertifikat SSL Vercel terbit, baru boleh diubah ke Proxied).*
   - **TTL**: `Auto`
   - Klik **Save**.
6. **Tambahkan Record CNAME (Subdomain WWW):**
   - Klik **Add record**.
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: **DNS only** (Awan warna abu-abu / Grey Cloud)
   - **TTL**: `Auto`
   - Klik **Save**.

---

## Langkah 3: Pengaturan Wajib SSL/TLS di Cloudflare (Kritis)

> [!CAUTION]
> **Penyebab Terbanyak Error 525 / ERR_TOO_MANY_REDIRECTS:**
> Cloudflare secara default sering kali menggunakan mode SSL **Flexible**. Karena Vercel mewajibkan HTTPS terenkripsi penuh dari hulu ke hilir, mode *Flexible* akan menyebabkan looping tak berujung (*Too Many Redirects*).

1. Di dashboard Cloudflare domain Anda, buka menu sebelah kiri: **SSL/TLS** -> **Overview**.
2. Ubah mode enkripsi menjadi:
   - **Full** atau **Full (strict)** *(Sangat direkomendasikan Full atau Full (strict))*.
   - **JANGAN** pilih *Off* atau *Flexible*.
3. Masuk ke submenu **Edge Certificates** (di bawah SSL/TLS):
   - Pastikan **Always Use HTTPS** diubah menjadi **ON** (Aktif).
   - Pastikan **Automatic HTTPS Rewrites** diubah menjadi **ON**.
   - Minimum TLS Version: disarankan `TLS 1.2` atau `TLS 1.3`.

---

## Langkah 4: Konfigurasi Proxy Cloudflare (Orange vs Grey Cloud)

Cloudflare memiliki dua mode untuk setiap DNS record:
- **DNS Only (Awan Abu-abu / Grey Cloud)**: Traffic langsung ke Vercel tanpa melewati firewall Cloudflare.
- **Proxied (Awan Oranye / Orange Cloud)**: Traffic melewati CDN Cloudflare, proteksi DDoS, caching, dan WAF.

### Alur Rekomendasi:
1. **Fase Verifikasi Awal (5 - 15 Menit Pertama):**
   - Biarkan kedua record (`@` dan `www`) pada posisi **DNS Only (Awan Abu-abu)**.
   - Buka kembali dashboard Vercel -> tab **Settings** -> **Domains**.
   - Klik tombol **Refresh** di samping domain Anda.
   - Tunggu hingga status di Vercel berubah dari status *Invalid Configuration* / *Pending Verification* menjadi centang hijau **Valid Configuration** dan SSL Certificate berhasil digenerate oleh Vercel.
2. **Fase Setelah Valid (Opsional & Direkomendasikan):**
   - Jika Anda ingin mendapatkan manfaat penuh Cloudflare (DDoS protection, CDN global caching, WAF):
   - Kembali ke Cloudflare DNS -> Edit record `@` dan `www` -> Ubah Proxy Status menjadi **Proxied (Awan Oranye)** -> Klik **Save**.
   - *Catatan:* Karena Anda sudah mengatur SSL/TLS Cloudflare ke mode **Full (strict)** di Langkah 3, website akan berjalan aman, kencang, dan bebas error.

---

## Langkah 5: Pengaturan Environment Variables Supabase di Vercel

> [!IMPORTANT]
> **Mengapa data yang disimpan di komputer satu tidak muncul di komputer lain saat membuka domain Vercel?**
> File `.env` lokal tidak diunggah ke Git (demi keamanan). Ketika Vercel melakukan build aplikasi, jika environment variables Supabase belum didaftarkan di Vercel Dashboard, aplikasi akan mengira database cloud belum disetel, sehingga perubahan hanya tersimpan di memori browser lokal (*localStorage*) komputer tersebut.

Untuk mengaktifkan sinkronisasi otomatis antar komputer/laptop/HP:

1. Buka dashboard Vercel: [https://vercel.com](https://vercel.com).
2. Pilih project **shopanddriveampera**.
3. Masuk ke menu **Settings** -> pilih **Environment Variables**.
4. Tambahkan 2 variabel berikut:

   **Variabel 1:**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://zhlbucryrtdrryqwswsd.supabase.co`
   - Centang target: **Production**, **Preview**, dan **Development**.
   - Klik **Save**.

   **Variabel 2:**
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobGJ1Y3J5cnRkcnJ5cXdzd3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNDM0OTEsImV4cCI6MjEwNzcxOTQ5MX0.VGjp2Warw54J_v5hgG2Haik6RkY9K43PvjCddNCPGU8`
   - Centang target: **Production**, **Preview**, dan **Development**.
   - Klik **Save**.

5. **Lakukan Redeploy:**
   - Masuk ke tab **Deployments** di Vercel.
   - Klik titik tiga `...` di deployment teratas (Production) -> pilih **Redeploy**.
   - Tunggu proses build selesai (~1 menit).

*(Sistem aplikasi juga telah diperbarui dengan safe fallback bawaan, sehingga meskipun lupa memasukkan env variable di Vercel, website akan tetap otomatis terhubung ke Supabase).*

---

## Troubleshooting & Solusi Error Umum

### 1. Error `ERR_TOO_MANY_REDIRECTS`
- **Penyebab**: Mode SSL/TLS di Cloudflare masih diset ke *Flexible*.
- **Solusi**: Masuk ke Cloudflare -> SSL/TLS -> Ubah dari *Flexible* menjadi **Full** atau **Full (strict)**.

### 2. Error `Error 525: SSL Handshake Failed`
- **Penyebab**: Vercel belum selesai menerbitkan sertifikat SSL saat Cloudflare sudah di-set ke mode Proxied.
- **Solusi**: Di Cloudflare DNS, ubah status Proxy menjadi **DNS Only (Awan Abu-abu)** selama 10 menit. Buka Vercel -> Domains -> klik Refresh hingga SSL Vercel aktif, lalu ubah kembali ke Proxied.

### 3. Domain masih berstatus "Pending Verification" di Vercel
- **Penyebab**: Propagasi DNS di internet membutuhkan waktu 5-30 menit.
- **Solusi**: Cek apakah IP `76.76.21.21` sudah benar diketik tanpa ada spasi atau titik berlebih. Anda bisa mengecek status propagasi melalui situs [whatsmydns.net](https://www.whatsmydns.net/#A/).

---
*Dokumentasi ini dibuat untuk Super Shop & Drive Ampera. Simpan file ini untuk referensi maintenance berkala.*
