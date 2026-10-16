import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultSiteContent } from '../data/defaultContent';
import { fetchRemoteProducts, isSupabaseConfigured } from '../lib/supabaseClient';

const STORAGE_KEY = 'ssdampera_site_content_v2';
const AUTH_KEY = 'ssdampera_admin_authenticated';

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new structures (products, storeStatus) exist
        return {
          ...defaultSiteContent,
          ...parsed,
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

  // Sync with remote Supabase on initial load if configured
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

  // Save to localStorage whenever content changes (Hybrid Offline Fallback)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      console.error('Error persisting site content:', e);
    }
  }, [content]);

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
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...newHero },
    }));
  };

  const updateServices = (newServices) => {
    setContent((prev) => ({
      ...prev,
      services: newServices,
    }));
  };

  const updateProducts = (newProducts) => {
    setContent((prev) => ({
      ...prev,
      products: newProducts,
    }));
  };

  const updateStoreStatus = (newStatus) => {
    setContent((prev) => ({
      ...prev,
      storeStatus: { ...prev.storeStatus, ...newStatus },
    }));
  };

  const updatePromo = (newPromo) => {
    setContent((prev) => ({
      ...prev,
      promo: { ...prev.promo, ...newPromo },
    }));
  };

  const updateTestimonials = (newTestimonials) => {
    setContent((prev) => ({
      ...prev,
      testimonials: { ...prev.testimonials, ...newTestimonials },
    }));
  };

  const updateBrand = (newBrand) => {
    setContent((prev) => ({
      ...prev,
      brand: { ...prev.brand, ...newBrand },
    }));
  };

  const resetToDefault = () => {
    setContent(defaultSiteContent);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error resetting content:', e);
    }
  };

  const login = (username, password) => {
    if (username.trim() === 'ssdampera' && password.trim() === 'Komponen0285') {
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
        updateServices,
        updateProducts,
        updateStoreStatus,
        updatePromo,
        updateTestimonials,
        updateBrand,
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

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
}
