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
                  promo.waMessage || `Halo Super Shop & Drive Ampera, saya ingin klaim ${promo.title}`
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
              Edukasi &amp; Tips Montir
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#002884] tracking-tight">
              Tips &amp; Artikel Perawatan Otomotif
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Panduan praktis teknisi Super Shop &amp; Drive agar mobil Anda selalu prima dan terhindar dari mogok.
            </p>
          </div>

          <a
            href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent('Halo, saya ingin konsultasi tips perawatan mobil dengan teknisi Ampera')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#002884] hover:text-[#E3000F] transition-colors"
          >
            <span>Konsultasi Bebas Masalah</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>
        </div>

        {/* 3 Articles Grid */}
        {promo.articles && promo.articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promo.articles.map((art) => (
              <article
                key={art.id}
                className="bg-[#F8FAFC] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between p-6"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="px-2.5 py-1 bg-white border border-slate-200 font-bold text-[#002884] rounded-md uppercase tracking-wider text-[10px]">
                      {art.category}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>{art.readTime}</span>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-[#0B1C30] mb-2 leading-snug">
                    {art.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {art.summary}
                  </p>
                </div>

                <a
                  href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(art.waTopic || art.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-white hover:bg-[#002884] hover:text-white text-[#002884] font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Tanya Solusi ke Teknisi</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </a>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
