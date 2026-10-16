import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function Navbar({ activePage = 'home' }) {
  const { content, isStoreOpen } = useSiteData();
  const { brand, storeStatus } = content;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openNow = isStoreOpen();
  const isProduk = activePage === 'produk';

  const navLinks = [
    { label: 'Beranda', href: isProduk ? '#/' : '#' },
    { label: 'Layanan Bengkel', href: isProduk ? '#/layanan' : '#layanan' },
    { label: 'Produk', href: '#/produk', active: isProduk },
    { label: 'Promo & Diskon', href: isProduk ? '#/promo' : '#promo' },
    { label: 'Testimoni', href: isProduk ? '#/testimoni' : '#testimoni' },
    { label: 'Lokasi & Peta', href: isProduk ? '#/lokasi' : '#lokasi' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B132B]/90 backdrop-blur-md border-b border-[#E2E8F0]/15 shadow-lg">
      <div className="h-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <a href={isProduk ? '#/' : '#'} className="flex items-center gap-3 group focus:outline-none rounded-lg p-1">
          <div className="bg-white p-1 rounded-md shadow-sm">
            <img
              src={brand.logoUrl || '/Assets/logo.png'}
              alt={brand.name}
              className="h-9 w-auto object-contain rounded"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-tight">
              {brand.name}
            </span>
            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-red-300 uppercase">
              {brand.subName}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`px-3 py-2 text-sm rounded-lg transition-all ${
                link.active
                  ? 'bg-[#E3000F] text-white font-bold shadow-md'
                  : 'text-slate-200 hover:text-white hover:bg-[#1C2541]/70 font-semibold'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Status Jam Buka Bengkel (Hijau jika Buka, Merah jika Tutup) */}
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(brand.whatsappDefaultMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all shadow-sm ${
              openNow
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25 shadow-emerald-950/20'
                : 'bg-red-500/15 text-red-400 border-red-500/40 hover:bg-red-500/25 shadow-red-950/20'
            }`}
            title={openNow ? 'Bengkel Sedang Beroperasi' : 'Bengkel Sedang Tutup'}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  openNow ? 'bg-emerald-400' : 'bg-red-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  openNow ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
            </span>
            <span className="tracking-wide">
              {openNow ? (
                <>
                  <span className="font-extrabold">Buka</span>{' '}
                  <span className="font-normal opacity-90 hidden sm:inline">
                    • ({storeStatus?.openTime || '08:00'} - {storeStatus?.closeTime || '20:00'})
                  </span>
                </>
              ) : (
                <>
                  <span className="font-extrabold">Tutup</span>{' '}
                  <span className="font-normal opacity-90 hidden sm:inline">
                    • (Buka Jam {storeStatus?.openTime || '08:00'})
                  </span>
                </>
              )}
            </span>
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-200 hover:text-white hover:bg-[#1C2541] rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B132B] border-b border-[#E2E8F0]/20 px-4 pt-3 pb-4 space-y-1.5 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 text-sm rounded-lg transition-colors ${
                link.active
                  ? 'bg-[#E3000F] text-white font-bold'
                  : 'text-slate-200 hover:text-white hover:bg-[#1C2541] font-semibold'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-700/60 mt-2 flex flex-col gap-2">
            <a
              href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(brand.whatsappDefaultMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              Chat WhatsApp ({brand.whatsappNumber})
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
