import React from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function LokasiMaps() {
  const { content } = useSiteData();
  const { brand } = content;

  return (
    <section className="w-full py-16 bg-[#F8FAFC]" id="lokasi">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <span className="text-xs sm:text-sm font-bold text-[#E3000F] uppercase tracking-widest block mb-1">
            Kunjungi Cabang Resmi
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002884] tracking-tight">
            Lokasi Workshop &amp; Jam Operasional
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Mudah diakses dari Ragunan, Cilandak Timur, Kemang, dan kawasan TB Simatupang Jakarta Selatan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Workshop Information Details */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md">
            <div className="space-y-6">
              
              {/* Address Box */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E3000F] flex items-center justify-center shrink-0 border border-red-100">
                  <span className="material-symbols-outlined text-2xl">location_on</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#002884] uppercase tracking-wider mb-1">
                    Alamat Lengkap
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                    {brand.address}
                  </p>
                  <span className="text-xs text-slate-400 mt-1 block">
                    Koordinat: {brand.coordinates}
                  </span>
                </div>
              </div>

              {/* Hours Box */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#002884] flex items-center justify-center shrink-0 border border-blue-100">
                  <span className="material-symbols-outlined text-2xl">schedule</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#002884] uppercase tracking-wider mb-1">
                    Jam Operasional
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                    {brand.operationalHours}
                  </p>
                  <span className="text-xs text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Melayani setiap hari tanpa libur
                  </span>
                </div>
              </div>

              {/* Contact Box */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <span className="material-symbols-outlined text-2xl">chat</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#002884] uppercase tracking-wider mb-1">
                    WhatsApp &amp; Layanan Cabang
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    +{brand.whatsappNumber}
                  </p>
                  <span className="text-xs text-slate-500 mt-0.5 block">
                    Customer Care &amp; Reservasi Servis Cepat
                  </span>
                </div>
              </div>

            </div>

            {/* CTA Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <a
                href={brand.mapsGoogleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">near_me</span>
                <span>Buka Google Maps</span>
              </a>

              <a
                href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(brand.whatsappDefaultMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Chat Admin Cabang</span>
              </a>
            </div>

          </div>

          {/* Right Column: Google Maps Embed Iframe */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-200/80 shadow-md min-h-[360px] lg:min-h-full relative bg-slate-200">
            <iframe
              title="Peta Super Shop & Drive Cabang Ampera"
              src="https://maps.google.com/maps?q=-6.282211310645697,106.82035294973412&hl=id&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full block"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
