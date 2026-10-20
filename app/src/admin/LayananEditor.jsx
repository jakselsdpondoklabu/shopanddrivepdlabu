import React, { useState, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import {
  uploadProductPhoto,
  compressImage,
} from '../lib/supabaseClient';

const PRESET_SERVICE_IMAGES = [
  { label: 'Ganti Aki', url: '/Assets/ganti aki.jpg' },
  { label: 'Ganti Oli', url: '/Assets/ganti oli.webp' },
  { label: 'Shock Absorber KYB', url: '/Assets/shock-kyb.jpg' },
  { label: 'Spooring & Ban', url: '/Assets/spooring.webp' },
  { label: 'Bengkel Presisi', url: '/Assets/bg1.jpeg' },
  { label: 'Armada Delivery', url: '/Assets/bg2.jpg' },
  { label: 'Suku Cadang Asli', url: '/Assets/bg3.jpg' },
];

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

  const [stagedFile, setStagedFile] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const fileInputRef = useRef(null);

  const startEdit = (srv) => {
    setEditingId(srv.id);
    setStagedFile(null);
    setFormData({ ...srv });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setStagedFile(null);
  };

  const startAdd = () => {
    setEditingId('new');
    setStagedFile(null);
    setFormData({
      title: '',
      badge: 'Layanan Baru',
      image: '/Assets/bg1.jpeg',
      description: '',
      priceEstimate: 'Mulai Rp 200.000',
      waMessage: 'Halo Shop & Drive Pondok Labu, saya ingin tanya layanan ini',
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      const { dataUrl } = await compressImage(file, 1200, 0.82);
      setStagedFile(file);
      setFormData((prev) => ({ ...prev, image: dataUrl }));
    } catch (err) {
      console.error('Error memproses gambar:', err);
      alert('Gagal membaca gambar. Silakan gunakan format JPG, PNG, atau WEBP.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      try {
        setIsProcessingImage(true);
        const { dataUrl } = await compressImage(file, 1200, 0.82);
        setStagedFile(file);
        setFormData((prev) => ({ ...prev, image: dataUrl }));
      } catch (err) {
        console.error('Error memproses drop gambar:', err);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      let finalImageUrl = formData.image;

      if (stagedFile) {
        try {
          const uploadResult = await uploadProductPhoto(stagedFile);
          if (uploadResult && uploadResult.url) {
            finalImageUrl = uploadResult.url;
          }
        } catch (uploadErr) {
          console.warn('Upload cloud foto layanan gagal, menggunakan format lokal:', uploadErr);
        }
      }

      const itemToSave = {
        ...formData,
        image: finalImageUrl,
      };

      if (editingId === 'new') {
        const newItem = {
          ...itemToSave,
          id: `srv-${Date.now()}`,
        };
        const updated = [...serviceList, newItem];
        setServiceList(updated);
        updateServices(updated);
      } else {
        const updated = serviceList.map((item) =>
          item.id === editingId ? { ...item, ...itemToSave } : item
        );
        setServiceList(updated);
        updateServices(updated);
      }

      setEditingId(null);
      setStagedFile(null);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err) {
      console.error('Error saat menyimpan layanan:', err);
      alert('Terjadi kesalahan saat menyimpan layanan.');
    } finally {
      setIsSaving(false);
    }
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

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#002884]">
            Kelola Katalog Layanan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tambah, edit deskripsi, estimasi biaya, atau upload foto layanan bengkel yang tampil di website.
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
            className="px-4 py-2 bg-[#E3000F] hover:bg-[#C2000D] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Tambah Layanan Baru</span>
          </button>
        </div>
      </div>

      {/* Editing Form Modal / Inline */}
      {editingId && (
        <div className="mb-8 p-6 bg-slate-50 rounded-2xl border-2 border-[#002884]/30 shadow-inner">
          <h3 className="text-base font-bold text-[#002884] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">
              {editingId === 'new' ? 'add_circle' : 'edit_document'}
            </span>
            <span>{editingId === 'new' ? 'Tambah Layanan Baru' : `Edit: ${formData.title}`}</span>
          </h3>

          <form onSubmit={handleSaveItem} className="space-y-4">
            
            {/* Upload Foto Layanan */}
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Foto / Banner Layanan
              </label>

              <div className="flex flex-col md:flex-row gap-5 items-start">
                {/* Preview Box */}
                <div className="w-full md:w-44 h-32 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200 relative group flex items-center justify-center shrink-0 shadow-xs">
                  {isProcessingImage ? (
                    <div className="flex flex-col items-center gap-1 text-slate-500">
                      <span className="material-symbols-outlined animate-spin text-2xl">sync</span>
                      <span className="text-[11px] font-semibold">Mengompres...</span>
                    </div>
                  ) : formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-slate-400">image</span>
                  )}
                </div>

                {/* Dropzone & Action Buttons */}
                <div className="flex-1 w-full space-y-3">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-slate-300 hover:border-[#002884] rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/40"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <div className="flex items-center justify-center gap-2 text-[#002884] font-bold text-xs sm:text-sm">
                      <span className="material-symbols-outlined text-lg">cloud_upload</span>
                      <span>Klik untuk Unggah Foto dari Komputer</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Atau seret &amp; letakkan file gambar ke sini (JPG, PNG, WEBP otomatis dikompres)
                    </p>
                  </div>

                  {/* Preset Stock Images */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase">
                      Atau Pilih Foto Preset Resmi:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_SERVICE_IMAGES.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => {
                            setStagedFile(null);
                            setFormData((prev) => ({ ...prev, image: preset.url }));
                          }}
                          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors border ${
                            formData.image === preset.url
                              ? 'bg-[#002884] text-white border-[#002884]'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Layanan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Ganti Aki Mobil GS Astra"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
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
                  placeholder="Contoh: Gratis Pasang & Cek 24 Poin"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Estimasi Biaya <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.priceEstimate}
                  onChange={(e) => setFormData({ ...formData, priceEstimate: e.target.value })}
                  placeholder="Contoh: Mulai Rp 150.000 atau Gratis Pasang"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-[#002884]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pesan WhatsApp Otomatis (Saat Pengunjung Klik Konsultasi)
                </label>
                <input
                  type="text"
                  value={formData.waMessage}
                  onChange={(e) => setFormData({ ...formData, waMessage: e.target.value })}
                  placeholder="Halo Shop & Drive Pondok Labu, saya ingin booking layanan ini..."
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Deskripsi Layanan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="2"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jelaskan pengerjaan teknisi, garansi resmi, dan manfaat servis bagi kendaraan pelanggan."
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving || isProcessingImage}
                className="px-5 py-2.5 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSaving ? 'sync' : 'save'}
                </span>
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Layanan'}</span>
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors"
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
              <th className="py-3 px-4">Estimasi Biaya</th>
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
                <td className="py-3 px-4 font-extrabold text-[#002884]">
                  {srv.priceEstimate}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-blue-50 text-[#002884] border border-blue-200">
                    {srv.badge || '-'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => startEdit(srv)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Layanan"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(srv.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Layanan"
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
