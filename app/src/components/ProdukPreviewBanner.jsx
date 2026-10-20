import React from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { formatRupiah } from '../lib/supabaseClient';

export function ProdukPreviewBanner() {
  const { content } = useSiteData();
  const { products, brand } = content;

  if (!products || products.length === 0) return null;

  // Filter products chosen by admin (up to 5), fallback to first 5
  const featured = products.filter((p) => p.showInBanner).slice(0, 5);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 5);

  return (
    <section className="w-full py-14 lg:py-20 bg-gradient-to-b from-[#F8FAFC] to-white border-b border-slate-200/80" id="preview-produk">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-full mb-3 shadow-xs">
              <span className="material-symbols-outlined text-[16px] text-amber-600">star</span>
              <span>Preview Suku Cadang Resmi Terpilih</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002884] tracking-tight">
              5 Produk Pilihan Shop &amp; Drive Pondok Labu
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Suku cadang asli dan pelumas bergaransi resmi Astra Otoparts terpopuler yang siap dipasang langsung di bengkel atau diantar via Home Delivery.
            </p>
          </div>

          <a
            href="#/produk"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#E3000F] hover:bg-[#C2000D] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-red-950/20 hover:shadow-red-950/30 transition-all transform hover:-translate-y-0.5 self-start md:self-end"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span>Buka Katalog Lengkap</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>

        {/* 5 Featured Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5 mb-10">
          {displayProducts.map((prod) => (
            <div
              key={prod.id}
              className="flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#002884] shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 group"
            >
              {/* Image & Badges */}
              <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                <img
                  src={prod.image || '/Assets/bg1.jpeg'}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />

                {prod.brandBadge && (
                  <span className="absolute top-2.5 left-2.5 bg-[#0B132B]/90 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                    {prod.brandBadge}
                  </span>
                )}

                {prod.badge && (
                  <span className="absolute bottom-2.5 left-2.5 bg-[#E3000F] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                    {prod.badge}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {prod.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#0B1C30] mb-2 leading-snug line-clamp-2 group-hover:text-[#002884] transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 mt-auto">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Harga
                    </span>
                    <span className="text-xs sm:text-sm font-black text-[#002884]">
                      {formatRupiah(prod.price || prod.priceEstimate)}
                    </span>
                    {prod.discountTradeIn && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shadow-2xs">
                        <span className="material-symbols-outlined text-[13px] text-emerald-600 shrink-0">
                          swap_horizontal_circle
                        </span>
                        <span className="truncate">{prod.discountTradeIn}</span>
                      </div>
                    )}
                  </div>

                  <a
                    href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
                      prod.waMessage || `Halo Shop & Drive Pondok Labu, saya ingin pesan ${prod.name} (Harga: ${formatRupiah(prod.price || prod.priceEstimate)}${prod.discountTradeIn ? ` | Promo: ${prod.discountTradeIn}` : ''})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[15px]">chat</span>
                    <span>Pesan via WA</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Connecting Strip */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#002884] to-[#0B132B] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-slate-700/60">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <span className="material-symbols-outlined text-amber-300 text-2xl">verified</span>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold">
                Mencari Tipe Aki, Ukuran Ban, atau Oli Tertentu?
              </h4>
              <p className="text-xs text-slate-300">
                Tempat khusus katalog produk kami menyediakan filter pencarian lengkap untuk seluruh tipe kendaraan Anda.
              </p>
            </div>
          </div>

          <a
            href="#/produk"
            className="shrink-0 px-5 py-2.5 bg-white hover:bg-slate-100 text-[#002884] font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Kunjungi Katalog Produk</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>

      </div>
    </section>
  );
}
