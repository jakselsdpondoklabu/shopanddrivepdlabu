export const defaultSiteContent = {
  brand: {
    name: "SUPER SHOP & DRIVE",
    subName: "AMPERA WORKSHOP",
    tagline: "The Trusted Parts Shop",
    logoUrl: "/Assets/logo.png",
    phone: "(021) 780-0285",
    whatsappNumber: "6285117150285",
    whatsappDefaultMessage: "Halo Super Shop & Drive Ampera, saya ingin konsultasi dan booking servis kendaraan.",
    address: "JL. Ampera Raya no.138 Ragunan, Pasar Minggu, Jakarta Selatan",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.856012479679!2d106.8177779758839!3d-6.282211310645697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f21e06f977d7%3A0x6b107e3a19b46617!2sSuper%20Shop%20%26%20Drive%20Ampera!5e0!3m2!1sid!2sid!4v1715000000000!5m2!1sid!2sid",
    mapsGoogleUrl: "https://maps.app.goo.gl/L2SixLAy1RxhCHbk8",
    coordinates: "-6.282211310645697, 106.82035294973412",
    operationalHours: "08.00 s/d 20.00 WIB (Buka Setiap Hari)",
    instagram: "@shopanddrive",
    instagramUrl: "https://instagram.com/shopanddrive",
  },
  storeStatus: {
    mode: "auto", // "auto" | "open" | "closed"
    openTime: "08:00",
    closeTime: "20:00",
    statusNote: "Buka Setiap Hari",
  },
  hero: {
    badgeText: "Super Shop & Drive Ampera • Pusat Servis & Suku Cadang Resmi Astra",
    headline: "Servis & Perawatan Mobil Presisi",
    headlineHighlight: "Super Shop & Drive Ampera",
    subheadline: "Solusi cepat, terpercaya, dan bergaransi resmi dari Astra Otoparts untuk ratusan tipe kendaraan Anda di Jakarta Selatan. Tersedia layanan di bengkel & Home Delivery Service.",
    bgImage: "/Assets/bg1.jpeg",
    availableBgImages: [
      { id: "bg1", label: "Foto Servis Workshop (bg1)", path: "/Assets/bg1.jpeg" },
      { id: "bg2", label: "Motor Delivery Armada (bg2)", path: "/Assets/bg2.jpg" },
      { id: "bg3", label: "Ganti Suku Cadang Lokasi (bg3)", path: "/Assets/bg3.jpg" },
    ],
    ctaText: "Booking via WhatsApp",
    secondaryCtaText: "Lihat Layanan Bengkel",
    stats: [
      { value: "15+ Th", label: "Pengalaman Teknisi" },
      { value: "50.000+", label: "Mobil Ditangani" },
      { value: "100% Asli", label: "Garansi Suku Cadang" },
      { value: "Hunter 3D", label: "Standar Pabrikan" },
    ]
  },
  // 7 Layanan Bengkel (Jasa / Service)
  services: [
    {
      id: "srv-aki",
      title: "Jasa Ganti Aki Mobil",
      badge: "Layanan Populer",
      badgeColor: "bg-[#E3000F] text-white",
      image: "/Assets/ganti aki.jpg",
      description: "Gratis pasang di bengkel atau delivery ke lokasi. Termasuk cek alternator dinamo pengisian, kebocoran arus, dan pembersihan kutub aki.",
      priceEstimate: "Gratis Pasang",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin booking jasa ganti aki mobil"
    },
    {
      id: "srv-oli",
      title: "Paket Servis Ganti Oli",
      badge: "Cepat & Rapi",
      badgeColor: "bg-[#002884] text-white",
      image: "/Assets/ganti oli.webp",
      description: "Penggantian pelumas mesin menggunakan mesin sedot modern, penggantian filter oli presisi, serta gratis 24 poin inspeksi keselamatan.",
      priceEstimate: "Gratis Jasa Cek 24 Poin",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin jadwal paket servis ganti oli"
    },
    {
      id: "srv-shock",
      title: "Ganti Shock Absorber & Kaki-Kaki",
      badge: "Kenyamanan Prima",
      badgeColor: "bg-[#00662C] text-white",
      image: "/Assets/bg3.jpg",
      description: "Pemasangan shock absorber KYB bergaransi resmi. Memulihkan bantingan empuk, meredam limbung saat tikungan, dan menjaga keawetan ban.",
      priceEstimate: "Mulai Rp 150.000 (Jasa)",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin jadwal pemasangan shock absorber"
    },
    {
      id: "srv-ban",
      title: "Bongkar Pasang & Ganti Ban",
      badge: "Presisi & Rapi",
      badgeColor: "bg-[#002884] text-white",
      image: "/Assets/bg2.jpg",
      description: "Pemasangan ban menggunakan mesin tyre changer otomatis tanpa merusak velg, gratis pentil baru dan pengisian nitrogen murni.",
      priceEstimate: "Mulai Rp 35.000 / Roda",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin pasang dan ganti ban baru"
    },
    {
      id: "srv-spooring",
      title: "Spooring 3D & Finish Balancing",
      badge: "Hunter 3D High Precision",
      badgeColor: "bg-[#008239] text-white",
      image: "/Assets/bg1.jpeg",
      description: "Penyelarasan sudut camber, caster, dan toe dengan sensor optik Hunter 3D Germany. Menghilangkan getaran setir dan mencegah keausan ban tidak rata.",
      priceEstimate: "Mulai Rp 250.000",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin booking spooring balancing 3D"
    },
    {
      id: "srv-tuneup",
      title: "Paket Tune-Up & Gurah Mesin",
      badge: "Performa Maksimal",
      badgeColor: "bg-[#E3000F] text-white",
      image: "/Assets/bg3.jpg",
      description: "Pembersihan kerak ruang bakar (carbon cleaner), throttle body injection, kalibrasi busi, dan scan OBD2 komputer untuk tarikan enteng dan irit BBM.",
      priceEstimate: "Mulai Rp 450.000",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin booking paket tune-up mesin mobil"
    },
    {
      id: "srv-kakikaki",
      title: "Cek & Penggantian Kaki-Kaki",
      badge: "Hilangkan Bunyi Kasar",
      badgeColor: "bg-[#3E58B2] text-white",
      image: "/Assets/bg2.jpg",
      description: "Pemeriksaan dan rekondisi/penggantian ball joint, tie rod end, link stabilizer, dan bushing arm agar bantingan senyap dan stabil di jalan berlubang.",
      priceEstimate: "Mulai Rp 100.000 (Inspeksi)",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin cek kondisi kaki-kaki mobil"
    }
  ],
  // Produk / Suku Cadang Fisik (Dipisahkan dari Layanan)
  products: [
    {
      id: "prod-1",
      name: "Aki GS Astra Maintenance Free (Kering)",
      category: "Aki Mobil",
      badge: "Garansi 24 Bulan",
      brandBadge: "GS Astra",
      image: "/Assets/ganti aki.jpg",
      description: "Bebas perawatan tanpa perlu isi air aki. Daya start tinggi dan umur pakai panjang untuk berbagai jenis mobil Jepang dan Eropa.",
      priceEstimate: "Mulai Rp 850.000",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin tanya ketersediaan Aki GS Astra MF",
      showInBanner: true,
    },
    {
      id: "prod-2",
      name: "Aki Incoe Gold & Maintenance Free",
      category: "Aki Mobil",
      badge: "Ekonomis & Handal",
      brandBadge: "Incoe Astra",
      image: "/Assets/ganti aki.jpg",
      description: "Produk resmi Astra Otoparts dengan harga terjangkau dan kualitas teruji untuk penggunaan harian.",
      priceEstimate: "Mulai Rp 680.000",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin tanya harga Aki Incoe",
      showInBanner: true,
    },
    {
      id: "prod-3",
      name: "Oli Shell Helix HX8 5W-30 Synthetic",
      category: "Oli Mesin",
      badge: "Fully Synthetic",
      brandBadge: "Shell",
      image: "/Assets/ganti oli.webp",
      description: "Formula Flexi Molecule Technology memberikan perlindungan maksimal mesin bensin modern terhadap keausan dan suhu ekstrem.",
      priceEstimate: "Rp 165.000 / Liter",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin beli Oli Shell Helix HX8 5W-30",
      showInBanner: true,
    },
    {
      id: "prod-4",
      name: "Oli Pertamina Fastron Gold 5W-30",
      category: "Oli Mesin",
      badge: "Resmi Pertamina",
      brandBadge: "Fastron",
      image: "/Assets/ganti oli.webp",
      description: "Pelumas mesin bensin sintetis premium standar API SN/GF-5 untuk mesin turbo dan mobil berteknologi katup variabel.",
      priceEstimate: "Rp 145.000 / Liter",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin pesan Oli Pertamina Fastron Gold",
      showInBanner: true,
    },
    {
      id: "prod-5",
      name: "Shock Absorber Kayaba (KYB) Excel-G",
      category: "Suspensi",
      badge: "Original Astra",
      brandBadge: "Kayaba",
      image: "/Assets/bg3.jpg",
      description: "Gas shock absorber performa tinggi untuk mobil Avanza, Innova, Xpander, Mobilio, Brio, Jazz, dan SUV harian.",
      priceEstimate: "Mulai Rp 750.000 / Set",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin cek ketersediaan Shock Kayaba Excel-G",
      showInBanner: true,
    },
    {
      id: "prod-6",
      name: "Ban Bridgestone Ecopia & Turanza",
      category: "Ban Mobil",
      badge: "DOT Terbaru",
      brandBadge: "Bridgestone",
      image: "/Assets/bg2.jpg",
      description: "Pilihan ban hemat bahan bakar dan senyap untuk kenyamanan berkendara di jalan perkotaan dan jalan tol.",
      priceEstimate: "Mulai Rp 650.000 / Pcs",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin tanya ukuran Ban Bridgestone",
      showInBanner: false,
    },
    {
      id: "prod-7",
      name: "Filter Oli Original Astra Otoparts",
      category: "Suku Cadang",
      badge: "OEM Standard",
      brandBadge: "Aspira / Astra",
      image: "/Assets/bg1.jpeg",
      description: "Menyaring partikel kotoran dan serpihan gram besi halus pada oli mesin agar sirkulasi pelumasan tetap bersih sempurna.",
      priceEstimate: "Mulai Rp 45.000",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin beli filter oli original Astra",
      showInBanner: false,
    },
    {
      id: "prod-8",
      name: "Kampas Rem Akebono / Aspira Original",
      category: "Pengereman",
      badge: "Pakem & Tidak Berisik",
      brandBadge: "Akebono",
      image: "/Assets/bg3.jpg",
      description: "Brake pad tahan panas tinggi, tidak mengikis piringan cakram, dan memberikan daya henti responsif.",
      priceEstimate: "Mulai Rp 220.000 / Set",
      waMessage: "Halo Super Shop & Drive Ampera, saya ingin tanya harga kampas rem Akebono",
      showInBanner: false,
    }
  ],
  promo: {
    isActive: true,
    badgeText: "Penawaran Terbatas Bulan Ini",
    title: "Promo Spesial Ampera: Diskon Paket Tune-Up + Free Cek Rem!",
    description: "Segera pulihkan tenaga mesin mobil Anda agar kembali bertenaga dan irit bahan bakar. Berlaku untuk kendaraan bensin maupun diesel di Cabang Ampera.",
    promoCode: "AMPERAPRO20",
    ctaText: "Klaim Diskon via WhatsApp",
    waMessage: "Halo Super Shop & Drive Ampera, saya ingin klaim promo diskon AMPERAPRO20",
    articles: [
      {
        id: "art-1",
        category: "Tips Aki",
        readTime: "5 Menit Baca",
        date: "Update Terbaru",
        title: "Kenali 5 Tanda Aki Mobil Mulai Lemah Sebelum Mogok di Jalan",
        summary: "Jangan tunggu starter mobil berputar lambat di pagi hari. Pahami gejala penurunan voltase, suara klik, dan cara cek kelistrikan mandiri.",
        waTopic: "Halo Super Shop & Drive Ampera, saya ingin konsultasi cek aki mobil"
      },
      {
        id: "art-2",
        category: "Perawatan Oli",
        readTime: "4 Menit Baca",
        date: "Update Terbaru",
        title: "Kapan Waktu Tepat Mengganti Oli Mesin? Kilometer vs Durasi Bulan",
        summary: "Sering macet di Jakarta Selatan? Ketahui mengapa jam kerja mesin (engine hours) lebih menentukan penggantian oli daripada angka odometer.",
        waTopic: "Halo Super Shop & Drive Ampera, saya ingin tanya jadwal ganti oli yang tepat"
      },
      {
        id: "art-3",
        category: "Kenyamanan & Rem",
        readTime: "6 Menit Baca",
        date: "Update Terbaru",
        title: "Bahaya Mengabaikan Bunyi Gluduk Kaki-Kaki dan Berdecit pada Rem",
        summary: "Karet bushing getas atau kampas rem tipis dapat merusak piringan rotor cakram dan membahayakan kendali di jalan basah.",
        waTopic: "Halo Super Shop & Drive Ampera, saya ingin cek rem dan suspensi kaki-kaki"
      }
    ]
  },
  testimonials: {
    score: "4.9",
    totalReviews: "1.420+",
    subtitle: "Kepuasan ribuan pemilik mobil di Ampera, Cilandak, Kemang, dan sekitarnya yang mempercayakan kendaraannya kepada Super Shop & Drive Ampera.",
    items: [
      {
        id: "testi-1",
        initials: "HW",
        avatarBg: "bg-[#002884]",
        name: "Hendra Wijaya",
        vehicle: "Honda CR-V Turbo • Ampera Raya",
        rating: 5,
        review: "Bengkel paling jujur dan transparan di Jakarta Selatan. Diagnosa masalah kaki-kaki tepat sasaran, estimasi biaya dijelaskan di awal tanpa biaya siluman. Sangat recommended!"
      },
      {
        id: "testi-2",
        initials: "SN",
        avatarBg: "bg-[#E3000F]",
        name: "dr. Siti Nurhaliza",
        vehicle: "Toyota Yaris GR Sport • Kemang",
        rating: 5,
        review: "Pelayanan cepat dan ruang tunggu AC sangat nyaman. Bisa booking via WhatsApp dulu jadi gak perlu antre berjam-jam saat ganti aki & oli sebelum praktik di RS."
      },
      {
        id: "testi-3",
        initials: "BS",
        avatarBg: "bg-[#008239]",
        name: "Budi Santoso",
        vehicle: "Mitsubishi Pajero Sport • Cilandak",
        rating: 5,
        review: "Spooring 3D presisi sekali, setir yang tadinya narik ke kiri sekarang lurus stabil saat melaju di tol TB Simatupang. Teknisi paham betul spesifikasi suspensi mobil besar."
      }
    ]
  }
};
