import React, { useState, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import {
  uploadProductPhoto,
  compressImage,
  insertRemoteProduct,
  deleteRemoteProduct,
  isSupabaseConfigured,
} from '../lib/supabaseClient';

const PRESET_STOCK_IMAGES = [
  { label: 'Aki GS Astra', url: '/Assets/ganti aki.jpg' },
  { label: 'Oli Mesin', url: '/Assets/ganti oli.webp' },
  { label: 'Shock Absorber KYB', url: '/Assets/shock-kyb.jpg' },
  { label: 'Spooring & Ban', url: '/Assets/spooring.webp' },
  { label: 'Super Shop&Drive Banner', url: '/Assets/bg1.jpeg' },
];

export function ProdukEditor() {
  const { content, updateProducts, setSupabaseCredentials } = useSiteData();
  const { products } = content;

  const [productList, setProductList] = useState(products || []);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Aki Mobil',
    brandBadge: 'Astra Otoparts',
    badge: 'Garansi Resmi',
    image: '/Assets/bg1.jpeg',
    description: '',
    priceEstimate: 'Rp ',
    waMessage: '',
    showInBanner: false,
  });

  const [stagedFile, setStagedFile] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [showDbConfig, setShowDbConfig] = useState(false);
  const [dbUrlInput, setDbUrlInput] = useState('');
  const [dbKeyInput, setDbKeyInput] = useState('');

  const fileInputRef = useRef(null);

  const startEdit = (p) => {
    setEditingId(p.id);
    setStagedFile(null);
    setFormData({
      ...p,
      showInBanner: p.showInBanner ?? false,
    });
  };

  const startAdd = () => {
    setEditingId('new');
    setStagedFile(null);
    const currentFeaturedCount = productList.filter((p) => p.showInBanner).length;
    setFormData({
      name: '',
      category: 'Aki Mobil',
      brandBadge: 'Astra Otoparts',
      badge: 'Produk Baru',
      image: '/Assets/ganti aki.jpg',
      description: '',
      priceEstimate: 'Mulai Rp 500.000',
      waMessage: 'Halo Super Shop & Drive Ampera, saya ingin tanya produk ini',
      showInBanner: currentFeaturedCount < 5,
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      // Auto-compress photo in browser (~100KB JPEG)
      const { dataUrl } = await compressImage(file, 1200, 0.82);
      setStagedFile(file);
      // Immediately preview using compressed DataURL
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
        console.error('Error memproses gambar:', err);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const toggleBannerStatus = async (id) => {
    const target = productList.find((p) => p.id === id);
    if (!target) return;
    const currentFeaturedCount = productList.filter((p) => p.showInBanner).length;
    if (!target.showInBanner && currentFeaturedCount >= 5) {
      alert('Maksimal 5 produk yang dapat ditampilkan di Banner Preview Beranda. Silakan nonaktifkan salah satu produk yang sudah aktif terlebih dahulu.');
      return;
    }
    const updated = productList.map((item) =>
      item.id === id ? { ...item, showInBanner: !item.showInBanner } : item
    );
    setProductList(updated);
    updateProducts(updated);

    // Sync remote banner toggle
    const updatedTarget = updated.find((p) => p.id === id);
    if (updatedTarget && isSupabaseConfigured()) {
      insertRemoteProduct(updatedTarget);
    }

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalImageUrl = formData.image;

      // If user uploaded a new local file, upload to Supabase Storage if connected
      if (stagedFile) {
        try {
          const uploadResult = await uploadProductPhoto(stagedFile);
          if (uploadResult && uploadResult.url) {
            finalImageUrl = uploadResult.url;
          }
        } catch (uploadErr) {
          console.warn('Upload cloud gagal, menggunakan foto lokal yang sudah dikompres:', uploadErr);
        }
      }

      const itemToSave = {
        ...formData,
        image: finalImageUrl,
      };

      if (editingId === 'new') {
        const newItem = {
          ...itemToSave,
          id: `prod-${Date.now()}`,
        };
        const updated = [newItem, ...productList];
        setProductList(updated);
        updateProducts(updated);

        // Sync with Supabase Database if connected
        if (isSupabaseConfigured()) {
          insertRemoteProduct(newItem);
        }
      } else {
        const updated = productList.map((item) =>
          item.id === editingId ? { ...item, ...itemToSave } : item
        );
        setProductList(updated);
        updateProducts(updated);

        // Sync with Supabase Database if connected
        if (isSupabaseConfigured()) {
          insertRemoteProduct(itemToSave);
        }
      }

      setEditingId(null);
      setStagedFile(null);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err) {
      console.error('Error saat menyimpan produk:', err);
      alert('Terjadi kesalahan saat menyimpan produk.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini dari katalog?')) {
      const updated = productList.filter((item) => item.id !== id);
      setProductList(updated);
      updateProducts(updated);

      if (isSupabaseConfigured()) {
        deleteRemoteProduct(id);
      }

      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }
  };

  const handleSaveDbSettings = (e) => {
    e.preventDefault();
    if (dbUrlInput && dbKeyInput) {
      setSupabaseCredentials(dbUrlInput, dbKeyInput);
    }
  };

  const hasCloudDb = isSupabaseConfigured();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-[#002884]">
              Kelola Katalog Produk &amp; Suku Cadang
            </h2>
            {/* Status Cloud Database */}
            <span
              onClick={() => setShowDbConfig(!showDbConfig)}
              className={`cursor-pointer inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                hasCloudDb
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title="Klik untuk konfigurasi database Supabase"
            >
              <span className={`w-2 h-2 rounded-full ${hasCloudDb ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{hasCloudDb ? 'Database Cloud: Terhubung' : 'Penyimpanan: Offline / Lokal'}</span>
              <span className="material-symbols-outlined text-[14px]">settings</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tambah produk fisik (aki, oli, ban, shockbreaker), upload foto langsung dari HP/Laptop, dan sesuaikan 5 produk banner beranda.
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
            className="px-4 py-2.5 bg-[#E3000F] hover:bg-[#C2000D] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* Database Setup Collapsible Panel */}
      {showDbConfig && (
        <div className="mb-6 p-5 bg-gradient-to-r from-blue-50/80 to-slate-50 rounded-2xl border border-blue-200">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h4 className="text-sm font-bold text-[#002884] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg">database</span>
                <span>Pengaturan Database Cloud (Supabase PostgreSQL + Storage)</span>
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {hasCloudDb
                  ? 'Database cloud Supabase saat ini sudah terhubung dan aktif.'
                  : 'Situs saat ini berjalan dengan penyimpanan lokal browser yang aman. Masukkan kredensial Supabase Anda di bawah untuk mengaktifkan sinkronisasi multi-device otomatis.'}
              </p>
            </div>
            <button
              onClick={() => setShowDbConfig(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSaveDbSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={dbUrlInput}
                onChange={(e) => setDbUrlInput(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Supabase Anon Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={dbKeyInput}
                onChange={(e) => setDbKeyInput(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                File schema SQL siap pakai tersedia di folder <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">supabase/schema.sql</code>
              </span>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#002884] hover:bg-[#001C5D] text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Simpan &amp; Hubungkan Database
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Editing / Adding Form with Photo Uploader */}
      {editingId && (
        <div className="mb-8 p-6 bg-slate-50 rounded-2xl border-2 border-[#002884]/30 shadow-inner">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <h3 className="text-base font-bold text-[#002884] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#E3000F]">
                {editingId === 'new' ? 'add_shopping_cart' : 'edit_document'}
              </span>
              <span>{editingId === 'new' ? 'Tambah Produk Baru' : `Edit Produk: ${formData.name}`}</span>
            </h3>
            <button
              onClick={() => setEditingId(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold"
            >
              ✕ Tutup
            </button>
          </div>

          <form onSubmit={handleSaveItem} className="space-y-5">
            {/* 1. PHOTO UPLOADER SECTION (DIRECT UPLOAD FOR ADMIN) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Foto Produk <span className="text-[#E3000F]">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Upload foto langsung dari perangkat Anda (HP atau Laptop). Sistem akan mengompres foto secara otomatis agar website tetap cepat dimuat.
                  </p>
                </div>
                {stagedFile && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-md border border-blue-200">
                    Foto Baru Terpilih
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Image Preview Box */}
                <div className="md:col-span-4 flex flex-col items-center justify-center">
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 relative group flex items-center justify-center shadow-inner">
                    {formData.image ? (
                      <>
                        <img
                          src={formData.image}
                          alt="Preview Produk"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 bg-white text-slate-800 rounded-lg text-xs font-bold shadow hover:bg-slate-100 flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">cloud_upload</span>
                            <span>Ganti</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <span className="material-symbols-outlined text-4xl text-slate-300">image</span>
                        <p className="text-xs text-slate-400 mt-1">Belum ada foto</p>
                      </div>
                    )}
                    {isProcessingImage && (
                      <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#002884] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[11px] font-bold text-slate-700 mt-2">Mengompres foto...</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 text-center">
                    Ukuran foto optimal: Rasio 4:3 atau 1:1
                  </span>
                </div>

                {/* Upload & Preset Dropzone */}
                <div className="md:col-span-8 space-y-3">
                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 border-2 border-dashed border-[#002884]/30 hover:border-[#002884] bg-blue-50/40 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-all flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#002884]/10 text-[#002884] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">upload_file</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-[#002884] block">
                        Pilih Foto dari Komputer / HP
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Klik di sini atau seret (drag &amp; drop) foto produk (JPG, PNG, WEBP).
                      </span>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 bg-[#002884] text-white text-xs font-bold rounded-lg shrink-0 shadow-xs pointer-events-none"
                    >
                      Pilih File
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Stock Preset Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                      Atau gunakan template foto siap pakai:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_STOCK_IMAGES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, image: preset.url });
                            setStagedFile(null);
                          }}
                          className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                            formData.image === preset.url
                              ? 'bg-[#002884] text-white border-[#002884] font-bold shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual URL / Path Input (Optional Fallback) */}
                  <div className="pt-1">
                    <details className="text-xs text-slate-500">
                      <summary className="cursor-pointer hover:text-slate-800 font-medium">
                        Atau masukkan path / URL gambar manual
                      </summary>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => {
                          setFormData({ ...formData, image: e.target.value });
                          setStagedFile(null);
                        }}
                        placeholder="https://... atau /Assets/foto.jpg"
                        className="w-full h-8 px-3 mt-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </details>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PRODUCT DETAILS SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Produk <span className="text-[#E3000F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="cth: Aki GS Astra Maintenance Free NS40Z"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kategori Produk
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm cursor-pointer"
                >
                  <option value="Aki Mobil">Aki Mobil</option>
                  <option value="Oli Mesin">Oli Mesin</option>
                  <option value="Suspensi">Suspensi &amp; Shock Absorber</option>
                  <option value="Ban Mobil">Ban Mobil</option>
                  <option value="Suku Cadang">Suku Cadang / Filter</option>
                  <option value="Pengereman">Pengereman</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Merk / Brand Badge
                </label>
                <input
                  type="text"
                  value={formData.brandBadge}
                  onChange={(e) => setFormData({ ...formData, brandBadge: e.target.value })}
                  placeholder="GS Astra / Shell / KYB"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Estimasi Harga <span className="text-[#E3000F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.priceEstimate}
                  onChange={(e) => setFormData({ ...formData, priceEstimate: e.target.value })}
                  placeholder="Mulai Rp 750.000"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Badge Khusus (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Garansi 24 Bulan"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Deskripsi &amp; Spesifikasi Produk <span className="text-[#E3000F]">*</span>
              </label>
              <textarea
                rows="2"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Spesifikasi ukuran, peruntukan tipe mobil (Avanza, Xpander, Brio, dll.), garansi resmi."
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Pesan WhatsApp Otomatis (Saat Pengunjung Klik Beli)
              </label>
              <input
                type="text"
                value={formData.waMessage}
                onChange={(e) => setFormData({ ...formData, waMessage: e.target.value })}
                placeholder="Halo Super Shop & Drive Ampera, saya ingin pesan produk ini..."
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm"
              />
            </div>

            {/* Checkbox Tampilkan di Banner Preview Beranda */}
            <div className="flex items-center gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200">
              <input
                type="checkbox"
                id="showInBannerCheckbox"
                checked={formData.showInBanner || false}
                onChange={(e) => {
                  const currentFeaturedCount = productList.filter((p) => p.showInBanner && p.id !== editingId).length;
                  if (e.target.checked && currentFeaturedCount >= 5) {
                    alert('Maksimal 5 produk yang dapat ditampilkan di banner beranda. Nonaktifkan salah satu produk yang sudah aktif terlebih dahulu.');
                    return;
                  }
                  setFormData({ ...formData, showInBanner: e.target.checked });
                }}
                className="w-4 h-4 text-[#002884] rounded border-slate-300 focus:ring-[#002884] cursor-pointer"
              />
              <label htmlFor="showInBannerCheckbox" className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-600 text-[18px]">star</span>
                <span>Tampilkan produk ini di Banner Preview Beranda (Maksimal 5 Produk)</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">save</span>
                    <span>Simpan Produk</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setStagedFile(null);
                }}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs sm:text-sm rounded-xl"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banner Preview Setting Status Bar */}
      <div className="mb-6 p-4 bg-amber-50/80 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-xl">view_carousel</span>
          </div>
          <div>
            <span className="text-xs font-bold text-amber-950 block">
              Pengaturan 5 Produk Banner Preview di Beranda
            </span>
            <span className="text-xs text-amber-800">
              Klik tombol bintang di kolom tabel untuk memilih produk yang ditampilkan di bawah Layanan Bengkel.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            productList.filter((p) => p.showInBanner).length === 5
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-600 text-white'
          }`}>
            {productList.filter((p) => p.showInBanner).length} / 5 Produk Terpilih
          </span>
        </div>
      </div>

      {/* Products Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Foto</th>
              <th className="py-3 px-4">Nama Produk</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Merk</th>
              <th className="py-3 px-4">Estimasi Harga</th>
              <th className="py-3 px-4 text-center">Banner Beranda</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {productList.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="w-14 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="py-3 px-4 font-bold text-slate-900">
                  {prod.name}
                  <p className="text-xs font-normal text-slate-500 line-clamp-1">{prod.description}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-blue-50 text-[#002884] border border-blue-200">
                    {prod.category}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-600">
                  {prod.brandBadge || '-'}
                </td>
                <td className="py-3 px-4 font-extrabold text-[#002884]">
                  {prod.priceEstimate}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => toggleBannerStatus(prod.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                      prod.showInBanner
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs hover:bg-amber-200'
                        : 'bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                    title={prod.showInBanner ? 'Klik untuk batal tampilkan di banner' : 'Klik untuk tampilkan di banner'}
                  >
                    <span className={`material-symbols-outlined text-[16px] ${prod.showInBanner ? 'text-amber-600' : 'text-slate-400'}`}>
                      {prod.showInBanner ? 'star' : 'star_border'}
                    </span>
                    <span>{prod.showInBanner ? 'Tampil (Top 5)' : 'Tidak Tampil'}</span>
                  </button>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => startEdit(prod)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Produk"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Produk"
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
