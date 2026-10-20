import React, { useState, useEffect, useCallback } from 'react';
import { SiteDataContext } from './SiteDataContextObject';
import { defaultSiteContent } from '../data/defaultContent';
import { fetchRemoteProducts, fetchRemoteSiteContent, saveRemoteSiteContent, isSupabaseConfigured } from '../lib/supabaseClient';

const STORAGE_KEY = 'ssdampera_site_content_v2';
const AUTH_KEY = 'ssdampera_admin_authenticated';


export function SiteDataProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new structures (hero.banners, bookings, products, storeStatus) exist
        const hero = {
          ...defaultSiteContent.hero,
          ...(parsed.hero || {}),
          banners: parsed.hero?.banners && parsed.hero.banners.length > 0
            ? parsed.hero.banners
            : defaultSiteContent.hero.banners,
        };

        const brand = {
          ...defaultSiteContent.brand,
          ...(parsed.brand || {}),
          subName: (parsed.brand?.subName && parsed.brand.subName.toUpperCase().includes('WORKSHOP'))
            ? 'AMPERA'
            : (parsed.brand?.subName || defaultSiteContent.brand.subName),
          coordinates: defaultSiteContent.brand.coordinates,
          mapsEmbedUrl: defaultSiteContent.brand.mapsEmbedUrl,
          mapsGoogleUrl: defaultSiteContent.brand.mapsGoogleUrl,
        };

        return {
          ...defaultSiteContent,
          ...parsed,
          brand,
          hero,
          gowa: {
            ...defaultSiteContent.gowa,
            ...(parsed.gowa || {}),
          },
          bookings: parsed.bookings || defaultSiteContent.bookings || [],
          storeStatus: parsed.storeStatus || defaultSiteContent.storeStatus,
          products: parsed.products || defaultSiteContent.products,
          services: parsed.services || defaultSiteContent.services,
        };
      }
    } catch (e) {
      console.error('Error loading stored content:', e);
    }
    return defaultSiteContent;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Helper to persist content to localStorage, Supabase Cloud, and server file
  const persistChanges = (data) => {
    // 1. Client-side instant localStorage cache
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage quota warning:', e);
    }

    // 2. Supabase Cloud Database persistence (Works in Vercel & Globally)
    if (isSupabaseConfigured()) {
      saveRemoteSiteContent(data).then((success) => {
        if (success) {
          console.log('Site content successfully synced to Supabase Cloud!');
        }
      });
    }

    // 3. Fallback: Local server disk API (for local development on LAN)
    try {
      fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  // 1. Sync with remote Supabase Cloud Database on initial load (Priority for Vercel & Global access)
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchRemoteSiteContent().then((cloudData) => {
        if (cloudData && typeof cloudData === 'object' && Object.keys(cloudData).length > 0) {
          setContent((prev) => {
            const merged = {
              ...prev,
              ...cloudData,
              brand: {
                ...prev.brand,
                ...(cloudData.brand || {}),
                subName: (cloudData.brand?.subName && cloudData.brand.subName.toUpperCase().includes('WORKSHOP'))
                  ? 'AMPERA'
                  : (cloudData.brand?.subName || prev.brand?.subName || 'AMPERA'),
              },
              hero: {
                ...prev.hero,
                ...(cloudData.hero || {}),
                banners:
                  cloudData.hero?.banners && cloudData.hero.banners.length > 0
                    ? cloudData.hero.banners
                    : prev.hero?.banners,
              },
            };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        } else {
          // Database cloud masih kosong (fresh setup), auto-seed data aktif ke Supabase Cloud
          setContent((current) => {
            saveRemoteSiteContent(current);
            return current;
          });
        }
      });
    }

    // Fallback: Sync with local server API on LAN if active
    fetch('/api/site-content')
      .then((res) => (res.ok ? res.json() : null))
      .then((remoteData) => {
        if (remoteData && typeof remoteData === 'object' && Object.keys(remoteData).length > 0) {
          setContent((prev) => {
            const merged = {
              ...prev,
              ...remoteData,
              brand: {
                ...prev.brand,
                ...(remoteData.brand || {}),
                subName: (remoteData.brand?.subName && remoteData.brand.subName.toUpperCase().includes('WORKSHOP'))
                  ? 'AMPERA'
                  : (remoteData.brand?.subName || prev.brand?.subName || 'AMPERA'),
              },
              hero: {
                ...prev.hero,
                ...(remoteData.hero || {}),
                banners:
                  remoteData.hero?.banners && remoteData.hero.banners.length > 0
                    ? remoteData.hero.banners
                    : prev.hero?.banners,
              },
            };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      })
      .catch(() => {});
  }, []);

  // 2. Sync with remote Supabase products on initial load if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchRemoteProducts().then((remoteList) => {
        if (remoteList && remoteList.length > 0) {
          setContent((prev) => ({
            ...prev,
            products: remoteList,
          }));
        }
      });
    }
  }, []);

  // Check if store is currently open
  const isStoreOpen = useCallback(() => {
    const { storeStatus } = content;
    if (!storeStatus) return true;

    if (storeStatus.mode === 'open') return true;
    if (storeStatus.mode === 'closed') return false;

    // Mode: 'auto'
    try {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMin = currentHours * 60 + currentMinutes;

      const [openH, openM] = (storeStatus.openTime || '08:00').split(':').map(Number);
      const [closeH, closeM] = (storeStatus.closeTime || '20:00').split(':').map(Number);

      const openTotalMin = openH * 60 + openM;
      const closeTotalMin = closeH * 60 + closeM;

      return currentTotalMin >= openTotalMin && currentTotalMin < closeTotalMin;
    } catch {
      return true;
    }
  }, [content]);

  const updateHero = (newHero) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        hero: { ...prev.hero, ...newHero },
      };
      persistChanges(updated);
      return updated;
    });
  };

  const updateHeroBanners = (newBanners) => {
    setContent((prev) => {
      const primary = newBanners[0] || {};
      const updated = {
        ...prev,
        hero: {
          ...prev.hero,
          badgeText: primary.badgeText !== undefined ? primary.badgeText : prev.hero?.badgeText,
          headline: primary.headline !== undefined ? primary.headline : prev.hero?.headline,
          headlineHighlight: primary.headlineHighlight !== undefined ? primary.headlineHighlight : prev.hero?.headlineHighlight,
          subheadline: primary.subheadline !== undefined ? primary.subheadline : prev.hero?.subheadline,
          bgImage: primary.bgImage !== undefined ? primary.bgImage : prev.hero?.bgImage,
          ctaText: primary.ctaText !== undefined ? primary.ctaText : prev.hero?.ctaText,
          secondaryCtaText: primary.secondaryCtaText !== undefined ? primary.secondaryCtaText : prev.hero?.secondaryCtaText,
          banners: newBanners,
        },
      };
      persistChanges(updated);
      return updated;
    });
  };

  const addBooking = (bookingData) => {
    const newEntry = {
      id: `book-${Date.now()}`,
      name: bookingData.name || '',
      phone: bookingData.phone || '',
      carModel: bookingData.carModel || '',
      serviceNeed: bookingData.serviceNeed || '',
      serviceDate: bookingData.serviceDate || '',
      status: 'Menunggu',
      createdAt: new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setContent((prev) => {
      const updated = {
        ...prev,
        bookings: [newEntry, ...(prev.bookings || [])],
      };
      persistChanges(updated);
      return updated;
    });
    return newEntry;
  };

  const updateBookingStatus = (id, newStatus) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        bookings: (prev.bookings || []).map((b) =>
          b.id === id ? { ...b, status: newStatus } : b
        ),
      };
      persistChanges(updated);
      return updated;
    });
  };

  const deleteBooking = (id) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        bookings: (prev.bookings || []).filter((b) => b.id !== id),
      };
      persistChanges(updated);
      return updated;
    });
  };

  const updateServices = (newServices) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        services: newServices,
      };
      persistChanges(updated);
      return updated;
    });
  };

  const updateProducts = (newProducts) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        products: newProducts,
      };
      persistChanges(updated);
      return updated;
    });
  };

  const updateStoreStatus = (newStatus) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        storeStatus: { ...prev.storeStatus, ...newStatus },
      };
      persistChanges(updated);
      return updated;
    });
  };

  const updatePromo = (newPromo) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        promo: { ...prev.promo, ...newPromo },
      };
      persistChanges(updated);
      return updated;
    });
  };

  const updateArticles = (newArticles) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        promo: {
          ...prev.promo,
          articles: newArticles,
        },
      };
      persistChanges(updated);
      return updated;
    });
  };

  const updateTestimonials = (newTestimonials) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        testimonials: { ...prev.testimonials, ...newTestimonials },
      };
      persistChanges(updated);
      return updated;
    });
  };

  const updateGowaConfig = (newGowa) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        gowa: { ...prev.gowa, ...newGowa },
      };
      persistChanges(updated);
      return updated;
    });
  };

  const sendBookingToGowa = async (bookingData) => {
    const gowaConfig = content?.gowa || defaultSiteContent.gowa;
    if (gowaConfig?.isEnabled === false) {
      return { success: false, reason: 'GOWA disabled' };
    }

    const apiUrl = (gowaConfig?.apiUrl || 'https://gowa590.ssdampera.web.id').replace(/\/+$/, '');
    const groupJid = gowaConfig?.targetGroupJid || '120363417372591982@g.us';

    const formattedMessage =
      `🔔 *RESERVASI SERVIS BARU - WEBSITE CABANG AMPERA*\n\n` +
      `👤 *Nama:* ${bookingData.name}\n` +
      `📱 *No. HP/WA:* ${bookingData.phone}\n` +
      `🚗 *Kendaraan:* ${bookingData.carModel}\n` +
      `🔧 *Layanan:* ${bookingData.serviceNeed}\n` +
      `📅 *Rencana Tanggal:* ${bookingData.serviceDate}\n` +
      `⏰ *Waktu Pengajuan:* ${bookingData.createdAt || new Date().toLocaleString('id-ID')}\n\n` +
      `_Pesan otomatis dikirim melalui Sistem Reservasi shopanddriveampera.com_`;

    try {
      const response = await fetch(`${apiUrl}/send/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: groupJid,
          message: formattedMessage,
        }),
      });
      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('Gowa send message error:', err);
      return { success: false, error: err };
    }
  };

  const updateBrand = (newBrand) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        brand: { ...prev.brand, ...newBrand },
      };
      persistChanges(updated);
      return updated;
    });
  };

  const resetToDefault = async () => {
    setContent(defaultSiteContent);
    persistChanges(defaultSiteContent);
    try {
      localStorage.removeItem(STORAGE_KEY);
      fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultSiteContent),
      }).catch(() => {});
    } catch (e) {
      console.error('Error resetting content:', e);
    }
  };

  const login = (username, password) => {
    const u = username.trim();
    const p = password.trim();
    if (
      (u === 'admin' && p === '@Komponen0285') ||
      (u === 'sm0590' && p === 'Komponen0590')
    ) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      return { success: true };
    }
    return { success: false, message: 'ID Admin atau Password tidak sesuai!' };
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  const setSupabaseCredentials = (url, key) => {
    try {
      localStorage.setItem('ssdampera_supabase_url', url.trim());
      localStorage.setItem('ssdampera_supabase_key', key.trim());
      window.location.reload();
    } catch (e) {
      console.error('Error saving supabase credentials:', e);
    }
  };

  return (
    <SiteDataContext.Provider
      value={{
        content,
        updateHero,
        updateHeroBanners,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        updateServices,
        updateProducts,
        updateStoreStatus,
        updatePromo,
        updateArticles,
        updateTestimonials,
        updateBrand,
        updateGowaConfig,
        sendBookingToGowa,
        setSupabaseCredentials,
        isSupabaseConfigured,
        resetToDefault,
        isStoreOpen,
        isAdminLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export { SiteDataContext } from './SiteDataContextObject';
export { useSiteData } from './useSiteData';

