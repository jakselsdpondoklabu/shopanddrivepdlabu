import React, { useState, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { uploadProductPhoto, compressImage } from '../lib/supabaseClient';

const PRESET_ARTICLE_IMAGES = [
  { label: 'Tips Aki Mobil', url: '/Assets/ganti aki.jpg' },
  { label: 'Perawatan Oli Mesin', url: '/Assets/ganti oli.webp' },
  { label: 'Kaki-kaki & Suspensi', url: '/Assets/shock-kyb.jpg' },
  { label: 'Spooring & Ban', url: '/Assets/spooring.webp' },
  { label: 'Pengereman Mobil', url: '/Assets/bg3.jpg' },
  { label: 'Servis Bengkel Pondok Labu', url: '/Assets/bg1.jpeg' },
];

export function EdukasiEditor() {
  const { content, updateArticles } = useSiteData();
  const articles = content?.promo?.articles || [];

  const [articleList, setArticleList] = useState(articles);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tips Aki',
    readTime: '5 Menit Baca',
    image: '/Assets/ganti aki.jpg',
    summary: '',
    content: '',
    technicianRecommendation: '',
    waTopic: '',
  });

  const [stagedFile, setStagedFile] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const fileInputRef = useRef(null);

  const startEdit = (art) => {
    setEditingId(art.id);
    setStagedFile(null);
    setFormData({
      ...art,
      image: art.image || '/Assets/ganti aki.jpg',
      category: art.category || 'Tips Otomotif',
      readTime: art.readTime || '5 Menit Baca',
      summary: art.summary || '',
      content: art.content || '',
      technicianRecommendation: art.technicianRecommendation || '',
      waTopic: art.waTopic || '',
    });
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
      category: 'Tips Otomotif',
      readTime: '4 Menit Baca',
      image: '/Assets/ganti aki.jpg',
      summary: '',
      content: '',
      technicianRecommendation:
        'Jika Anda merasa ada yang janggal pada tarikan mesin, kelistrikan, atau bantingan mobil, bawa mobil Anda langsung ke bengkel kami di Jl. RS Fatmawati Raya (Pondok Labu). Teknisi kami menyediakan layanan uji aki digital & cek kelayakan pelumas secara gratis dengan alat diagnostik akurat standar Astra Otoparts.',
      waTopic: 'Halo Shop & Drive Pondok Labu, saya ingin konsultasi perawatan mobil',
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
      console.error('Error memproses gambar artikel:', err);
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
        console.error('Error memproses drop gambar artikel:', err);
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
          console.warn('Upload cloud foto artikel gagal, menggunakan format lokal:', uploadErr);
        }
      }

      const itemToSave = {
        ...formData,
        image: finalImageUrl,
        date: 'Update Terbaru',
      };

      if (editingId === 'new') {
        const newItem = {
          ...itemToSave,
          id: `art-${Date.now()}`,
        };
        const updated = [...articleList, newItem];
        setArticleList(updated);
        updateArticles(updated);
      } else {
        const updated = articleList.map((item) =>
          item.id === editingId ? { ...item, ...itemToSave } : item
        );
        setArticleList(updated);
        updateArticles(updated);
      }

      setEditingId(null);
      setStagedFile(null);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err) {
      console.error('Error saat menyimpan artikel tips:', err);
      alert('Terjadi kesalahan saat menyimpan artikel tips.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus artikel edukasi ini?')) {
      const updated = articleList.filter((item) => item.id !== id);
      setArticleList(updated);
      updateArticles(updated);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#002884] flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#E3000F]">menu_book</span>
            <span>Kelola Edukasi &amp; Tips Otomotif</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tambah dan perbarui artikel tips perawatan mobil serta upload foto edukasi yang tampil di website.
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
            <span>Tambah Artikel Tips Baru</span>
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
            <span>{editingId === 'new' ? 'Tambah Artikel Edukasi Baru' : `Edit: ${formData.title}`}</span>
          </h3>

          <form onSubmit={handleSaveItem} className="space-y-4">
            
            {/* Upload Foto Artikel */}
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Foto / Thumbnail Artikel Tips
              </label>

              <div className="flex flex-col md:flex-row gap-5 items-start">
                {/* Preview Box */}
                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200 relative group flex items-center justify-center shrink-0 shadow-xs">
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
                      <span>Klik untuk Unggah Foto Artikel</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Atau seret &amp; letakkan file gambar (JPG, PNG, WEBP otomatis dikompres)
                    </p>
                  </div>

                  {/* Preset Stock Images */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase">
                      Atau Pilih Foto Preset:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_ARTICLE_IMAGES.map((preset) => (
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

            {/* Judul Artikel */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Judul Artikel Tips <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Kenali 5 Tanda Aki Mobil Mulai Lemah Sebelum Mogok"
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kategori Tips <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Tips Aki / Perawatan Oli / Kaki-kaki / Pengereman"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Estimasi Waktu Baca
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="Contoh: 5 Menit Baca"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Cuplikan / Ringkasan di Beranda Home <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="2"
                required
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Tuliskan rangkuman / cuplikan singkat (1-3 kalimat) yang tampil di kartu beranda website."
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm leading-relaxed"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Tampil sebagai teaser di Beranda sebelum pengunjung menekan tombol "Lihat Selengkapnya".
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Konten Lengkap Halaman Artikel (Full Article Detail)
                </label>
                <span className="text-[11px] font-bold text-[#002884] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Tampil Penuh di Halaman Tersendiri
                </span>
              </div>
              <textarea
                rows="9"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Tuliskan penjelasan detail panduan otomotif, poin-poin penyebab kerusakan, langkah perbaikan mandiri, serta tips teknisi. Boleh dipisahkan dengan enter/baris baru. Jika dikosongkan, sistem akan otomatis merender panduan standar terstruktur."
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm leading-relaxed font-sans"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Gunakan baris baru (Enter) antar paragraf untuk keterbacaan yang nyaman di HP dan komputer.
              </span>
            </div>

            {/* Slot Khusus: Rekomendasi Teknisi Shop & Drive Pondok Labu */}
            <div className="p-4 sm:p-5 bg-amber-50/80 rounded-2xl border border-amber-200/90 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="text-xs font-bold text-amber-950 uppercase flex items-center gap-1.5 tracking-wide">
                  <span className="material-symbols-outlined text-amber-600 text-lg">verified_user</span>
                  <span>Rekomendasi Teknisi Shop &amp; Drive Pondok Labu</span>
                </label>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300/80 w-fit">
                  Kotak Kuning Khusus Artikel
                </span>
              </div>

              <textarea
                rows="3"
                value={formData.technicianRecommendation}
                onChange={(e) => setFormData({ ...formData, technicianRecommendation: e.target.value })}
                placeholder="Tuliskan saran khusus, langkah antisipasi, atau peringatan penting dari teknisi Shop & Drive Pondok Labu untuk topik artikel ini..."
                className="w-full p-3 bg-white border border-amber-200 focus:border-amber-500 rounded-xl text-sm leading-relaxed text-amber-950 placeholder-amber-900/40 focus:outline-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-amber-200/60">
                <span className="text-[11px] text-amber-800">
                  Teks di atas akan tampil di dalam kotak kuning berikon perisai di bagian bawah artikel.
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      technicianRecommendation:
                        'Jika Anda merasa ada yang janggal pada tarikan mesin, kelistrikan, atau bantingan mobil, bawa mobil Anda langsung ke bengkel kami di Jl. RS Fatmawati Raya (Pondok Labu). Teknisi kami menyediakan layanan uji aki digital & cek kelayakan pelumas secara gratis dengan alat diagnostik akurat standar Astra Otoparts.',
                    }))
                  }
                  className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                  <span>Gunakan Teks Rekomendasi Standar</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Topik / Pesan WhatsApp Otomatis
              </label>
              <input
                type="text"
                value={formData.waTopic}
                onChange={(e) => setFormData({ ...formData, waTopic: e.target.value })}
                placeholder="Halo Shop & Drive Pondok Labu, saya ingin konsultasi mengenai..."
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
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
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Artikel Tips'}</span>
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

      {/* Articles Cards / Table List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articleList.map((art) => (
          <div
            key={art.id}
            className="bg-slate-50/70 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between p-4 hover:shadow-md transition-shadow"
          >
            <div>
              <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-200 border border-slate-200 mb-3 relative">
                <img
                  src={art.image || '/Assets/bg1.jpeg'}
                  alt={art.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                  {art.content && (
                    <span className="px-2 py-0.5 bg-emerald-600/95 text-white text-[10px] font-bold rounded shadow-xs">
                      Full Content
                    </span>
                  )}
                  {art.technicianRecommendation && (
                    <span className="px-2 py-0.5 bg-amber-600/95 text-white text-[10px] font-bold rounded shadow-xs flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[11px]">verified_user</span>
                      <span>Rekomendasi Teknisi</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="px-2 py-0.5 bg-white border border-slate-200 font-bold text-[#002884] rounded text-[10px] uppercase">
                  {art.category}
                </span>
                <span className="text-[11px] text-slate-400">{art.readTime}</span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm leading-snug mb-2 line-clamp-2">
                {art.title}
              </h4>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                {art.summary}
              </p>

              {art.technicianRecommendation && (
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200/70 mb-3 text-[11px] text-amber-950 leading-relaxed flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-amber-600 text-sm shrink-0 mt-0.5">verified_user</span>
                  <span className="line-clamp-2 font-medium">{art.technicianRecommendation}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <a
                href={`#/edukasi/${art.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                title="Buka halaman full artikel ini di tab baru"
              >
                <span>Lihat di Web</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(art)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Artikel"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(art.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Artikel"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
