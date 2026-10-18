import React, { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { ImageUploader } from '../components/common/ImageUploader';
import { defaultSiteContent } from '../data/defaultContent';

export function HeroEditor() {
  const { content, updateHeroBanners, updateHero } = useSiteData();
  const { hero } = content;

  // Ensure 5 banners exist
  const existingBanners = hero?.banners && hero.banners.length > 0
    ? hero.banners
    : defaultSiteContent.hero.banners;

  const existingStats = hero?.stats && hero.stats.length > 0
    ? hero.stats
    : defaultSiteContent.hero.stats;

  const [banners, setBanners] = useState(existingBanners);
  const [stats, setStats] = useState(existingStats);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync internal state when site context changes
  useEffect(() => {
    if (hero?.banners && hero.banners.length > 0) {
      setBanners(hero.banners);
    }
    if (hero?.stats && hero.stats.length > 0) {
      setStats(hero.stats);
    }
  }, [hero?.banners, hero?.stats]);

  const currentBanner = banners[selectedIdx] || banners[0] || {};

  const handleUpdateCurrentBanner = (field, value) => {
    setBanners((prev) =>
      prev.map((b, idx) => (idx === selectedIdx ? { ...b, [field]: value } : b))
    );
  };

  const handleUpdateStat = (idx, field, val) => {
    setStats((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateHeroBanners(banners);
    updateHero({ stats });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#002884] tracking-tight">
            Kelola &amp; Upload 5 Hero Banner
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Atur gambar, teks promosi, dan tombol aksi untuk ke-5 banner yang otomatis bergeser di halaman utama.
          </p>
        </div>

        {savedNotice && (
          <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-xs rounded-xl flex items-center gap-1.5 animate-pulse shrink-0">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>Semua Banner Tersimpan!</span>
          </span>
        )}
      </div>

      {/* Banner Tab Selector: 5 Banners */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {banners.map((b, idx) => (
          <button
            key={b.id || idx}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap border ${
              selectedIdx === idx
                ? 'bg-[#002884] text-white border-[#002884] shadow-md scale-[1.02]'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${b.isActive !== false ? 'bg-emerald-400' : 'bg-slate-300'}`} />
            <span>Banner {idx + 1}</span>
            <span className="text-[11px] opacity-75 font-normal truncate max-w-[120px]">
              {b.headline ? b.headline.split(' ').slice(0, 2).join(' ') + '...' : ''}
            </span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Banner Status & Title header */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#002884] text-white flex items-center justify-center font-bold text-sm">
              {selectedIdx + 1}
            </span>
            <div>
              <span className="text-sm font-bold text-slate-900 block">
                Pengaturan Banner #{selectedIdx + 1}
              </span>
              <span className="text-xs text-slate-500">
                Banner ini {currentBanner.isActive !== false ? 'aktif dan tampil di carousel' : 'disembunyikan dari carousel'}.
              </span>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer self-start sm:self-center">
            <input
              type="checkbox"
              checked={currentBanner.isActive !== false}
              onChange={(e) => handleUpdateCurrentBanner('isActive', e.target.checked)}
              className="w-4 h-4 rounded text-[#002884] focus:ring-[#002884]"
            />
            <span className="text-xs font-bold text-slate-700">Aktifkan Slide Ini</span>
          </label>
        </div>

        {/* 1. Image Uploader Component */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <ImageUploader
            label={`Foto Background Banner #${selectedIdx + 1}`}
            aspectRatioLabel="Disarankan rasio lebar (16:9) resolusi HD"
            value={currentBanner.bgImage || '/Assets/bg1.jpeg'}
            onChange={(newImg) => handleUpdateCurrentBanner('bgImage', newImg)}
          />
        </div>

        {/* 2. Badge Text */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Teks Badge Kepercayaan / Kategori
          </label>
          <input
            type="text"
            value={currentBanner.badgeText || ''}
            onChange={(e) => handleUpdateCurrentBanner('badgeText', e.target.value)}
            placeholder="Contoh: Super Shop & Drive Ampera • Bengkel Resmi Astra Otoparts"
            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884] focus:bg-white"
          />
        </div>

        {/* 3. Headline & Headline Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Headline Utama Banner
            </label>
            <input
              type="text"
              value={currentBanner.headline || ''}
              onChange={(e) => handleUpdateCurrentBanner('headline', e.target.value)}
              placeholder="Contoh: Servis & Perawatan Mobil Presisi"
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Teks Highlight Cabang / Promo (Merah)
            </label>
            <input
              type="text"
              value={currentBanner.headlineHighlight || ''}
              onChange={(e) => handleUpdateCurrentBanner('headlineHighlight', e.target.value)}
              placeholder="Contoh: Super Shop & Drive Ampera"
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884] focus:bg-white text-red-600 font-bold"
            />
          </div>
        </div>

        {/* 4. Subheadline / Deskripsi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Subheadline / Deskripsi Promosi
          </label>
          <textarea
            rows="3"
            value={currentBanner.subheadline || ''}
            onChange={(e) => handleUpdateCurrentBanner('subheadline', e.target.value)}
            placeholder="Jelaskan penawaran atau keunggulan layanan..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884] focus:bg-white"
          />
        </div>

        {/* 5. CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Teks Tombol Aksi WhatsApp (Merah)
            </label>
            <input
              type="text"
              value={currentBanner.ctaText || 'Booking via WhatsApp'}
              onChange={(e) => handleUpdateCurrentBanner('ctaText', e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Teks Tombol Sekunder (Biru)
            </label>
            <input
              type="text"
              value={currentBanner.secondaryCtaText || 'Lihat Layanan Bengkel'}
              onChange={(e) => handleUpdateCurrentBanner('secondaryCtaText', e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884] focus:bg-white"
            />
          </div>
        </div>

        {/* Pratinjau Tampilan Banner */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Pratinjau Visual Slide #{selectedIdx + 1}:
          </span>
          <div
            className="relative rounded-2xl overflow-hidden p-6 text-white min-h-[180px] flex flex-col justify-end bg-slate-900 border border-slate-700"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(11, 19, 43, 0.95), rgba(11, 19, 43, 0.7)), url("${currentBanner.bgImage || '/Assets/bg1.jpeg'}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-300 block mb-1">
              {currentBanner.badgeText || 'Badge Promosi'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight mb-1">
              {currentBanner.headline || 'Headline'}{' '}
              <span className="text-[#FF8A80]">{currentBanner.headlineHighlight || 'Highlight'}</span>
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2 max-w-xl">
              {currentBanner.subheadline || 'Deskripsi singkat layanan...'}
            </p>
          </div>
        </div>

        {/* 4 Statistik & Keunggulan Bengkel (Stats Counter) */}
        <div className="pt-6 border-t border-slate-200">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#002884] flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-[#002884]">analytics</span>
              <span>4 Statistik &amp; Keunggulan Bengkel (Kotak Hitam Bawah Banner)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ubah angka atau teks keunggulan bengkel yang tampil pada kotak statistik gelap di bawah tombol aksi hero banner.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((st, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Slot #{idx + 1}
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Nilai / Angka (Value)
                  </label>
                  <input
                    type="text"
                    value={st.value || ''}
                    onChange={(e) => handleUpdateStat(idx, 'value', e.target.value)}
                    placeholder="Contoh: 13+ Th"
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002884]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Label Keterangan
                  </label>
                  <input
                    type="text"
                    value={st.label || ''}
                    onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)}
                    placeholder="Contoh: Pengalaman Teknisi"
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002884]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
            <span>Perubahan banner &amp; statistik akan langsung tersimpan di Cloud Database</span>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            <span>Simpan Hero Banner &amp; Statistik</span>
          </button>
        </div>

      </form>
    </div>
  );
}
