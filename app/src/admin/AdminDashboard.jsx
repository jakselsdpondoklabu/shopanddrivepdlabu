import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { isSupabaseConfigured, saveRemoteSiteContent } from '../lib/supabaseClient';
import { TokoEditor } from './TokoEditor';
import { AntreanEditor } from './AntreanEditor';
import { HeroEditor } from './HeroEditor';
import { LayananEditor } from './LayananEditor';
import { ProdukEditor } from './ProdukEditor';
import { PromoEditor } from './PromoEditor';
import { TestimoniEditor } from './TestimoniEditor';

export function AdminDashboard({ onBackToSite }) {
  const { content, resetToDefault, logout } = useSiteData();
  const { brand } = content;
  const [activeTab, setActiveTab] = useState('antrean');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const success = await saveRemoteSiteContent(content);
      if (success) {
        alert('Berhasil! Seluruh data website telah tersimpan di Supabase Cloud Database. Perubahan sekarang langsung tampil di komputer, laptop, dan HP lain.');
      } else {
        alert('Gagal menyimpan ke cloud. Periksa koneksi internet Anda.');
      }
    } catch (err) {
      alert('Terjadi kesalahan sinkronisasi: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const pendingCount = (content?.bookings || []).filter((b) => b.status === 'Menunggu').length;

  const tabs = [
    { id: 'antrean', label: 'Antrean & Jadwal Servis', icon: 'calendar_month', badge: pendingCount > 0 ? pendingCount : null },
    { id: 'hero', label: '5 Hero Banner Carousel', icon: 'view_carousel' },
    { id: 'toko', label: 'Status & Jam Toko', icon: 'schedule' },
    { id: 'layanan', label: 'Katalog Layanan Bengkel', icon: 'build' },
    { id: 'produk', label: 'Katalog Produk & Suku Cadang', icon: 'shopping_bag' },
    { id: 'promo', label: 'Promo & Diskon', icon: 'local_offer' },
    { id: 'testimoni', label: 'Testimoni Pelanggan', icon: 'reviews' },
  ];

  const handleReset = () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mereset semua konten ke data bawaan default Super Shop & Drive Ampera?')) {
      resetToDefault();
      alert('Data website telah berhasil di-reset ke default.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800">
      
      {/* Admin Top Header */}
      <header className="bg-[#0B132B] text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-md">
              <img
                src={brand.logoUrl || '/Assets/logo.png'}
                alt="Logo"
                className="h-8 w-auto object-contain rounded"
              />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight block leading-tight">
                Dashboard Manajemen Cabang
              </span>
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
                Super Shop &amp; Drive Ampera
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status Indikator Supabase Multi-Device */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Cloud Sync Aktif</span>
            </div>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 active:scale-[0.98]"
              title="Sinkronkan data saat ini ke Supabase Cloud agar muncul di semua komputer"
            >
              <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>
                cloud_sync
              </span>
              <span className="hidden sm:inline">{isSyncing ? 'Menyimpan...' : 'Simpan ke Cloud'}</span>
            </button>

            <button
              onClick={onBackToSite}
              className="px-3.5 py-2 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              title="Kembali ke Tampilan Website"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span className="hidden sm:inline">Lihat Website</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1"
              title="Reset ke Data Bawaan"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span className="hidden md:inline">Reset Default</span>
            </button>

            <button
              onClick={logout}
              className="px-3 py-2 bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1"
              title="Keluar dari Admin"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all shadow-xs ${
                activeTab === tab.id
                  ? 'bg-[#002884] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#E3000F] text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Active Content Panel */}
        <div className="transition-all duration-200">
          {activeTab === 'antrean' && <AntreanEditor />}
          {activeTab === 'hero' && <HeroEditor />}
          {activeTab === 'toko' && <TokoEditor />}
          {activeTab === 'layanan' && <LayananEditor />}
          {activeTab === 'produk' && <ProdukEditor />}
          {activeTab === 'promo' && <PromoEditor />}
          {activeTab === 'testimoni' && <TestimoniEditor />}
        </div>

      </div>

    </div>
  );
}
