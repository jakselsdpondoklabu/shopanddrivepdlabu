import React, { useState, useEffect, useMemo } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingAction } from './FloatingAction';

export function EdukasiPage({ onBackToHome, initialArticleId = null }) {
  const { content } = useSiteData();
  const { promo, brand } = content;
  const articles = useMemo(() => promo?.articles || [], [promo]);

  const [activeArticleId, setActiveArticleId] = useState(initialArticleId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state with URL hash and initial prop
  useEffect(() => {
    const parseHashArticle = () => {
      const hash = window.location.hash.toLowerCase();
      // Supports #/edukasi/art-1 or #/edukasi?id=art-1 or #edukasi/art-1
      if (hash.includes('id=')) {
        const idMatch = hash.match(/id=([^&]+)/);
        if (idMatch && idMatch[1]) {
          setActiveArticleId(decodeURIComponent(idMatch[1]));
          return;
        }
      }
      
      const parts = hash.replace(/^#\/?/, '').split('/');
      if ((parts[0] === 'edukasi' || parts[0] === 'tips') && parts[1]) {
        setActiveArticleId(parts[1]);
        return;
      }

      if (initialArticleId) {
        setActiveArticleId(initialArticleId);
      }
    };

    parseHashArticle();
    window.addEventListener('hashchange', parseHashArticle);
    return () => window.removeEventListener('hashchange', parseHashArticle);
  }, [initialArticleId]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    articles.forEach((art) => {
      if (art.category) set.add(art.category);
    });
    return ['Semua', ...Array.from(set)];
  }, [articles]);

  // Filtered articles for catalog mode
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCat = selectedCategory === 'Semua' || art.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        art.title?.toLowerCase().includes(q) ||
        art.summary?.toLowerCase().includes(q) ||
        art.category?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Currently opened article in full view
  const currentArticle = useMemo(() => {
    if (!activeArticleId) return null;
    return articles.find((a) => a.id === activeArticleId) || null;
  }, [articles, activeArticleId]);

  // Related articles (excluding current)
  const relatedArticles = useMemo(() => {
    if (!currentArticle) return [];
    return articles
      .filter((a) => a.id !== currentArticle.id)
      .slice(0, 3);
  }, [articles, currentArticle]);

  const handleSelectArticle = (id) => {
    setActiveArticleId(id);
    if (typeof window !== 'undefined' && window.history?.pushState) {
      window.history.pushState(null, '', `#/edukasi/${id}`);
    } else if (typeof window !== 'undefined') {
      window.location.assign(`#/edukasi/${id}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setActiveArticleId(null);
    if (typeof window !== 'undefined' && window.history?.pushState) {
      window.history.pushState(null, '', `#/edukasi`);
    } else if (typeof window !== 'undefined') {
      window.location.assign(`#/edukasi`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Navigation Header */}
      <Navbar activePage="edukasi" />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-20">
        {currentArticle ? (
          /* ========================================================== */
          /* MODE 1: DETAIL HALAMAN FULL ARTIKEL EDUKASI & TIPS        */
          /* ========================================================== */
          <article className="w-full pb-20">
            {/* Top Breadcrumb & Actions Bar */}
            <section className="w-full bg-[#0B132B] text-white py-8 border-b border-slate-800">
              <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <button
                    onClick={handleBackToList}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1C2541] hover:bg-[#002884] text-slate-200 hover:text-white text-xs font-bold transition-colors border border-slate-700 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    <span>Kembali ke Semua Artikel</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
                      title="Salin tautan artikel ini"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedLink ? 'check' : 'share'}
                      </span>
                      <span>{copiedLink ? 'Tautan Tersalin!' : 'Bagikan'}</span>
                    </button>

                    <a
                      href="#/"
                      onClick={(e) => {
                        if (onBackToHome) {
                          e.preventDefault();
                          onBackToHome();
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
                    >
                      <span className="material-symbols-outlined text-[16px]">home</span>
                      <span>Beranda</span>
                    </a>
                  </div>
                </div>

                {/* Breadcrumb path */}
                <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4 overflow-x-auto whitespace-nowrap py-1">
                  <a
                    href="#/"
                    onClick={(e) => {
                      if (onBackToHome) {
                        e.preventDefault();
                        onBackToHome();
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Beranda
                  </a>
                  <span className="text-slate-600">/</span>
                  <button
                    onClick={handleBackToList}
                    className="hover:text-white transition-colors text-slate-400"
                  >
                    Edukasi &amp; Tips
                  </button>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-200 font-medium truncate max-w-xs sm:max-w-md">
                    {currentArticle.title}
                  </span>
                </nav>

                {/* Article Header Meta */}
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <span className="px-3 py-1 bg-[#E3000F] text-white text-xs font-bold uppercase tracking-wider rounded-md">
                    {currentArticle.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-300 text-xs font-medium bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                    <span className="material-symbols-outlined text-[14px] text-amber-400">schedule</span>
                    <span>{currentArticle.readTime || '5 Menit Baca'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    <span>{currentArticle.date || 'Update Berkala'}</span>
                  </div>
                </div>

                {/* Big Article Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
                  {currentArticle.title}
                </h1>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-2 text-xs text-slate-300 border-t border-slate-800/80">
                  <div className="w-8 h-8 rounded-full bg-[#002884] border border-blue-400/40 flex items-center justify-center font-bold text-white shrink-0">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <div>
                    <span className="font-bold text-white block">Tim Teknisi Shop &amp; Drive Pondok Labu</span>
                    <span className="text-slate-400 text-[11px]">Standar Servis Resmi Astra Otoparts Indonesia</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Article Main Body Container */}
            <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
              <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-xl">
                {/* Featured Photo with caption */}
                {currentArticle.image && (
                  <div className="w-full mb-8 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                    <img
                      src={currentArticle.image}
                      alt={currentArticle.title}
                      className="w-full h-64 sm:h-96 lg:h-[460px] object-cover"
                    />
                    <div className="py-2.5 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Dokumentasi Servis Shop &amp; Drive Pondok Labu, Jakarta Selatan</span>
                      <span className="font-semibold text-[#002884]">Shop &amp; Drive</span>
                    </div>
                  </div>
                )}

                {/* Key Summary Highlight Box */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 to-slate-50 border-l-4 border-[#002884] mb-8 shadow-xs">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#002884] text-2xl shrink-0 mt-0.5">
                      lightbulb
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#002884] uppercase tracking-wider mb-1.5">
                        Ringkasan Inti &amp; Cuplikan Utama
                      </h3>
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                        {currentArticle.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Full Article Content Body */}
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-sm sm:text-base">
                  {currentArticle.content ? (
                    /* If custom long-form content is provided by admin */
                    <div className="whitespace-pre-line font-normal text-slate-700 leading-relaxed">
                      {currentArticle.content}
                    </div>
                  ) : (
                    /* Default comprehensive structured content based on article topic */
                    <>
                      <section className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#0B1C30] flex items-center gap-2">
                          <span className="w-2 h-6 bg-[#E3000F] rounded-full inline-block" />
                          <span>Pentingnya Perawatan Berkala &amp; Pencegahan Kerusakan</span>
                        </h2>
                        <p>
                          Menjaga kondisi kendaraan tetap prima bukan hanya soal kenyamanan berkendara, tetapi juga faktor utama keselamatan seluruh penumpang di jalan raya. Kondisi lalu lintas Jakarta yang padat, suhu udara panas, serta kondisi stop-and-go memberikan beban kerja ekstra pada komponen vital mobil seperti sistem kelistrikan aki, pelumasan mesin, sistem suspensi, hingga pengereman.
                        </p>
                        <p>
                          Banyak pengendara baru menyadari adanya kerusakan saat mobil sudah mogok di tengah jalan atau timbul suara berisik yang mengganggu. Padahal, dengan memahami indikasi awal dan melakukan pengecekan berkala, biaya perbaikan dapat ditekan jauh lebih hemat dan terencana.
                        </p>
                      </section>

                      {/* Langkah Praktis & Tips */}
                      <section className="space-y-4 pt-2">
                        <h2 className="text-lg sm:text-xl font-bold text-[#0B1C30] flex items-center gap-2">
                          <span className="w-2 h-6 bg-[#002884] rounded-full inline-block" />
                          <span>Langkah Pengecekan Mandiri &amp; Gejala yang Wajib Diwaspadai</span>
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-2 font-bold text-[#002884] mb-2 text-sm">
                              <span className="material-symbols-outlined text-[18px]">check_circle</span>
                              <span>Pemeriksaan Fisik Visual</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              Periksa apakah terdapat retakan, rembesan cairan oli, korosi pada kutub terminal baterai, atau keausan tapak ban yang tidak merata setiap minggu sebelum berkendara jauh.
                            </p>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-2 font-bold text-[#002884] mb-2 text-sm">
                              <span className="material-symbols-outlined text-[18px]">speed</span>
                              <span>Sensasi &amp; Respon Kemudi</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              Perhatikan getaran pada setir, bunyi decitan saat pedal rem diinjak, atau mobil cenderung menarik ke satu sisi saat melaju di jalan tol yang datar.
                            </p>
                          </div>
                        </div>

                        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700">
                          <li>
                            <strong>Jangan menunda penggantian komponen aus:</strong> Komponen seperti aki yang voltasenya di bawah 12.2V atau kampas rem yang tersisa kurang dari 3mm dapat memicu kerusakan berantai pada alternator atau piringan cakram (rotor).
                          </li>
                          <li>
                            <strong>Gunakan suku cadang berspesifikasi OEM Astra:</strong> Hindari suku cadang tiruan yang tidak memiliki standar toleransi panas dan durabilitas yang teruji di iklim tropis Indonesia.
                          </li>
                          <li>
                            <strong>Catat riwayat dan tanggal servis:</strong> Mengetahui jadwal ganti oli dan tanggal instalasi aki membantu Anda mengklaim garansi resmi tepat waktu.
                          </li>
                        </ul>
                      </section>
                    </>
                  )}

                  {/* Kotak Rekomendasi Teknisi Shop & Drive Pondok Labu */}
                  <section className="p-5 sm:p-6 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 not-prose shadow-xs my-6">
                    <div className="flex items-start gap-3.5">
                      <span className="material-symbols-outlined text-amber-600 text-2xl sm:text-3xl shrink-0 mt-0.5">
                        verified_user
                      </span>
                      <div className="flex-1">
                        <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-900 mb-1.5">
                          {currentArticle.technicianRecommendationTitle || 'Rekomendasi Teknisi Shop & Drive Pondok Labu'}
                        </h4>
                        <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed whitespace-pre-line font-medium">
                          {currentArticle.technicianRecommendation ||
                            'Jika Anda merasa ada yang janggal pada tarikan mesin, kelistrikan, atau bantingan mobil, bawa mobil Anda langsung ke bengkel kami di Jl. RS Fatmawati Raya (Pondok Labu). Teknisi kami menyediakan layanan uji aki digital & cek kelayakan pelumas secara gratis dengan alat diagnostik akurat standar Astra Otoparts.'}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Consultation & Booking Action Card */}
                <div className="mt-10 pt-8 border-t border-slate-200">
                  <div className="bg-[#002884] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
                    <div className="max-w-xl">
                      <span className="inline-block px-2.5 py-1 bg-white/20 text-white rounded-md text-xs font-bold uppercase tracking-wider mb-2">
                        Konsultasi Bebas Biaya
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-snug">
                        Butuh Saran Langsung dari Teknisi Kami Mengenai Topik Ini?
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        Tanyakan gejala mobil Anda langsung ke tim mekanik Shop &amp; Drive Pondok Labu via WhatsApp. Kami siap memberikan solusi transparan dan estimasi biaya tanpa biaya tersembunyi.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                      <a
                        href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
                          currentArticle.waTopic ||
                            `Halo Shop & Drive Pondok Labu, saya membaca artikel "${currentArticle.title}" di website dan ingin konsultasi mengenai mobil saya.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E3000F] hover:bg-[#C2000D] text-white font-bold text-sm rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
                      >
                        <span className="material-symbols-outlined text-[20px]">chat</span>
                        <span>Tanya Teknisi via WA</span>
                      </a>

                      <a
                        href="#/"
                        onClick={(e) => {
                          if (onBackToHome) {
                            e.preventDefault();
                            onBackToHome();
                            setTimeout(() => {
                              const el = document.getElementById('layanan');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }, 200);
                          }
                        }}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                        <span>Booking Servis di Bengkel</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Back and Navigation Actions */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleBackToList}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">grid_view</span>
                    <span>Lihat Semua Artikel Edukasi</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {copiedLink ? 'check' : 'share'}
                    </span>
                    <span>{copiedLink ? 'Tautan Berhasil Disalin!' : 'Bagikan Artikel Ini'}</span>
                  </button>
                </div>
              </div>

              {/* Related Articles Cards */}
              {relatedArticles.length > 0 && (
                <section className="mt-14">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-xs font-bold text-[#E3000F] uppercase tracking-wider block">
                        Rekomendasi Lainnya
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#002884]">
                        Artikel Tips Otomotif Terkait
                      </h3>
                    </div>
                    <button
                      onClick={handleBackToList}
                      className="text-xs sm:text-sm font-bold text-[#002884] hover:text-[#E3000F] inline-flex items-center gap-1"
                    >
                      <span>Lihat Semua</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => handleSelectArticle(rel.id)}
                        className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between p-5 cursor-pointer"
                      >
                        <div>
                          {rel.image && (
                            <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-slate-100">
                              <img
                                src={rel.image}
                                alt={rel.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                            <span className="px-2 py-0.5 bg-blue-50 text-[#002884] font-bold text-[10px] rounded uppercase">
                              {rel.category}
                            </span>
                            <span className="text-[11px] text-slate-400">{rel.readTime}</span>
                          </div>

                          <h4 className="text-sm font-bold text-[#0B1C30] mb-2 leading-snug group-hover:text-[#002884] transition-colors line-clamp-2">
                            {rel.title}
                          </h4>

                          <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                            {rel.summary}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#002884] group-hover:text-[#E3000F]">
                          <span>Buka Artikel Lengkap</span>
                          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>
        ) : (
          /* ========================================================== */
          /* MODE 2: KATALOG LENGKAP ARTIKEL EDUKASI & TIPS            */
          /* ========================================================== */
          <div className="w-full pb-20">
            {/* Header Hero Banner Edukasi */}
            <section className="w-full bg-[#0B132B] text-white py-12 lg:py-16 relative overflow-hidden border-b border-slate-800">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: 'url("/Assets/bg1.jpeg")' }}
              />
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#002884]/60 rounded-full blur-3xl pointer-events-none" />

              <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back to Home Button */}
                <div className="mb-6 flex items-center justify-between gap-4">
                  <a
                    href="#/"
                    onClick={(e) => {
                      if (onBackToHome) {
                        e.preventDefault();
                        onBackToHome();
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1C2541] hover:bg-[#002884] text-slate-200 hover:text-white text-xs font-bold transition-colors border border-slate-700 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    <span>Kembali ke Beranda Utama</span>
                  </a>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span>Panduan Resmi Teknisi Astra</span>
                  </span>
                </div>

                <div className="max-w-3xl">
                  <span className="text-xs sm:text-sm font-bold text-[#E3000F] uppercase tracking-widest block mb-2">
                    Pusat Edukasi &amp; Panduan Perawatan Otomotif
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                    Tips &amp; Edukasi Seputar Kendaraan Anda
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                    Kumpulan artikel praktis, panduan perawatan rutin, dan tips preventif dari teknisi Shop &amp; Drive Pondok Labu untuk menjaga performa mobil Anda tetap prima, aman, dan nyaman di segala rute perjalanan.
                  </p>
                </div>
              </div>
            </section>

            {/* Catalog Filter, Search & Grid */}
            <section className="w-full py-10 lg:py-14">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search & Filter Bar */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-[#002884]">
                        Daftar Lengkap Artikel Edukasi
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Menampilkan {filteredArticles.length} artikel edukasi perawatan mobil
                      </p>
                    </div>

                    {/* Search Input Box */}
                    <div className="relative w-full md:w-80">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                        search
                      </span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari topik tips (aki, oli, rem, ban)..."
                        className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#002884] focus:bg-white transition-all font-medium"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 uppercase">
                      Kategori:
                    </span>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
                          selectedCategory === cat
                            ? 'bg-[#002884] text-white border-[#002884] shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of Articles */}
                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredArticles.map((art) => (
                      <article
                        key={art.id}
                        className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          {/* Image Thumbnail Container */}
                          <div
                            onClick={() => handleSelectArticle(art.id)}
                            className="w-full h-48 overflow-hidden bg-slate-100 relative cursor-pointer"
                          >
                            {art.image ? (
                              <img
                                src={art.image}
                                alt={art.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                <span className="material-symbols-outlined text-4xl">menu_book</span>
                              </div>
                            )}
                            <div className="absolute top-3 left-3">
                              <span className="px-2.5 py-1 bg-white/95 backdrop-blur-xs font-bold text-[#002884] text-[10px] rounded-md shadow-xs uppercase tracking-wider border border-slate-200/60">
                                {art.category}
                              </span>
                            </div>
                            <div className="absolute bottom-3 right-3">
                              <span className="px-2 py-0.5 bg-[#0B132B]/80 text-white font-medium text-[10px] rounded-md backdrop-blur-xs flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">schedule</span>
                                <span>{art.readTime || '5 Menit'}</span>
                              </span>
                            </div>
                          </div>

                          {/* Content Snippet */}
                          <div className="p-5 sm:p-6">
                            <h3
                              onClick={() => handleSelectArticle(art.id)}
                              className="text-base sm:text-lg font-bold text-[#0B1C30] mb-2 leading-snug group-hover:text-[#002884] transition-colors cursor-pointer line-clamp-2"
                            >
                              {art.title}
                            </h3>

                            {/* Snippet / Cuplikan Saja */}
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                              {art.summary}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="p-5 sm:p-6 pt-0 border-t border-slate-100/80 mt-auto flex flex-col sm:flex-row items-center gap-2.5">
                          {/* Button Baca Selengkapnya - Membuka Full Halaman Artikel */}
                          <button
                            onClick={() => handleSelectArticle(art.id)}
                            className="w-full py-2.5 px-4 bg-[#002884] hover:bg-[#001551] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <span>Lihat Selengkapnya</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </button>

                          {/* Secondary WA Quick Question */}
                          <a
                            href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
                              art.waTopic || art.title
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-600 hover:text-[#25D366] text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 shrink-0"
                            title="Tanya ke WhatsApp"
                          >
                            <span className="material-symbols-outlined text-[16px] text-[#25D366]">chat</span>
                            <span className="sm:hidden">Tanya WA</span>
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  /* Empty Search State */
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">
                      search_off
                    </span>
                    <h3 className="text-lg font-bold text-slate-700 mb-1">
                      Tidak Ada Artikel Edukasi yang Cocok
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">
                      Coba ganti kata kunci pencarian atau pilih kategori tips perawatan mobil yang lain.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('Semua');
                      }}
                      className="px-5 py-2.5 bg-[#002884] text-white text-xs font-bold rounded-xl shadow-sm"
                    >
                      Reset Filter Pencarian
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Bottom Support Banner */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
              <div className="bg-gradient-to-r from-[#001551] to-[#002884] rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase rounded-md mb-2 inline-block">
                    Mekanik Siap Melayani
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                    Punya Keluhan atau Gejala Kerusakan pada Mobil Anda?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
                    Kunjungi Shop &amp; Drive Pondok Labu di Jalan Pondok Labu Raya No. 7, Jakarta Selatan. Nikmati pemeriksaan aki, ban, oli, dan kaki-kaki gratis oleh mekanik profesional kami.
                  </p>
                </div>

                <a
                  href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
                    'Halo Shop & Drive Pondok Labu, saya ingin konsultasi servis mobil saya'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#E3000F] hover:bg-[#C2000D] text-white font-bold text-sm rounded-xl shrink-0 shadow-lg transition-transform transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Hubungi Teknisi via WA</span>
                </a>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Cluster */}
      <FloatingAction />
    </div>
  );
}
