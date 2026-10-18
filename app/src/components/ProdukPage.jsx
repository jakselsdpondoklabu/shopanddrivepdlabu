import React, { useState, useMemo } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingAction } from './FloatingAction';
import { formatRupiah } from '../lib/supabaseClient';

export function ProdukPage({ onBackToHome }) {
  const { content } = useSiteData();
  const { products, brand } = content;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Extract unique categories from products
  const categories = useMemo(() => {
    if (!products) return ['Semua'];
    const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ['Semua', ...unique];
  }, [products]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((prod) => {
      const matchCategory = selectedCategory === 'Semua' || prod.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        (prod.name && prod.name.toLowerCase().includes(q)) ||
        (prod.description && prod.description.toLowerCase().includes(q)) ||
        (prod.brandBadge && prod.brandBadge.toLowerCase().includes(q)) ||
        (prod.category && prod.category.toLowerCase().includes(q))
      );
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Navigation Header */}
      <Navbar activePage="produk" />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-20">
        
        {/* Dedicated Product Page Hero & Header */}
        <section className="w-full bg-[#0B132B] text-white py-12 lg:py-16 relative overflow-hidden border-b border-slate-800">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{
              backgroundImage: 'url("/Assets/bg1.jpeg")',
            }}
          />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#002884]/60 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb / Back Navigation */}
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
                <span>Kembali ke Beranda (Layanan Bengkel)</span>
              </a>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>100% Suku Cadang Original Astra</span>
              </span>
            </div>

            <div className="max-w-3xl">
              <span className="text-xs sm:text-sm font-bold text-[#E3000F] uppercase tracking-widest block mb-2">
                Tempat Khusus Suku Cadang &amp; Komponen Resmi
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Katalog Produk Resmi Astra Otoparts
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Temukan aki mobil bergaransi resmi hingga 24 bulan, oli mesin original pabrikan, shock absorber Kayaba, dan ban berstandar internasional untuk performa terbaik kendaraan Anda di Cabang Ampera.
              </p>
            </div>
          </div>
        </section>

        {/* Filter, Search & Catalog Grid Container */}
        <section className="w-full py-10 lg:py-16">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Control Bar: Search & Category Filter Pills */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                
                {/* Search Bar Input */}
                <div className="relative flex-1 max-w-md">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari aki, merk oli, shock absorber, atau ban..."
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#002884] focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                </div>

                {/* Results Count & Quick Help */}
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500">
                  <span>
                    Menampilkan <strong className="text-slate-900">{filteredProducts.length}</strong> produk
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 hidden sm:inline">
                    Garansi Resmi Terdaftar
                  </span>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-slate-100 pt-4">
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
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">
                  inventory_2
                </span>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Produk Tidak Ditemukan
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Tidak ada produk yang cocok dengan pencarian "{searchQuery}". Silakan coba kata kunci lain atau hubungi admin WhatsApp untuk tipe khusus.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Reset Filter
                  </button>
                  <a
                    href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(`Halo Super Shop & Drive Ampera, saya mencari suku cadang: ${searchQuery}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>Tanya Stok ke Admin</span>
                  </a>
                </div>
              </div>
            )}

            {/* Product Cards Grid */}
            {filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 group"
                  >
                    {/* Thumbnail & Badges */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={prod.image || '/Assets/bg1.jpeg'}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Brand Badge */}
                      {prod.brandBadge && (
                        <span className="absolute top-3 left-3 bg-[#0B132B]/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                          {prod.brandBadge}
                        </span>
                      )}

                      {/* Guarantee / Advantage Badge */}
                      {prod.badge && (
                        <span className="absolute bottom-3 left-3 bg-[#E3000F] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                          {prod.badge}
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          {prod.category}
                        </span>
                        <h3 className="text-base font-bold text-[#0B1C30] mb-2 leading-snug group-hover:text-[#002884] transition-colors">
                          {prod.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                          {prod.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-auto">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Harga
                          </span>
                          <span className="text-base sm:text-lg font-black text-[#002884]">
                            {formatRupiah(prod.price || prod.priceEstimate)}
                          </span>
                        </div>

                        {/* Slot Diskon / Trade-In */}
                        {prod.discountTradeIn && (
                          <div className="mb-3 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-800 text-xs font-bold shadow-xs">
                            <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">
                              swap_horizontal_circle
                            </span>
                            <span className="truncate">
                              {prod.discountTradeIn}
                            </span>
                          </div>
                        )}

                        <a
                          href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
                            prod.waMessage || `Halo Super Shop & Drive Ampera, saya ingin memesan/tanya ketersediaan produk ${prod.name} (Harga: ${formatRupiah(prod.price || prod.priceEstimate)}${prod.discountTradeIn ? ` | Promo: ${prod.discountTradeIn}` : ''})`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/10 active:scale-[0.98]"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            shopping_cart
                          </span>
                          <span>Pesan via WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Home Delivery Service Callout Box */}
            <div className="mt-16 bg-gradient-to-r from-[#002884] to-[#0B132B] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#E3000F] text-white flex items-center justify-center shrink-0 shadow-lg">
                  <span className="material-symbols-outlined text-3xl">two_wheeler</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-red-300 uppercase tracking-widest block mb-1">
                    Home Delivery Service Ampera
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Mogok di Rumah atau Kantor? Kami Antar &amp; Pasang ke Lokasi Anda
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                    Layanan pengantaran dan pemasangan aki serta penggantian oli ke rumah atau kantor untuk wilayah Ampera, Kemang, Cilandak, Pasar Minggu, dan sekitarnya. Teknisi kami datang langsung dengan perlengkapan lengkap.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a
                  href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent('Halo Super Shop & Drive Ampera, saya butuh Home Delivery Service untuk ganti aki di lokasi saya')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Order Delivery via WA</span>
                </a>

                <a
                  href={`tel:${brand.phone || '0217800285'}`}
                  className="px-5 py-3.5 bg-[#1C2541] hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-600 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>Hotline Cabang</span>
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <FloatingAction />
    </div>
  );
}
