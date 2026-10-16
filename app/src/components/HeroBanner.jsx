import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function HeroBanner() {
  const { content } = useSiteData();
  const { hero, brand, services } = content;

  const [carBrand, setCarBrand] = useState('Toyota');
  const [selectedService, setSelectedService] = useState('Ganti Aki GS Astra');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const message = `Halo Super Shop & Drive Ampera, saya ingin cek antrean & booking jadwal servis:\n- Merk Mobil: ${carBrand}\n- Jenis Servis: ${selectedService}\n- Rencana Tanggal: ${selectedDate}\nMohon konfirmasi ketersediaan slot teknisi. Terima kasih.`;
    const waUrl = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section className="relative w-full bg-[#0B132B] overflow-hidden pt-20">
      {/* Background Image with Scrim Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-60"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(11, 19, 43, 0.94) 0%, rgba(11, 19, 43, 0.82) 50%, rgba(11, 19, 43, 0.65) 100%), url("${hero.bgImage || '/Assets/bg1.jpeg'}")`,
        }}
      />

      {/* Subtle ambient lighting orb */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#E3000F]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, Trust Pill, and Quick Stats */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C2541] border border-slate-700/60 text-slate-200 shadow-sm mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E3000F] animate-ping" />
              <span className="text-xs font-bold tracking-wider uppercase text-red-200">
                {hero.badgeText}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {hero.headline} <span className="text-[#FF8A80] block sm:inline">{hero.headlineHighlight}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mb-8 leading-relaxed">
              {hero.subheadline}
            </p>

            {/* Action CTA Group */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 w-full sm:w-auto">
              <a
                href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(brand.whatsappDefaultMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E3000F] hover:bg-[#C2000D] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-[#E3000F]/30 hover:shadow-[#E3000F]/50 transition-all transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>{hero.ctaText}</span>
              </a>

              <a
                href="#layanan"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#1C2541] hover:bg-[#002884] text-white font-bold text-sm sm:text-base rounded-xl border border-slate-700/80 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">tune</span>
                <span>{hero.secondaryCtaText}</span>
              </a>
            </div>

            {/* Quick Stats Bar */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1C2541]/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/50">
              {hero.stats && hero.stats.map((st, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black text-white">{st.value}</span>
                  <span className="text-xs font-medium text-slate-400 mt-0.5">{st.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Quick Booking Estimator Widget */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white text-[#0B1C30] p-6 sm:p-7 rounded-2xl shadow-2xl border border-slate-100 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#E3000F] text-2xl">
                    calendar_month
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#002884]">
                    Cek Antrean &amp; Jadwal
                  </h2>
                </div>
                <span className="px-2.5 py-1 bg-red-50 text-[#E3000F] font-bold text-[11px] rounded-full uppercase tracking-wider">
                  Cabang Ampera
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-5 leading-normal">
                Pilih tipe mobil dan kebutuhan servis untuk mengecek ketersediaan montir terlatih dan estimasi pengerjaan.
              </p>

              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Merk / Tipe Mobil
                  </label>
                  <div className="relative">
                    <select
                      value={carBrand}
                      onChange={(e) => setCarBrand(e.target.value)}
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002884] cursor-pointer appearance-none"
                    >
                      <option value="Toyota (Innova, Fortuner, Avanza, Yaris, Rush)">Toyota (Innova, Avanza, Fortuner, Yaris, Calya)</option>
                      <option value="Honda (CR-V, HR-V, Civic, Brio, Jazz)">Honda (CR-V, HR-V, Brio, Mobilio, BR-V)</option>
                      <option value="Mitsubishi (Pajero Sport, Xpander, Outlander)">Mitsubishi (Pajero Sport, Xpander, Xforce)</option>
                      <option value="Suzuki / Daihatsu / Nissan">Suzuki / Daihatsu / Nissan</option>
                      <option value="Hyundai / Kia / Wuling">Hyundai / Kia / Wuling</option>
                      <option value="Mobil Eropa (BMW, Mercedes-Benz, VW)">Mobil Eropa (BMW, Mercedes-Benz, VW, Audi)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-400 text-lg">
                      expand_more
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Kebutuhan Servis
                  </label>
                  <div className="relative">
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002884] cursor-pointer appearance-none"
                    >
                      {services && services.map((srv) => (
                        <option key={srv.id} value={srv.title}>
                          {srv.title} ({srv.priceEstimate})
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-400 text-lg">
                      expand_more
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Rencana Tanggal Servis
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002884] cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3.5 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                    send
                  </span>
                  <span>Kirim Jadwal ke WhatsApp Admin</span>
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-500">
                <span className="material-symbols-outlined text-[#008239] text-[18px]">
                  verified
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  Tanpa DP • Pembayaran Aman di Workshop Cabang
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
