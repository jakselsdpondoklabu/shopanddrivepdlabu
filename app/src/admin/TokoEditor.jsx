import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function TokoEditor() {
  const { content, updateStoreStatus, updateBrand, isStoreOpen } = useSiteData();
  const { storeStatus, brand } = content;

  const [mode, setMode] = useState(storeStatus?.mode || 'auto');
  const [openTime, setOpenTime] = useState(storeStatus?.openTime || '08:00');
  const [closeTime, setCloseTime] = useState(storeStatus?.closeTime || '20:00');
  const [subName, setSubName] = useState(
    brand?.subName && brand.subName.toUpperCase().includes('WORKSHOP')
      ? 'AMPERA'
      : (brand?.subName || 'AMPERA')
  );
  const [phone, setPhone] = useState(brand?.phone || '(021) 782-3844');
  const [operationalHours, setOperationalHours] = useState(brand?.operationalHours || '08.00 s/d 20.00 WIB (Buka Setiap Hari)');
  const [address, setAddress] = useState(brand?.address || 'JL. Ampera Raya no.138 Ragunan, Pasar Minggu, Jakarta Selatan');
  const [mapsGoogleUrl, setMapsGoogleUrl] = useState(brand?.mapsGoogleUrl || '');
  const [coordinates, setCoordinates] = useState(brand?.coordinates || '-6.2822913, 106.8196073');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStoreStatus({
      mode,
      openTime,
      closeTime,
    });
    updateBrand({
      subName: subName.trim(),
      phone: phone.trim(),
      operationalHours,
      address,
      mapsGoogleUrl,
      coordinates,
      mapsEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(coordinates.trim())}&hl=id&z=17&output=embed`,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const currentOpen = isStoreOpen();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-4xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#002884]">
            Pengaturan Status Toko &amp; Jam Operasional
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Atur status buka/tutup bengkel yang tampil di bagian kanan atas navbar dengan indikator hijau (buka) atau merah (tutup).
          </p>
        </div>

        {savedNotice && (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-xs rounded-lg animate-pulse">
            Pengaturan Disimpan!
          </span>
        )}
      </div>

      {/* Live Status Preview Box */}
      <div className="mb-8 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Status Toko Saat Ini di Website:
          </span>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${
              currentOpen
                ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/40'
                : 'bg-red-500/15 text-red-600 border-red-500/40'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${currentOpen ? 'bg-emerald-500 animate-ping' : 'bg-red-500 animate-ping'}`} />
              <span>{currentOpen ? `BUKA (${openTime} - ${closeTime})` : `TUTUP (Buka Jam ${openTime})`}</span>
            </span>
            <span className="text-xs text-slate-500">
              {mode === 'auto' ? '(Mode Otomatis Sesuai Jam)' : mode === 'open' ? '(Dipaksa Buka Manual)' : '(Dipaksa Tutup Manual)'}
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Waktu Server/Lokal: <strong className="text-slate-800">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Mode Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Pilihan Mode Operasional Toko
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col gap-1 transition-all ${
              mode === 'auto' ? 'border-[#002884] bg-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Otomatis (Jam Sistem)</span>
                <input
                  type="radio"
                  name="storeMode"
                  value="auto"
                  checked={mode === 'auto'}
                  onChange={() => setMode('auto')}
                  className="text-[#002884]"
                />
              </div>
              <span className="text-xs text-slate-500">
                Otomatis hijau jika waktu sekarang berada di antara jam buka dan tutup.
              </span>
            </label>

            <label className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col gap-1 transition-all ${
              mode === 'open' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-800">Paksa Buka (Manual)</span>
                <input
                  type="radio"
                  name="storeMode"
                  value="open"
                  checked={mode === 'open'}
                  onChange={() => setMode('open')}
                  className="text-emerald-600"
                />
              </div>
              <span className="text-xs text-slate-500">
                Selalu tampil status hijau "Buka" tanpa melihat jam saat ini.
              </span>
            </label>

            <label className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col gap-1 transition-all ${
              mode === 'closed' ? 'border-red-600 bg-red-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-red-800">Paksa Tutup (Manual)</span>
                <input
                  type="radio"
                  name="storeMode"
                  value="closed"
                  checked={mode === 'closed'}
                  onChange={() => setMode('closed')}
                  className="text-red-600"
                />
              </div>
              <span className="text-xs text-slate-500">
                Gunakan ini saat bengkel libur hari raya atau sedang perawatan khusus.
              </span>
            </label>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Jam Buka Bengkel
            </label>
            <input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#002884]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Jam Tutup Bengkel
            </label>
            <input
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#002884]"
            />
          </div>
        </div>

        {/* Nama Sub-Cabang di Navbar */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Nama Cabang di Header / Navbar (Teks Merah)
          </label>
          <input
            type="text"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            placeholder="AMPERA"
            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold tracking-widest text-[#E3000F] uppercase focus:outline-none focus:ring-2 focus:ring-[#002884] focus:bg-white"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Tampil tepat di bawah nama "SHOP &amp; DRIVE" pada header website.
          </span>
        </div>

        {/* Nomor Telepon Hotline Bengkel */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Nomor Telepon Hotline Bengkel (Tujuan Tombol Telepon)
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(021) 782-3844"
            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002884] focus:bg-white"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Nomor telepon tujuan saat pengunjung menekan tombol telepon mengambang (floating hotline) atau tombol kontak telepon di seluruh website.
          </span>
        </div>

        {/* Operational Days Text */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Teks Keterangan Jam Operasional (Tampil di Lokasi &amp; Footer)
          </label>
          <input
            type="text"
            value={operationalHours}
            onChange={(e) => setOperationalHours(e.target.value)}
            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
          />
        </div>

        {/* Workshop Address & Google Maps Location */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-[#002884] uppercase tracking-wider">
            Informasi Alamat &amp; Titik Lokasi Google Maps
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Alamat Lengkap Shop &amp; Drive Pondok Labu
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Koordinat Lokasi (Latitude, Longitude)
              </label>
              <input
                type="text"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                placeholder="-6.2822913, 106.8196073"
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                URL Google Maps Cabang
              </label>
              <input
                type="text"
                value={mapsGoogleUrl}
                onChange={(e) => setMapsGoogleUrl(e.target.value)}
                placeholder="https://www.google.com/maps/place/..."
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">save</span>
          <span>Simpan Status &amp; Jam Toko</span>
        </button>

      </form>
    </div>
  );
}
