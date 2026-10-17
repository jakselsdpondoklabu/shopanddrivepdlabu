import React, { useState, useRef } from 'react';
import { useSiteData } from '../../context/SiteDataContext';

// Default workshop assets available out of the box
const DEFAULT_PRESET_IMAGES = [
  { id: 'preset-bg1', label: 'Foto Bengkel (bg1)', path: '/Assets/bg1.jpeg', category: 'Hero & Bengkel' },
  { id: 'preset-bg2', label: 'Armada Motor Delivery (bg2)', path: '/Assets/bg2.jpg', category: 'Armada & Ban' },
  { id: 'preset-bg3', label: 'Penggantian Suku Cadang (bg3)', path: '/Assets/bg3.jpg', category: 'Suspensi & Servis' },
  { id: 'preset-aki', label: 'Servis & Ganti Aki Mobil', path: '/Assets/ganti aki.jpg', category: 'Aki Mobil' },
  { id: 'preset-oli', label: 'Servis Ganti Oli Mesin', path: '/Assets/ganti oli.webp', category: 'Oli Mesin' },
  { id: 'preset-logo', label: 'Logo Resmi Shop & Drive', path: '/Assets/logo.png', category: 'Identitas Brand' },
];

/**
 * Compresses an image file client-side using HTML5 Canvas to keep storage lightweight.
 */
function compressImage(file, maxWidth = 1000, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG/WebP compressed Data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export function ImageUploader({
  value,
  onChange,
  label = 'Pilih / Unggah Gambar',
  aspectRatioLabel = 'Rasio Bebas (Disarankan 16:9 atau 4:3)',
}) {
  const { content, addUploadedImage } = useSiteData();
  const uploadedList = content?.uploadedImages || [];

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'gallery' | 'url'
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const allGalleryImages = [
    ...uploadedList.map((img) => ({
      id: img.id,
      label: img.label || 'Foto Unggahan Admin',
      path: img.path || img.dataUrl,
      category: 'Unggahan Admin',
      isCustom: true,
    })),
    ...DEFAULT_PRESET_IMAGES,
  ];

  const handleFileProcess = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('File yang dipilih harus berupa gambar (JPG, PNG, WebP).');
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);

    try {
      // Auto compress to light JPEG data URL
      const compressedDataUrl = await compressImage(file, 1200, 0.82);

      // Save to global site gallery if helper exists
      if (addUploadedImage) {
        addUploadedImage(compressedDataUrl, file.name);
      }

      // Propagate value up
      onChange(compressedDataUrl);
    } catch {
      setErrorMsg('Gagal memproses gambar. Silakan coba file lain.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-[11px] text-slate-400 font-medium">
          {aspectRatioLabel}
        </span>
      </div>

      {/* Active Selected Image Preview Box */}
      {value ? (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-20 h-16 rounded-xl bg-slate-200 overflow-hidden border border-slate-300 shrink-0 shadow-xs">
              <img
                src={value}
                alt="Pratinjau"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/Assets/bg1.jpeg';
                }}
              />
            </div>
            <div className="truncate max-w-xs">
              <span className="text-xs font-bold text-slate-800 block truncate">
                {value.startsWith('data:') ? 'Foto Terunggah (Tersimpan Lokal)' : value}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Gambar Aktif Terpasang</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-[#002884] font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">upload</span>
              <span>Ganti Foto</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Hapus Gambar"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Source Method Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-white text-[#002884] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
          <span>Upload dari File</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'gallery'
              ? 'bg-white text-[#002884] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">photo_library</span>
          <span>Pilih dari Galeri</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'url'
              ? 'bg-white text-[#002884] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">link</span>
          <span>Input URL</span>
        </button>
      </div>

      {/* Tab 1: Upload from local device with auto-compression */}
      {activeTab === 'upload' && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[#002884] bg-blue-50/60 scale-[1.01]'
              : 'border-slate-300 hover:border-[#002884] bg-slate-50/60 hover:bg-white'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#002884] flex items-center justify-center shadow-sm border border-slate-200">
              {isProcessing ? (
                <span className="material-symbols-outlined text-2xl animate-spin">
                  progress_activity
                </span>
              ) : (
                <span className="material-symbols-outlined text-2xl">
                  add_photo_alternate
                </span>
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                {isProcessing ? 'Mengompresi & Memproses Gambar...' : 'Klik untuk Pilih Gambar atau Tarik ke Sini'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Mendukung JPG, PNG, atau WebP (otomatis dioptimalkan agar ringan)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Gallery Picker */}
      {activeTab === 'gallery' && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-600 block mb-3">
            Pilih gambar dari koleksi aset resmi:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-h-56 overflow-y-auto pr-1">
            {allGalleryImages.map((img) => (
              <div
                key={img.id}
                onClick={() => onChange(img.path)}
                className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all p-1.5 bg-white ${
                  value === img.path
                    ? 'border-[#E3000F] ring-2 ring-red-100 shadow-md'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-100 mb-1.5">
                  <img src={img.path} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 block truncate" title={img.label}>
                  {img.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Direct URL Input */}
      {activeTab === 'url' && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://domain.com/foto-produk.jpg atau /Assets/..."
            className="flex-1 h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#002884]"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-xs rounded-xl transition-colors shrink-0"
          >
            Terapkan URL
          </button>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>
      )}
    </div>
  );
}
