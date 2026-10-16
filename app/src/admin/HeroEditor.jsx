import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function HeroEditor() {
  const { content, updateHero } = useSiteData();
  const { hero } = content;

  const [badgeText, setBadgeText] = useState(hero.badgeText || '');
  const [headline, setHeadline] = useState(hero.headline || '');
  const [headlineHighlight, setHeadlineHighlight] = useState(hero.headlineHighlight || '');
  const [subheadline, setSubheadline] = useState(hero.subheadline || '');
  const [bgImage, setBgImage] = useState(hero.bgImage || '/Assets/bg1.jpeg');
  const [ctaText, setCtaText] = useState(hero.ctaText || 'Booking via WhatsApp');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateHero({
      badgeText,
      headline,
      headlineHighlight,
      subheadline,
      bgImage,
      ctaText,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-4xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#002884]">
            Kelola Hero Banner &amp; Background
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Atur teks promosi utama, foto latar belakang, dan tombol aksi yang pertama kali dilihat pengunjung.
          </p>
        </div>

        {savedNotice && (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-xs rounded-lg animate-pulse">
            Tersimpan Berhasil!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Badge Text */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Teks Badge Kepercayaan
          </label>
          <input
            type="text"
            value={badgeText}
            onChange={(e) => setBadgeText(e.target.value)}
            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
          />
        </div>

        {/* Headline & Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Headline Utama
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Teks Highlight Cabang (Merah)
            </label>
            <input
              type="text"
              value={headlineHighlight}
              onChange={(e) => setHeadlineHighlight(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
            />
          </div>
        </div>

        {/* Subheadline */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Subheadline / Deskripsi Pendukung
          </label>
          <textarea
            rows="3"
            value={subheadline}
            onChange={(e) => setSubheadline(e.target.value)}
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
          />
        </div>

        {/* Background Image Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Pilihan Background Gambar
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
            {hero.availableBgImages && hero.availableBgImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setBgImage(img.path)}
                className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all p-2 ${
                  bgImage === img.path
                    ? 'border-[#E3000F] bg-red-50/50 shadow-md scale-[1.02]'
                    : 'border-slate-200 hover:border-slate-400 bg-white'
                }`}
              >
                <div className="h-28 w-full rounded-xl overflow-hidden mb-2 bg-slate-100">
                  <img src={img.path} alt={img.label} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>{img.label}</span>
                  {bgImage === img.path && (
                    <span className="material-symbols-outlined text-[#E3000F] text-base">check_circle</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2">
            <span className="text-xs text-slate-500 block mb-1">
              Atau masukkan path / URL gambar kustom:
            </span>
            <input
              type="text"
              value={bgImage}
              onChange={(e) => setBgImage(e.target.value)}
              placeholder="/Assets/bg1.jpeg"
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
            />
          </div>
        </div>

        {/* CTA Button Text */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Teks Tombol CTA WhatsApp
          </label>
          <input
            type="text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">save</span>
          <span>Simpan Perubahan Hero</span>
        </button>

      </form>
    </div>
  );
}
