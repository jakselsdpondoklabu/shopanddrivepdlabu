import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function PromoEditor() {
  const { content, updatePromo } = useSiteData();
  const { promo } = content;

  const [isActive, setIsActive] = useState(promo?.isActive ?? true);
  const [badgeText, setBadgeText] = useState(promo?.badgeText || '');
  const [title, setTitle] = useState(promo?.title || '');
  const [description, setDescription] = useState(promo?.description || '');
  const [promoCode, setPromoCode] = useState(promo?.promoCode || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updatePromo({
      isActive,
      badgeText,
      title,
      description,
      promoCode,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-4xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#002884]">
            Kelola Promo &amp; Diskon Spesial
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Aktifkan promo berjalan, buat kode kupon diskon, dan sesuaikan teks promosi cabang.
          </p>
        </div>

        {savedNotice && (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-xs rounded-lg animate-pulse">
            Tersimpan!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Active Toggle Switch */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <span className="text-sm font-bold text-slate-800 block">
              Tampilkan Section Promo di Website
            </span>
            <span className="text-xs text-slate-500">
              Jika dimatikan, bagian promo akan disembunyikan secara rapi dari pengunjung.
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002884]"></div>
          </label>
        </div>

        {/* Badge & Coupon Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Badge Promo
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="Penawaran Terbatas Bulan Ini"
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Kode Promo / Kupon
            </label>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="AMPERAPRO20"
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#002884]"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Judul Promo
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Deskripsi Promo
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">save</span>
          <span>Simpan Pengaturan Promo</span>
        </button>

      </form>
    </div>
  );
}
