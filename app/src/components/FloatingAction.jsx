import React from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function FloatingAction() {
  const { content } = useSiteData();
  const { brand } = content;

  // Format target telpon untuk protokol tel: (contoh: 0217823844)
  const phoneDigits = (brand.phone || '(021) 782-3844').replace(/[^0-9]/g, '');

  return (
    <aside className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* Hotline / Telepon Trigger */}
      <a
        href={`tel:${phoneDigits}`}
        className="group flex items-center gap-2 transition-all transform hover:-translate-y-1"
        aria-label={`Hubungi Telepon Hotline Bengkel ${brand.phone || '(021) 782-3844'}`}
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1.5 rounded-lg bg-[#0B132B]/90 text-white text-xs font-bold shadow-lg backdrop-blur-md pointer-events-none whitespace-nowrap hidden sm:inline-block">
          Hotline: {brand.phone || '(021) 782-3844'}
        </span>
        <div className="w-12 h-12 rounded-full bg-white p-1.5 shadow-xl border-2 border-[#002884]/30 flex items-center justify-center transition-transform group-hover:scale-105">
          <img
            src="/Assets/telepon.png"
            alt="Hotline"
            className="w-full h-full object-contain rounded-full"
            onError={(e) => {
              // fallback if image fails
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement.innerHTML = '<span class="material-symbols-outlined text-[#002884] text-2xl">call</span>';
            }}
          />
        </div>
      </a>

      {/* WhatsApp Support Trigger */}
      <a
        href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(brand.whatsappDefaultMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 transition-all transform hover:-translate-y-1"
        aria-label="Chat WhatsApp Admin Pondok Labu"
      >
        <span className="px-3.5 py-1.5 rounded-xl bg-[#0B132B]/90 text-white text-xs font-bold shadow-xl backdrop-blur-md whitespace-nowrap hidden sm:inline-flex items-center gap-2 border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
          <span>Chat WhatsApp Admin</span>
        </span>

        <div className="relative w-14 h-14 rounded-full bg-[#25D366] p-1.5 shadow-2xl flex items-center justify-center transition-transform group-hover:scale-105 animate-pulse-subtle">
          <img
            src="/Assets/whatsapp.png"
            alt="WhatsApp Support"
            className="w-full h-full object-contain rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement.innerHTML = '<span class="material-symbols-outlined text-white text-3xl">chat</span>';
            }}
          />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
          </span>
        </div>
      </a>

    </aside>
  );
}
