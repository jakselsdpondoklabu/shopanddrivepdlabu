import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function ProdukGrid() {
  const { content } = useSiteData();
  const { products, brand } = content;
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  if (!products || products.length === 0) return null;

  // Extract unique categories
  const categories = ['Semua', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filteredProducts = selectedCategory === 'Semua'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <section className="w-full py-16 lg:py-24 bg-white border-t border-slate-200/80" id="produk">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs sm:text-sm font-bold text-[#002884] uppercase tracking-widest block mb-1">
              Katalog Suku Cadang &amp; Komponen
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1C30] tracking-tight">
              Produk Resmi Super Shop &amp; Drive Ampera
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Jaminan 100% suku cadang original Astra Otoparts dan merek global ternama dengan jaminan garansi resmi serta harga transparan.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-[#008239] border border-emerald-200/70 rounded-xl shadow-xs self-start md:self-end">
            <span className="material-symbols-outlined text-[20px]">
              verified
            </span>
            <span className="text-xs font-bold tracking-wide">
              Barang Resmi • Anti Palsu
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#002884] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="flex flex-col bg-[#F8FAFC] rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              {/* Product Image & Badges */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={prod.image || '/Assets/bg1.jpeg'}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {prod.brandBadge && (
                  <span className="absolute top-3 left-3 bg-[#0B132B]/85 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                    {prod.brandBadge}
                  </span>
                )}

                {prod.badge && (
                  <span className="absolute bottom-3 left-3 bg-[#E3000F] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                    {prod.badge}
                  </span>
                )}
              </div>

              {/* Product Content */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {prod.category}
                  </span>
                  <h3 className="text-base font-bold text-[#0B1C30] mb-2 leading-snug group-hover:text-[#002884] transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 mt-auto">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">
                      Estimasi Harga
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-[#002884]">
                      {prod.priceEstimate}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
                      prod.waMessage || `Halo Super Shop & Drive Ampera, saya ingin pesan produk: ${prod.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-[#E3000F] hover:bg-[#C2000D] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                    <span>Pesan via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
