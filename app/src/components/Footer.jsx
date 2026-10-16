import React from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function Footer() {
  const { content } = useSiteData();
  const { brand, services } = content;

  return (
    <footer className="w-full bg-[#0B132B] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand Info & Address */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-md">
                <img
                  src={brand.logoUrl || '/Assets/logo.png'}
                  alt={brand.name}
                  className="h-9 w-auto object-contain rounded"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white leading-tight">
                  {brand.name}
                </span>
                <span className="text-[11px] font-bold tracking-widest text-red-400 uppercase">
                  {brand.subName}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Pusat servis berkala, ganti aki, oli, ban, suspensi, dan uji diagnostik kendaraan berstandar resmi Astra Otoparts terpercaya di kawasan Ampera, Jakarta Selatan.
            </p>

            <div className="pt-2">
              <span className="text-xs text-slate-400 block mb-1">
                Layanan Pelanggan WhatsApp:
              </span>
              <a
                href={`https://wa.me/${brand.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-extrabold text-[#25D366] hover:underline flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>+{brand.whatsappNumber}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Services & Products Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-1">
              Layanan &amp; Suku Cadang
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-slate-400">
              {services && services.slice(0, 5).map((srv) => (
                <li key={srv.id}>
                  <a href="#/layanan" className="hover:text-white transition-colors">
                    {srv.title}
                  </a>
                </li>
              ))}
              <li className="pt-1.5 border-t border-slate-800">
                <a
                  href="#/produk"
                  className="text-amber-300 font-bold hover:text-white hover:underline transition-colors flex items-center gap-1"
                >
                  <span>Katalog Suku Cadang &amp; Produk</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Workshop Information */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-1">
              Informasi Cabang
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-red-400 text-[18px] shrink-0 mt-0.5">location_on</span>
                <span>{brand.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-blue-400 text-[18px] shrink-0 mt-0.5">schedule</span>
                <span>{brand.operationalHours}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[18px] shrink-0 mt-0.5">verified</span>
                <span>Garansi Resmi Astra Otoparts</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Social Media & Official Channels */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-1">
              Media Sosial Resmi
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Ikuti kabar promo, tips berkendara aman, dan dokumentasi layanan resmi Shop&amp;Drive.
            </p>

            <div className="flex items-center gap-3 mt-2">
              <a
                href={brand.instagramUrl || 'https://instagram.com/shopanddrive'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1C2541] hover:bg-[#E3000F] text-white text-xs font-bold rounded-xl transition-colors border border-slate-700"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <span>{brand.instagram || '@shopanddrive'}</span>
              </a>

              <a
                href={brand.mapsGoogleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#1C2541] hover:bg-[#002884] text-white flex items-center justify-center transition-colors border border-slate-700"
                title="Buka Google Maps"
              >
                <span className="material-symbols-outlined text-[20px]">near_me</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>
            &copy; 2026 Super Shop &amp; Drive Cabang Ampera. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="mt-1 text-slate-600">
            Astra Otoparts Network • Garansi Resmi Suku Cadang Asli Indonesia
          </p>
        </div>

      </div>
    </footer>
  );
}
