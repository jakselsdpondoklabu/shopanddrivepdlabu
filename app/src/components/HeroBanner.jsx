import React, { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function HeroBanner() {
  const { content, addBooking, sendBookingToGowa } = useSiteData();
  const { hero, brand, services } = content;

  // 5 Banners support with fallback
  const banners = hero?.banners && hero.banners.length > 0
    ? hero.banners
    : [
      {
        id: 'banner-1',
        badgeText: hero?.badgeText || 'Shop & Drive Pondok Labu • Bengkel Resmi Astra Otoparts',
        headline: hero?.headline || 'Servis & Perawatan Mobil Presisi',
        headlineHighlight: hero?.headlineHighlight || 'Shop & Drive Pondok Labu',
        subheadline: hero?.subheadline || 'Solusi cepat, terpercaya, dan bergaransi resmi dari Astra Otoparts untuk ratusan tipe kendaraan Anda di Jakarta Selatan.',
        bgImage: hero?.bgImage || '/Assets/bg1.jpeg',
        ctaText: hero?.ctaText || 'Booking via WhatsApp',
        secondaryCtaText: hero?.secondaryCtaText || 'Lihat Layanan Bengkel',
        isActive: true,
      },
    ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, banners.length]);

  const currentBanner = banners[activeSlide] || banners[0];

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % banners.length);
  };

  // Form Cek Antrean & Jadwal (5 Field Lengkap)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [carModel, setCarModel] = useState('');
  const [selectedService, setSelectedService] = useState(() => services?.[0]?.title || 'Jasa Ganti Aki Mobil');
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Mohon isi nama lengkap Anda.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Mohon isi nomor HP atau WhatsApp Anda.');
      return;
    }
    if (!carModel.trim()) {
      alert('Mohon isi merk & tipe mobil Anda (contoh: Honda Brio 2021).');
      return;
    }

    setIsSubmitting(true);

    const bookingPayload = {
      name: customerName.trim(),
      phone: customerPhone.trim(),
      carModel: carModel.trim(),
      serviceNeed: selectedService,
      serviceDate: selectedDate,
      createdAt: new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // 1. Simpan ke database lokal / state antrean website
    if (addBooking) {
      addBooking(bookingPayload);
    }

    // 2. Kirim otomatis ke Chat Grup WhatsApp melalui API GOWA tanpa API key
    if (sendBookingToGowa) {
      await sendBookingToGowa(bookingPayload);
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  return (
    <section
      className="relative w-full bg-[#0B132B] overflow-hidden pt-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero Carousel Banner Shop & Drive Pondok Labu"
    >
      {/* Background Image Carousel Slider (Maximum Visibility & High Definition) */}
      {banners.map((b, idx) => (
        <div
          key={b.id || idx}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-105'
            }`}
          style={{
            backgroundImage: `url("${b.bgImage || '/Assets/bg1.jpeg'}")`,
            transitionProperty: 'opacity, transform',
          }}
        />
      ))}

      {/* Lightweight directional scrim: leaves center and right photographic areas bright and fully visible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(11, 19, 43, 0.78) 0%, rgba(11, 19, 43, 0.40) 48%, rgba(11, 19, 43, 0.05) 80%, transparent 100%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none bg-gradient-to-t from-[#0B132B] to-transparent" />

      {/* Subtle ambient lighting orb */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#E3000F]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Headlines, Trust Pill, Quick Stats, and Banner Navigation (Enhanced Glass Card for Razor-Sharp Readability) */}
          <div className="lg:col-span-7 flex flex-col items-start z-10 p-5 sm:p-7 rounded-3xl bg-[#0B132B]/55 backdrop-blur-md border border-slate-700/60 shadow-2xl">

            {/* Banner Slider Controls: Badge & Slide Index */}
            <div className="flex flex-wrap items-center gap-2 mb-4 w-full">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C2541]/90 backdrop-blur-md border border-slate-600/70 text-slate-100 shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E3000F] animate-ping" />
                <span className="text-xs font-bold tracking-wider uppercase text-red-200">
                  {currentBanner.badgeText || hero?.badgeText}
                </span>
              </div>

              {banners.length > 1 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-slate-700/80 text-[11px] font-semibold text-slate-200">
                  <span className="text-[#FF8A80] font-bold">{activeSlide + 1}</span>
                  <span className="text-slate-400">/</span>
                  <span>{banners.length}</span>
                </div>
              )}
            </div>

            {/* Main Headline (Keyed for smooth fade transition on slide change) */}
            <div key={`headline-${activeSlide}`} className="transition-all duration-500 animate-fadeIn">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
                {currentBanner.headline || hero?.headline}{' '}
                <span className="text-[#FF8A80] block sm:inline">
                  {currentBanner.headlineHighlight || hero?.headlineHighlight}
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-100 max-w-xl mb-7 leading-relaxed font-medium drop-shadow-md">
                {currentBanner.subheadline || hero?.subheadline}
              </p>
            </div>

            {/* Action CTA Group */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 w-full sm:w-auto">
              <a
                href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(brand.whatsappDefaultMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E3000F] hover:bg-[#C2000D] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-[#E3000F]/30 hover:shadow-[#E3000F]/50 transition-all transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>{currentBanner.ctaText || 'Booking via WhatsApp'}</span>
              </a>

              <a
                href="#layanan"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#1C2541] hover:bg-[#002884] text-white font-bold text-sm sm:text-base rounded-xl border border-slate-700/80 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">tune</span>
                <span>{currentBanner.secondaryCtaText || 'Lihat Layanan Bengkel'}</span>
              </a>
            </div>

            {/* Carousel Navigation Bar (5 Dots + Prev/Next Controls) */}
            {banners.length > 1 && (
              <div className="flex items-center gap-3 mb-8 bg-[#1C2541]/70 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/60">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-[#002884] text-white flex items-center justify-center transition-colors"
                  aria-label="Banner sebelumnya"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>

                <div className="flex items-center gap-2">
                  {banners.map((b, idx) => (
                    <button
                      key={b.id || idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2.5 rounded-full transition-all ${idx === activeSlide
                        ? 'w-8 bg-[#E3000F] shadow-sm shadow-[#E3000F]'
                        : 'w-2.5 bg-slate-600 hover:bg-slate-400'
                        }`}
                      aria-label={`Pindah ke banner ${idx + 1}`}
                      title={b.headline || `Banner ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-[#002884] text-white flex items-center justify-center transition-colors"
                  aria-label="Banner selanjutnya"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>

                <span className="text-[11px] text-slate-400 pl-1 font-medium border-l border-slate-700">
                  {isPaused ? 'Dijeda' : 'Otomatis 5 dtk'}
                </span>
              </div>
            )}

            {/* Quick Stats Bar */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1C2541]/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/50">
              {hero.stats && hero.stats.map((st, idx) => (
                <div key={idx} className="flex flex-col justify-center">
                  <span className={`font-black text-white leading-tight break-words ${
                    (st.value || '').length > 12 
                      ? 'text-sm sm:text-base lg:text-lg' 
                      : 'text-xl sm:text-2xl'
                  }`}>
                    {st.value}
                  </span>
                  <span className="text-xs font-medium text-slate-400 mt-0.5">{st.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Quick Booking Widget (Ukuran Kompak 40% Lebih Ringkas) */}
          <div className="lg:col-span-5 xl:col-span-4 w-full z-10 flex lg:justify-end">
            <div className="bg-white/95 backdrop-blur-md text-[#0B1C30] p-4 sm:p-5 rounded-2xl shadow-xl border border-white/60 relative w-full max-w-[370px]">

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#E3000F] text-xl">
                    calendar_month
                  </span>
                  <h2 className="text-base font-bold text-[#002884]">
                    Cek Antrean &amp; Jadwal
                  </h2>
                </div>
                <span className="px-2 py-0.5 bg-red-50 text-[#E3000F] font-bold text-[10px] rounded-full uppercase tracking-wider">
                  Ampera
                </span>
              </div>

              <p className="text-[11px] text-slate-500 mb-2.5 leading-snug">
                Cek jadwal Shop &amp; Drive Pondok Labu.
              </p>

              {submitSuccess ? (
                <div className="py-1 text-center animate-fadeIn space-y-2.5">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <span className="material-symbols-outlined text-2xl">check_circle</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#002884] leading-tight">
                      Pesan Berhasil Terkirim!
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      Data terkirim ke WhatsApp tim Shop &amp; Drive Pondok Labu. Mohon ditunggu balasan kami.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-left text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pelanggan:</span>
                      <span className="font-bold text-slate-800">{customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Kendaraan:</span>
                      <span className="font-bold text-slate-800">{carModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Layanan:</span>
                      <span className="font-bold text-[#002884] truncate max-w-[180px]">{selectedService}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rencana Servis:</span>
                      <span className="font-bold text-slate-800">{selectedDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <a
                      href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(`Halo Admin Shop & Drive Ampera, saya ${customerName} telah mengisi form reservasi untuk mobil ${carModel} pada tanggal ${selectedDate}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                      <span>Chat WhatsApp Admin (Opsional)</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitSuccess(false);
                        setCustomerName('');
                        setCustomerPhone('');
                        setCarModel('');
                      }}
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                    >
                      Buat Reservasi Baru
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="flex flex-col gap-2">

                  {/* 1. Nama Lengkap */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5 uppercase tracking-wide">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002884] focus:bg-white"
                    />
                  </div>

                  {/* 2. Nomor HP / WhatsApp */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5 uppercase tracking-wide">
                      Nomor WhatsApp / HP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002884] focus:bg-white"
                    />
                  </div>

                  {/* 3. Merk & Tipe Mobil */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5 uppercase tracking-wide">
                      Merk &amp; Tipe Mobil <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="Contoh: Honda Brio / Toyota Innova"
                      className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002884] focus:bg-white"
                    />
                  </div>

                  {/* 4. Kebutuhan Servis (Sesuaikan Menu Layanan Bengkel) */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5 uppercase tracking-wide">
                      Kebutuhan Servis <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full h-8 pl-2.5 pr-7 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002884] cursor-pointer appearance-none truncate"
                      >
                        {services && services.map((srv) => (
                          <option key={srv.id} value={srv.title}>
                            {srv.title}
                          </option>
                        ))}
                        <option value="Konsultasi & Pengecekan Servis Lainnya">
                          Konsultasi &amp; Pengecekan Servis Lainnya
                        </option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-1.5 pointer-events-none text-slate-400 text-base">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* 5. Rencana Tanggal Servis */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5 uppercase tracking-wide">
                      Rencana Tanggal Servis <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002884] cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-1 py-2.5 bg-[#002884] hover:bg-[#001C5D] disabled:bg-slate-400 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 group cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined text-base animate-spin">
                          progress_activity
                        </span>
                        <span>Mengirim ke WhatsApp...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">
                          send
                        </span>
                        <span>Kirim Permintaan / Penjadwalan</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-500">
                <span className="material-symbols-outlined text-[#008239] text-base">
                  verified
                </span>
                <span className="text-[10px] font-semibold text-slate-600">
                  Jangan melakukan transfer / pembayaran sebelum part diganti!
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
