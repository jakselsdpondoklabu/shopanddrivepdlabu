import React from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function TestimoniSection() {
  const { content } = useSiteData();
  const { testimonials, brand } = content;

  if (!testimonials || !testimonials.items || testimonials.items.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 lg:py-24 bg-[#0B132B] text-white relative overflow-hidden" id="testimoni">
      {/* Background ambient texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(11, 19, 43, 0.95) 0%, rgba(11, 19, 43, 0.85) 50%, rgba(11, 19, 43, 0.7) 100%), url("/Assets/bg3.jpg")`,
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Trust Summary & Rating Score */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1C2541] text-[#F59E0B] rounded-full mb-4 text-xs font-bold border border-slate-700">
              <span className="material-symbols-outlined text-[16px] text-[#F59E0B]">star</span>
              <span>Ulasan Pelanggan Terverifikasi</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Testimoni Pelanggan Cabang Ampera
            </h2>

            <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
              {testimonials.subtitle}
            </p>

            {/* Trust Score Card */}
            <div className="w-full bg-[#1C2541]/90 backdrop-blur-md p-6 rounded-2xl mb-6 border border-slate-700/60 shadow-lg">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-4xl sm:text-5xl font-black text-white leading-none">
                    {testimonials.score || '4.9'}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 mt-1">
                    Skor Kepuasan
                  </span>
                </div>

                <div className="flex flex-col">
                  <div className="flex text-[#F59E0B] text-xl mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined">star</span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-300">
                    Berdasarkan <strong>{testimonials.totalReviews || '1.420+'}</strong> Ulasan Google
                  </span>
                </div>
              </div>
            </div>

            <a
              href={brand.mapsGoogleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-transparent hover:bg-[#1C2541] text-white text-xs sm:text-sm font-bold rounded-xl transition-all border border-slate-700"
            >
              <span className="material-symbols-outlined text-[#F59E0B] text-[20px]">
                rate_review
              </span>
              <span>Lihat Ulasan di Google Maps</span>
            </a>
          </div>

          {/* Right Column: Curated Testimonials Feed */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {testimonials.items.map((t) => (
              <div
                key={t.id}
                className="bg-[#1C2541]/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-700/60 shadow-md hover:border-slate-500/60 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full ${
                        t.avatarBg || 'bg-[#002884]'
                      } flex items-center justify-center text-white font-black text-sm shrink-0 shadow-xs`}
                    >
                      {t.initials || t.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {t.name}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {t.vehicle}
                      </span>
                    </div>
                  </div>

                  <div className="flex text-[#F59E0B] text-base">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[18px]">star</span>
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
