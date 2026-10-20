import React from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function LayananGrid() {
  const { content } = useSiteData();
  const { services, brand } = content;

  return (
    <section className="w-full py-16 lg:py-24 bg-[#F8FAFC]" id="layanan">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs sm:text-sm font-bold text-[#E3000F] uppercase tracking-widest block mb-1">
              Katalog Layanan Shop&amp;Drive Pondok Labu
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002884] tracking-tight">
              7 Layanan Andalan Shop &amp; Drive Pondok Labu
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Dikerjakan oleh teknisi bersertifikasi dengan alat modern berstandar pabrikan dan suku cadang asli Astra Otoparts bergaransi resmi.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 text-[#002884] border border-blue-200/60 rounded-xl shadow-xs self-start md:self-end">
            <span className="material-symbols-outlined text-[20px] text-[#002884]">
              verified_user
            </span>
            <span className="text-xs font-bold tracking-wide">
              100% Suku Cadang Asli &amp; Garansi Kerja
            </span>
          </div>
        </div>

        {/* 7 Services Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item) => (
            <div
              key={item.id}
              className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 border border-slate-200/80 group"
            >
              {/* Service Thumbnail & Badge */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={item.image || '/Assets/bg1.jpeg'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {item.badge && (
                  <span
                    className={`absolute top-3 left-3 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${
                      item.badgeColor || 'bg-[#E3000F] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Service Info */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#002884] mb-2 leading-snug group-hover:text-[#E3000F] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-auto">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Estimasi Biaya
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">
                      {item.priceEstimate}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
                      item.waMessage || `Halo Shop & Drive Pondok Labu, saya ingin tanya harga untuk ${item.title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-[#002884] hover:text-white text-[#002884] font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Tanya Harga via WA</span>
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Home Service / Delivery Callout */}
        <div className="mt-12 bg-gradient-to-r from-[#002884] to-[#1C2541] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <span className="material-symbols-outlined text-3xl text-red-400">
                two_wheeler
              </span>
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold">
                Mogok di Jalan atau Sibuk di Rumah? Gunakan Delivery Service!
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Armada motor mekanik Shop &amp; Drive Pondok Labu siap datang langsung ke lokasi Anda untuk penggantian aki dan pengecekan darurat.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
              'Halo Shop & Drive Pondok Labu, saya butuh layanan darurat / aki delivery ke lokasi saya.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3.5 bg-[#E3000F] hover:bg-[#C2000D] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
            <span>Panggil Delivery Service</span>
          </a>
        </div>

      </div>
    </section>
  );
}
