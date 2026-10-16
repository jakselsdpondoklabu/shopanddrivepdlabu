import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function AdminLogin({ onClose, onSuccess }) {
  const { login } = useSiteData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = login(username, password);
    if (res.success) {
      if (onSuccess) onSuccess();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E3000F] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#002884]">
              Portal Admin Workshop
            </h2>
            <p className="text-xs text-slate-500">
              Super Shop &amp; Drive Ampera
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-[#E3000F] text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              ID Pengguna
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan ID Pengguna"
                required
                autoComplete="off"
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
              />
              <span className="material-symbols-outlined absolute right-3.5 top-3 text-slate-400 text-lg">
                person
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="off"
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002884]"
              />
              <span className="material-symbols-outlined absolute right-3.5 top-3 text-slate-400 text-lg">
                lock
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-6"
          >
            <span className="material-symbols-outlined text-lg">login</span>
            <span>Masuk ke Dashboard</span>
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Akses terbatas staf internal Super Shop &amp; Drive Cabang Ampera
        </div>

      </div>
    </div>
  );
}
