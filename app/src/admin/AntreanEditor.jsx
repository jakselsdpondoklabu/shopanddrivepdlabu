import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export function AntreanEditor() {
  const { content, updateBookingStatus, deleteBooking, addBooking, updateGowaConfig, sendBookingToGowa } = useSiteData();
  const bookings = content?.bookings || [];
  const services = content?.services || [];
  const gowaConfig = content?.gowa || {
    apiUrl: 'https://gowa590.ssdampera.web.id',
    targetGroupJid: '120363417372591982@g.us',
    targetGroupName: '🔥 SHOP&DRIVE PONDOK LABU 🔥',
    isEnabled: true,
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGowaModal, setShowGowaModal] = useState(false);
  const [isTestingGowa, setIsTestingGowa] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // New manual entry modal state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCarModel, setNewCarModel] = useState('');
  const [newServiceNeed, setNewServiceNeed] = useState(() => services?.[0]?.title || 'Jasa Ganti Aki Mobil');
  const [newServiceDate, setNewServiceDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) {
      alert('Nama dan nomor HP wajib diisi.');
      return;
    }
    const bookingEntry = {
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      carModel: newCarModel.trim() || 'Tidak disebutkan',
      serviceNeed: newServiceNeed,
      serviceDate: newServiceDate,
      createdAt: new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    addBooking(bookingEntry);
    if (sendBookingToGowa) {
      await sendBookingToGowa(bookingEntry);
    }
    setNewCustName('');
    setNewCustPhone('');
    setNewCarModel('');
    setShowAddModal(false);
  };

  const handleTestGowa = async () => {
    setIsTestingGowa(true);
    setTestResult(null);
    try {
      const res = await sendBookingToGowa({
        name: 'Tes Otomatis Sistem',
        phone: '08123456789',
        carModel: 'Toyota Kijang Innova Zenix',
        serviceNeed: 'Uji Coba Integrasi API GOWA ke Grup WA',
        serviceDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toLocaleTimeString('id-ID'),
      });
      if (res.success) {
        setTestResult({ success: true, message: 'Pesan tes berhasil dikirim ke grup WhatsApp!' });
      } else {
        setTestResult({ success: false, message: 'Gagal mengirim: ' + (res.error?.message || 'Cek koneksi API GOWA') });
      }
    } catch (err) {
      setTestResult({ success: false, message: 'Error: ' + err.message });
    } finally {
      setIsTestingGowa(false);
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.carModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceNeed.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesService =
      serviceFilter === 'all' ||
      b.serviceNeed.toLowerCase() === serviceFilter.toLowerCase() ||
      b.serviceNeed.toLowerCase().includes(serviceFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesService;
  });

  const totalMenunggu = bookings.filter((b) => b.status === 'Menunggu').length;
  const totalDikonfirmasi = bookings.filter((b) => b.status === 'Dikonfirmasi').length;
  const totalSelesai = bookings.filter((b) => b.status === 'Selesai').length;

  const handleWhatsAppChat = (booking) => {
    const cleanPhone = booking.phone.replace(/[^0-9]/g, '');
    let formattedPhone = cleanPhone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1);
    }
    const message = `Halo Bapak/Ibu ${booking.name},\nKami dari Shop & Drive Pondok Labu mengonfirmasi reservasi servis mobil ${booking.carModel} untuk kebutuhan ${booking.serviceNeed} pada tanggal ${booking.serviceDate}.\nSlot montir telah kami jadwalkan. Apakah ada hal lain yang ingin dikonsultasikan? Terima kasih.`;
    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Hapus data reservasi atas nama ${name}?`)) {
      deleteBooking(id);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#002884]">
              calendar_month
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#002884] tracking-tight">
              Tabel Antrean &amp; Jadwal Servis
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data reservasi yang masuk langsung dari formulir Cek Antrean &amp; Jadwal di halaman utama website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGowaModal(true)}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5"
            title="Pengaturan Integrasi API GOWA WhatsApp"
          >
            <span className="material-symbols-outlined text-lg text-emerald-600">settings</span>
            <span className="hidden sm:inline">Pengaturan Grup WA</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 shadow-xs shrink-0"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Tambah Antrean Manual</span>
          </button>
        </div>
      </div>

      {/* GOWA WhatsApp Gateway Status Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-50 to-blue-500/10 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-xl">hub</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                GOWA WhatsApp Gateway API
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Terhubung</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Target Grup: <strong className="text-slate-900">{gowaConfig.targetGroupName || gowaConfig.targetGroupJid}</strong> ({gowaConfig.targetGroupJid})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isTestingGowa}
            onClick={handleTestGowa}
            className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-300 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            {isTestingGowa ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                <span>Mengirim Tes...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">outgoing_mail</span>
                <span>Kirim Pesan Tes ke Grup</span>
              </>
            )}
          </button>
        </div>
      </div>

      {testResult && (
        <div className={`mb-6 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
          testResult.success
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
            : 'bg-red-50 text-red-800 border border-red-300'
        }`}>
          <span className="material-symbols-outlined text-base">
            {testResult.success ? 'check_circle' : 'error'}
          </span>
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Antrean
          </span>
          <span className="text-2xl font-black text-slate-900">{bookings.length}</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
            Menunggu Konfirmasi
          </span>
          <span className="text-2xl font-black text-amber-700">{totalMenunggu}</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
            Dikonfirmasi
          </span>
          <span className="text-2xl font-black text-blue-700">{totalDikonfirmasi}</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            Selesai Servis
          </span>
          <span className="text-2xl font-black text-emerald-700">{totalSelesai}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, no hp, merk mobil..."
              className="w-full h-10 pl-9 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#002884] focus:bg-white"
            />
          </div>

          {/* Service Filter Dropdown matching Workshop Services */}
          <div className="relative w-full sm:w-auto">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full sm:w-auto h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#002884]"
            >
              <option value="all">Semua Layanan Bengkel</option>
              {services.map((srv) => (
                <option key={srv.id} value={srv.title}>
                  {srv.title}
                </option>
              ))}
              <option value="Lainnya">Lainnya / Konsultasi</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['all', 'Menunggu', 'Dikonfirmasi', 'Selesai', 'Batal'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#002884] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table (Compact 40% Density) */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-2 px-2.5">No</th>
              <th className="py-2 px-2.5">Nama Pelanggan</th>
              <th className="py-2 px-2.5">No. HP / WA</th>
              <th className="py-2 px-2.5">Merk &amp; Tipe Mobil</th>
              <th className="py-2 px-2.5">Kebutuhan Servis</th>
              <th className="py-2 px-2.5">Rencana Tanggal</th>
              <th className="py-2 px-2.5">Status</th>
              <th className="py-2 px-2.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b, idx) => (
                <tr key={b.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-2.5 font-bold text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-2.5">
                    <span className="font-bold text-slate-900 block leading-tight">{b.name}</span>
                    <span className="text-[10px] text-slate-400">{b.createdAt || 'Hari ini'}</span>
                  </td>
                  <td className="py-2 px-2.5">
                    <a
                      href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <span className="material-symbols-outlined text-[13px]">chat</span>
                      <span>{b.phone}</span>
                    </a>
                  </td>
                  <td className="py-2 px-2.5">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {b.carModel}
                    </span>
                  </td>
                  <td className="py-2 px-2.5 text-slate-700 font-medium text-xs">
                    {b.serviceNeed}
                  </td>
                  <td className="py-2 px-2.5 text-slate-800 font-semibold whitespace-nowrap text-xs">
                    {b.serviceDate}
                  </td>
                  <td className="py-2 px-2.5">
                    <select
                      value={b.status || 'Menunggu'}
                      onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                      className={`h-7 px-2 rounded-md text-[11px] font-bold border cursor-pointer focus:outline-none ${
                        b.status === 'Dikonfirmasi'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : b.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : b.status === 'Batal'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Dikonfirmasi">Dikonfirmasi</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Batal">Batal</option>
                    </select>
                  </td>
                  <td className="py-2 px-2.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppChat(b)}
                        className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                        title="Chat Pelanggan di WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[15px]">send</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id, b.name)}
                        className="p-1 rounded bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                        title="Hapus Reservasi"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-10 text-center text-slate-400">
                  <span className="material-symbols-outlined text-3xl block mb-2 text-slate-300">
                    event_busy
                  </span>
                  <span>Belum ada data antrean atau jadwal yang cocok dengan filter.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Add Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#002884]">
                Tambah Antrean Servis Manual
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Nama Pelanggan
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="Nama pemilik mobil"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Merk &amp; Tipe Mobil
                </label>
                <input
                  type="text"
                  required
                  value={newCarModel}
                  onChange={(e) => setNewCarModel(e.target.value)}
                  placeholder="Contoh: Toyota Avanza 2019"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Kebutuhan Servis
                  </label>
                  <select
                    value={newServiceNeed}
                    onChange={(e) => setNewServiceNeed(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#002884]"
                  >
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.title}>
                        {srv.title}
                      </option>
                    ))}
                    <option value="Konsultasi & Pengecekan Servis Lainnya">
                      Konsultasi &amp; Pengecekan Servis Lainnya
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Rencana Tanggal
                  </label>
                  <input
                    type="date"
                    value={newServiceDate}
                    onChange={(e) => setNewServiceDate(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Simpan Antrean
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GOWA Settings Modal */}
      {showGowaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-[#25D366]">hub</span>
                <h3 className="text-lg font-bold text-[#002884]">
                  Pengaturan Gateway GOWA WhatsApp
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGowaModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowGowaModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  URL Endpoint API GOWA
                </label>
                <input
                  type="text"
                  value={gowaConfig.apiUrl || ''}
                  onChange={(e) => updateGowaConfig({ apiUrl: e.target.value.trim() })}
                  placeholder="https://gowa590.ssdampera.web.id"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Tanpa API key sesuai konfigurasi server GOWA Anda.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Pilih Grup WhatsApp Tujuan
                </label>
                <select
                  value={gowaConfig.targetGroupJid || '120363417372591982@g.us'}
                  onChange={(e) => {
                    const jid = e.target.value;
                    const name =
                      jid === '120363417372591982@g.us'
                        ? '🔥 SHOP&DRIVE PONDOK LABU 🔥'
                        : jid === '120363371245308279@g.us'
                        ? 'Pondok Labu Squad (0285)'
                        : 'Grup WhatsApp Kustom';
                    updateGowaConfig({ targetGroupJid: jid, targetGroupName: name });
                  }}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm cursor-pointer"
                >
                  <option value="120363417372591982@g.us">
                    🔥 SHOP&amp;DRIVE PONDOK LABU 🔥 (Grup WhatsApp Utama)
                  </option>
                  <option value="120363371245308279@g.us">
                    Pondok Labu Squad (0285)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  ID JID Grup Kustom
                </label>
                <input
                  type="text"
                  value={gowaConfig.targetGroupJid || ''}
                  onChange={(e) => updateGowaConfig({ targetGroupJid: e.target.value.trim() })}
                  placeholder="120363xxxxxxxxx@g.us"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gowaConfig.isEnabled !== false}
                    onChange={(e) => updateGowaConfig({ isEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-[#002884] focus:ring-[#002884]"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    Aktifkan Pengiriman Otomatis ke Grup saat Form Diisi Customer
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGowaModal(false)}
                  className="px-5 py-2.5 bg-[#002884] hover:bg-[#001C5D] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Selesai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
