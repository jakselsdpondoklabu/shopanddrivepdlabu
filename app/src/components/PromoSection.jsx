import React from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function PromoSection() {
  const { content } = useSiteData();
  const { promo, brand } = content;

  if (!promo || !promo.isActive) {
    return null;
  }

  return (
    <section className="w-full pt-10 pb-16 lg:pt-12 lg:pb-20 bg-white border-b border-slate-200/80 shadow-xs" id="promo">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Highlighted Promo Banner */}
        <div
          className="w-full bg-[#001551] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl mb-16 relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0, 21, 81, 0.96) 0%, rgba(62, 88, 178, 0.88) 55%, rgba(227, 0, 15, 0.85) 100%), url("/Assets/bg1.jpeg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Ambient blur ornament */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E3000F] text-white text-xs font-black uppercase tracking-wider rounded-full mb-4 shadow">
                <span className="material-symbols-outlined text-[16px]">timer</span>
                <span>{promo.badgeText || 'Penawaran Spesial'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 leading-tight">
                {promo.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
                {promo.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-4 shrink-0">
              {promo.promoCode && (
                <div className="px-4 py-2.5 bg-[#0B132B]/80 backdrop-blur-md rounded-xl border border-white/20 flex items-center gap-3 shadow-inner">
                  <span className="text-xs font-bold text-slate-300">KODE PROMO:</span>
                  <span className="text-sm sm:text-base font-mono font-black text-emerald-400 tracking-wider">
                    {promo.promoCode}
                  </span>
                </div>
              )}

              <a
                href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
                  promo.waMessage || `Halo Shop & Drive Pondok Labu, saya ingin klaim ${promo.title}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E3000F] hover:bg-[#C2000D] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-red-900/40 transition-all transform hover:-translate-y-0.5"
              >
                <span>{promo.ctaText || 'Klaim Promo via WhatsApp'}</span>
                <span className="material-symbols-outlined text-[18px]">local_activity</span>
              </a>
            </div>
          </div>
        </div>

        {/* Informative Tips Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#E3000F] uppercase tracking-widest block mb-1">
              Edukasi &amp; Tips Otomotif
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#002884] tracking-tight">
              Tips &amp; Artikel Perawatan Otomotif
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Panduan praktis teknisi Shop &amp; Drive agar mobil Anda selalu prima dan terhindar dari mogok.
            </p>
          </div>

          <a
            href="#/edukasi"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-[#002884] text-[#002884] hover:text-white text-xs sm:text-sm font-bold rounded-xl transition-all border border-blue-200/80 shadow-xs group"
          >
            <span>Buka Semua Tips &amp; Edukasi</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </a>
        </div>

        {/* 3 Articles Grid (Cuplikan Saja) */}
        {promo.articles && promo.articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promo.articles.map((art) => (
              <article
                key={art.id}
                className="group bg-[#F8FAFC] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6"
              >
                <div>
                  {art.image && (
                    <a
                      href={`#/edukasi/${art.id}`}
                      className="block w-full h-44 rounded-xl overflow-hidden mb-4 bg-slate-200 border border-slate-200/60 relative cursor-pointer"
                    >
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-[#0B132B]/85 text-white text-[10px] font-semibold rounded backdrop-blur-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">visibility</span>
                        <span>Baca Full</span>
                      </span>
                    </a>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="px-2.5 py-1 bg-white border border-slate-200 font-bold text-[#002884] rounded-md uppercase tracking-wider text-[10px]">
                      {art.category}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>{art.readTime}</span>
                    </div>
                  </div>

                  <a href={`#/edukasi/${art.id}`} className="block">
                    <h4 className="text-base font-bold text-[#0B1C30] mb-2 leading-snug group-hover:text-[#002884] transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                  </a>

                  {/* Cuplikan / Excerpt Saja */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  {/* Button Buka Halaman Full Artikel */}
                  <a
                    href={`#/edukasi/${art.id}`}
                    className="w-full py-2.5 px-4 bg-[#002884] hover:bg-[#001551] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Lihat Selengkapnya</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </a>

                  {/* WhatsApp Consultation */}
                  <a
                    href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(art.waTopic || art.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-600 hover:text-[#25D366] font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 shrink-0"
                    title="Konsultasi ke Teknisi via WhatsApp"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#25D366]">chat</span>
                    <span className="sm:hidden">Tanya WA</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
