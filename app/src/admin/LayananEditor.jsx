import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function LayananEditor() {
  const { content, updateServices } = useSiteData();
  const { services } = content;

  const [serviceList, setServiceList] = useState(services || []);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    badge: '',
    image: '/Assets/bg1.jpeg',
    description: '',
    priceEstimate: 'Mulai Rp ',
    waMessage: '',
  });
  const [savedNotice, setSavedNotice] = useState(false);

  const startEdit = (srv) => {
    setEditingId(srv.id);
    setFormData({ ...srv });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (editingId === 'new') {
      const newItem = {
        ...formData,
        id: `srv-${Date.now()}`,
      };
      const updated = [...serviceList, newItem];
      setServiceList(updated);
      updateServices(updated);
    } else {
      const updated = serviceList.map((item) =>
        item.id === editingId ? { ...item, ...formData } : item
      );
      setServiceList(updated);
      updateServices(updated);
    }
    setEditingId(null);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus layanan ini?')) {
      const updated = serviceList.filter((item) => item.id !== id);
      setServiceList(updated);
      updateServices(updated);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }
  };

  const startAdd = () => {
    setEditingId('new');
    setFormData({
      title: '',
      badge: 'Layanan Baru',
      image: '/Assets/bg1.jpeg',
      description: '',
      priceEstimate: 'Mulai Rp 200.000',
      waMessage: 'Halo Super Shop & Drive Ampera, saya ingin tanya layanan ini',
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#002884]">
            Kelola Katalog Produk &amp; Layanan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tambah, edit deskripsi, perbarui harga estimasi, atau sesuaikan foto layanan yang tampil di website.
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
            <span>Tambah Layanan Baru</span>
          </button>
        </div>
      </div>

      {/* Editing Form Modal / Inline */}
      {editingId && (
        <div className="mb-8 p-6 bg-slate-50 rounded-2xl border-2 border-[#002884]/30 shadow-inner">
          <h3 className="text-base font-bold text-[#002884] mb-4">
            {editingId === 'new' ? 'Tambah Layanan Baru' : `Edit: ${formData.title}`}
          </h3>
          <form onSubmit={handleSaveItem} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Layanan
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Badge / Tagline (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Estimasi Biaya
                </label>
                <input
                  type="text"
                  required
                  value={formData.priceEstimate}
                  onChange={(e) => setFormData({ ...formData, priceEstimate: e.target.value })}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Path / URL Gambar
                </label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Deskripsi Layanan
              </label>
              <textarea
                rows="2"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Pesan WhatsApp Otomatis (Saat Pengunjung Klik)
              </label>
              <input
                type="text"
                value={formData.waMessage}
                onChange={(e) => setFormData({ ...formData, waMessage: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-xs rounded-xl shadow"
              >
                Simpan Layanan
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Foto</th>
              <th className="py-3 px-4">Nama Layanan</th>
              <th className="py-3 px-4">Estimasi Harga</th>
              <th className="py-3 px-4">Badge</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {serviceList.map((srv) => (
              <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="w-14 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="py-3 px-4 font-bold text-slate-900">
                  {srv.title}
                  <p className="text-xs font-normal text-slate-500 line-clamp-1">{srv.description}</p>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-800">
                  {srv.priceEstimate}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-slate-200 text-slate-700">
                    {srv.badge || '-'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => startEdit(srv)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(srv.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
