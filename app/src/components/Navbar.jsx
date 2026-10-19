import React, { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function Navbar({ activePage = 'home' }) {
  const { content, isStoreOpen } = useSiteData();
  const { brand, storeStatus } = content;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.toLowerCase();
    }
    return '';
  });

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.toLowerCase());
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const openNow = isStoreOpen();
  const isProduk = activePage === 'produk';
  const isEdu = activePage === 'edukasi';
  const isSubPage = isProduk || isEdu;

  // Active state detection
  const isHomeActive = activePage === 'home' && (!currentHash || currentHash === '#' || currentHash === '#/' || currentHash === '#beranda');
  const isLayananActive = activePage === 'home' && (currentHash === '#layanan' || currentHash === '#/layanan');
  const isPromoActive = activePage === 'home' && (currentHash === '#promo' || currentHash === '#/promo');
  const isTestiActive = activePage === 'home' && (currentHash === '#testimoni' || currentHash === '#/testimoni');
  const isLokasiActive = activePage === 'home' && (currentHash === '#lokasi' || currentHash === '#/lokasi');

  // Primary Pillar Menu (Beranda, Layanan Bengkel, Produk)
  const coreLinks = [
    {
      label: 'Beranda',
      icon: 'home',
      href: isSubPage ? '#/' : '#',
      active: isHomeActive,
    },
    {
      label: 'Layanan Bengkel',
      icon: 'home_repair_service',
      href: isSubPage ? '#/layanan' : '#layanan',
      active: isLayananActive,
    },
    {
      label: 'Katalog Produk',
      icon: 'shopping_bag',
      href: '#/produk',
      active: isProduk,
    },
  ];

  // Secondary Informative Links
  const secondaryLinks = [
    {
      label: 'Edukasi & Tips',
      href: '#/edukasi',
      active: isEdu,
    },
    {
      label: 'Promo',
      href: isSubPage ? '#/promo' : '#promo',
      active: isPromoActive,
    },
    {
      label: 'Testimoni',
      href: isSubPage ? '#/testimoni' : '#testimoni',
      active: isTestiActive,
    },
    {
      label: 'Lokasi & Peta',
      href: isSubPage ? '#/lokasi' : '#lokasi',
      active: isLokasiActive,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B132B]/95 backdrop-blur-md border-b border-[#E2E8F0]/15 shadow-xl">
      <div className="h-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 xl:gap-6">
        
        {/* Brand Logo & Title */}
        <a href={isSubPage ? '#/' : '#'} className="flex items-center gap-3 group focus:outline-none rounded-lg p-1 shrink-0">
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
              {(brand?.subName && brand.subName.toUpperCase().includes('WORKSHOP')) ? 'AMPERA' : (brand?.subName || 'AMPERA')}
            </span>
          </div>
        </a>

        {/* Desktop Navigation: Proportional & Segmented Layout */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
          
          {/* Segment 1: Core Navigation Trio (Beranda, Layanan Bengkel, Katalog Produk) */}
          <div className="flex items-center bg-[#16213E]/90 p-1 rounded-2xl border border-white/10 shadow-inner">
            {coreLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all ${
                  item.active
                    ? 'bg-[#E3000F] text-white shadow-md shadow-red-900/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          {/* Elegant Divider between Core & Info Links */}
          <span className="h-6 w-px bg-white/15 mx-0.5" />

          {/* Segment 2: Secondary Content & Info Links */}
          <div className="flex items-center gap-1">
            {secondaryLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                  item.active
                    ? 'bg-blue-600/30 text-white font-bold border border-blue-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Status Jam Buka Bengkel (Right Section) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(brand.whatsappDefaultMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all shadow-sm ${
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
            className="lg:hidden p-2 text-slate-200 hover:text-white hover:bg-[#1C2541] rounded-xl focus:outline-none border border-slate-700/60"
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
        <div className="lg:hidden bg-[#0B132B] border-b border-[#E2E8F0]/20 px-4 pt-3 pb-5 space-y-3 shadow-2xl">
          {/* Core Menu Group Mobile */}
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-2 block mb-1.5">
              Menu Utama Bengkel
            </span>
            <div className="space-y-1 bg-[#16213E]/60 p-1.5 rounded-2xl border border-white/10">
              {coreLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-xl font-bold transition-colors ${
                    link.active
                      ? 'bg-[#E3000F] text-white shadow-md'
                      : 'text-slate-200 hover:text-white hover:bg-[#1C2541]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Secondary Links Group Mobile */}
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-2 block mb-1.5">
              Informasi &amp; Panduan
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {secondaryLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors border ${
                    link.active
                      ? 'bg-blue-600/30 text-white font-bold border-blue-400/40'
                      : 'bg-[#16213E]/40 text-slate-300 hover:text-white border-white/5'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* WhatsApp Direct Action Mobile */}
          <div className="pt-2 border-t border-slate-700/60 flex flex-col gap-2">
            <a
              href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(brand.whatsappDefaultMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              <span>Hubungi WhatsApp Bengkel</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
