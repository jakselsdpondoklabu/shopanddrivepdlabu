import React, { useState, useEffect } from 'react';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { LayananGrid } from './components/LayananGrid';
import { ProdukPreviewBanner } from './components/ProdukPreviewBanner';
import { PromoSection } from './components/PromoSection';
import { ProdukPage } from './components/ProdukPage';
import { TestimoniSection } from './components/TestimoniSection';
import { LokasiMaps } from './components/LokasiMaps';
import { Footer } from './components/Footer';
import { FloatingAction } from './components/FloatingAction';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';

function MainApp() {
  const { isAdminLoggedIn } = useSiteData();
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isProdukRoute, setIsProdukRoute] = useState(false);

  // Check route on mount and when popstate / hash changes
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const isRouteAdmin = path === '/admin' || path === '/admin/' || hash === '#admin' || hash === '#/admin';
      const isRouteProduk = path === '/produk' || path === '/produk/' || hash === '#produk' || hash === '#/produk';
      
      setIsAdminRoute(isRouteAdmin);
      setIsProdukRoute(isRouteProduk);

      // If switching to home with anchor hash (e.g., #layanan, #promo, #lokasi), scroll smoothly
      if (!isRouteAdmin && !isRouteProduk && hash && hash !== '#' && hash !== '#/') {
        const id = hash.replace('#/', '').replace('#', '');
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const handleBackToSite = () => {
    if (window.history.pushState) {
      window.history.pushState(null, '', '/');
    } else {
      window.location.hash = '';
    }
    setIsAdminRoute(false);
    setIsProdukRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. If URL is /admin or #admin
  if (isAdminRoute) {
    if (isAdminLoggedIn) {
      return <AdminDashboard onBackToSite={handleBackToSite} />;
    } else {
      return (
        <div className="w-full min-h-screen bg-slate-900 flex flex-col justify-between">
          <Navbar />
          <AdminLogin
            onClose={handleBackToSite}
            onSuccess={() => setIsAdminRoute(true)}
          />
          <Footer />
        </div>
      );
    }
  }

  // 2. If URL is /produk or #/produk (Dedicated Tempat Sendiri untuk Produk)
  if (isProdukRoute) {
    return <ProdukPage onBackToHome={handleBackToSite} />;
  }

  // 3. Public Landing Page (Layanan Bengkel & Promo di Bawah Hero Banner)
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Navigation Header */}
      <Navbar activePage="home" />

      {/* Main Sections */}
      <main className="flex-1 w-full">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Revisi 1: Banner Promo Diletakkan Tepat di Bawah Hero Banner */}
        <PromoSection />

        {/* Revisi 2: Layanan Bengkel (Jasa) Khusus 7 Menu Andalan */}
        <LayananGrid />

        {/* Banner Preview 5 Produk Pilihan di Bawah Layanan (Diatur di Admin) */}
        <ProdukPreviewBanner />

        {/* Testimoni Pelanggan */}
        <TestimoniSection />

        {/* Lokasi & Peta Bengkel */}
        <LokasiMaps />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Cluster */}
      <FloatingAction />
    </div>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <MainApp />
    </SiteDataProvider>
  );
}
