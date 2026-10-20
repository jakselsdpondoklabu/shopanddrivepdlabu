import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function TestimoniEditor() {
  const { content, updateTestimonials } = useSiteData();
  const { testimonials } = content;

  const [score, setScore] = useState(testimonials?.score || '4.9');
  const [totalReviews, setTotalReviews] = useState(testimonials?.totalReviews || '1.420+');
  const [items, setItems] = useState(testimonials?.items || []);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    vehicle: '',
    rating: 5,
    review: '',
  });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveScore = (e) => {
    e.preventDefault();
    updateTestimonials({
      score,
      totalReviews,
      subtitle,
      items,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setFormData({ ...t });
  };

  const startAdd = () => {
    setEditingId('new');
    setFormData({
      name: '',
      vehicle: 'Pemilik Kendaraan • Pondok Labu',
      rating: 5,
      review: '',
    });
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    let updated;
    if (editingId === 'new') {
      const newItem = {
        ...formData,
        id: `testi-${Date.now()}`,
        initials: formData.name.substring(0, 2).toUpperCase(),
        avatarBg: 'bg-[#002884]',
      };
      updated = [...items, newItem];
    } else {
      updated = items.map((t) =>
        t.id === editingId
          ? { ...t, ...formData, initials: formData.name.substring(0, 2).toUpperCase() }
          : t
      );
    }
    setItems(updated);
    updateTestimonials({ items: updated });
    setEditingId(null);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus testimoni ini?')) {
      const updated = items.filter((t) => t.id !== id);
      setItems(updated);
      updateTestimonials({ items: updated });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#002884]">
            Kelola Testimoni &amp; Ulasan Pelanggan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola data skor Google Maps dan ulasan terverifikasi dari para pelanggan cabang Pondok Labu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedNotice && (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-xs rounded-lg animate-pulse">
              Berhasil Disimpan!
            </span>
          )}
          <button
            onClick={startAdd}
            className="px-4 py-2 bg-[#E3000F] hover:bg-[#C2000D] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Tambah Testimoni Baru</span>
          </button>
        </div>
      </div>

      {/* Score and Stats form */}
      <form onSubmit={handleSaveScore} className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
        <h3 className="text-sm font-bold text-[#002884] mb-3">
          Ringkasan Skor Google Review
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Skor Rata-Rata (cth: 4.9)
            </label>
            <input
              type="text"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Total Ulasan Terverifikasi (cth: 1.420+)
            </label>
            <input
              type="text"
              value={totalReviews}
              onChange={(e) => setTotalReviews(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-xs rounded-lg transition-colors"
        >
          Perbarui Ringkasan Skor
        </button>
      </form>

      {/* Inline Form Add/Edit */}
      {editingId && (
        <div className="mb-8 p-6 bg-slate-50 rounded-2xl border-2 border-[#002884]/30 shadow-inner">
          <h3 className="text-base font-bold text-[#002884] mb-4">
            {editingId === 'new' ? 'Tambah Testimoni Pelanggan' : `Edit: ${formData.name}`}
          </h3>
          <form onSubmit={handleSaveItem} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Pelanggan
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Hendra Wijaya"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tipe Mobil / Domisili
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  placeholder="Honda CR-V Turbo • Pondok Labu"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Rating Bintang (1 - 5)
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                >
                  <option value={5}>5 Bintang (Sangat Puas)</option>
                  <option value={4}>4 Bintang (Puas)</option>
                  <option value={3}>3 Bintang (Cukup)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Isi Testimoni / Ulasan
              </label>
              <textarea
                rows="3"
                required
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                placeholder="Pengalaman servis di Shop & Drive Pondok Labu..."
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-xs rounded-xl shadow"
              >
                Simpan Testimoni
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List */}
      <div className="space-y-3">
        {items.map((t) => (
          <div
            key={t.id}
            className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                <span className="text-xs text-slate-500">• {t.vehicle}</span>
                <div className="flex text-[#F59E0B] text-xs">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm">star</span>
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 italic">&ldquo;{t.review}&rdquo;</p>
            </div>

            <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
              <button
                onClick={() => startEdit(t)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
