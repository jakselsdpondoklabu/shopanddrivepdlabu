import { createClient } from '@supabase/supabase-js';

// Default Supabase project credentials for Shop & Drive Pondok Labu
const DEFAULT_SUPABASE_URL = 'https://zhlbucryrtdrryqwswsd.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobGJ1Y3J5cnRkcnJ5cXdzd3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNDM0OTEsImV4cCI6MjEwNzcxOTQ5MX0.VGjp2Warw54J_v5hgG2Haik6RkY9K43PvjCddNCPGU8';

// Retrieve credentials from environment variables, localStorage override, or project fallback
const envUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Check localStorage for manual override if admin configured it in dashboard
const localUrl = typeof window !== 'undefined' ? localStorage.getItem('ssdampera_supabase_url') : null;
const localKey = typeof window !== 'undefined' ? localStorage.getItem('ssdampera_supabase_key') : null;

const sanitizeUrl = (url) => {
  if (!url) return '';
  return url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
};

export const SUPABASE_URL = sanitizeUrl(localUrl || envUrl || '');
export const SUPABASE_ANON_KEY = (localKey || envAnonKey || '').trim();

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));
};

/**
 * Format string atau number menjadi format mata uang Rupiah rapi
 * Contoh: 850000 -> "Rp 850.000", "850.000" -> "Rp 850.000", "Rp 850.000" -> "Rp 850.000"
 */
export function formatRupiah(val) {
  if (!val) return '';
  const str = String(val).trim();
  if (/^rp/i.test(str)) {
    return str;
  }
  const cleanDigits = str.replace(/[^0-9]/g, '');
  if (!cleanDigits) {
    return str;
  }
  const num = parseInt(cleanDigits, 10);
  if (isNaN(num)) return str;
  return `Rp ${num.toLocaleString('id-ID')}`;
}

const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) return null;
  if (typeof window !== 'undefined') {
    if (!window.__ssdamperaSupabase) {
      window.__ssdamperaSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return window.__ssdamperaSupabase;
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

export const supabase = getSupabaseClient();

/**
 * Client-side canvas image compressor to ensure photos are lightweight (~100KB)
 * before uploading to Supabase or storing locally.
 */
export function compressImage(file, maxWidth = 1200, quality = 0.82) {
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

        // Convert to Blob for upload
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(event.target.result);
              return;
            }
            // Also provide DataURL fallback
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve({ blob, dataUrl });
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Uploads product photo to Supabase Storage bucket 'product-images'.
 * If Supabase is not configured, returns compressed DataURL for instant local preview/storage.
 */
export async function uploadProductPhoto(file) {
  if (!file) throw new Error('File tidak ditemukan');

  const { blob, dataUrl } = await compressImage(file, 1200, 0.82);

  // If Supabase is configured and connected, upload to cloud storage
  if (isSupabaseConfigured() && supabase) {
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const cleanFileName = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${ext}`;
      const filePath = `products/${cleanFileName}`;

      const { data: _uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.warn('Gagal upload ke Supabase Storage, menggunakan DataURL lokal:', uploadError.message);
        return {
          url: dataUrl,
          isRemote: false,
          error: uploadError.message,
        };
      }

      // Get public CDN URL
      const { data: publicData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return {
        url: publicData.publicUrl,
        isRemote: true,
      };
    } catch (err) {
      console.warn('Error uploading to Supabase:', err);
      return {
        url: dataUrl,
        isRemote: false,
      };
    }
  }

  // Fallback: return compressed DataURL directly
  return {
    url: dataUrl,
    isRemote: false,
  };
}

/**
 * Fetch all products from Supabase 'products' table.
 */
export async function fetchRemoteProducts() {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching products from Supabase:', error.message);
      return null;
    }

    // Map database snake_case columns to camelCase
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      brandBadge: item.brand_badge,
      badge: item.badge,
      image: item.image_url,
      description: item.description,
      price: item.price || item.price_estimate || '',
      priceEstimate: item.price_estimate || item.price || '',
      discountTradeIn: item.discount_trade_in || '',
      waMessage: item.wa_message,
      showInBanner: item.show_in_banner ?? false,
    }));
  } catch (err) {
    console.warn('Supabase fetch exception:', err);
    return null;
  }
}

/**
 * Save / Insert product to Supabase.
 */
export async function insertRemoteProduct(product) {
  if (!isSupabaseConfigured() || !supabase) return null;

  const basePrice = product.price || product.priceEstimate || '';

  try {
    const payload = {
      id: product.id,
      name: product.name,
      category: product.category,
      brand_badge: product.brandBadge,
      badge: product.badge,
      image_url: product.image,
      description: product.description,
      price_estimate: basePrice,
      discount_trade_in: product.discountTradeIn || null,
      waMessage: product.waMessage,
      showInBanner: product.showInBanner ?? false,
    };

    let { data, error } = await supabase
      .from('products')
      .upsert(payload)
      .select()
      .maybeSingle();

    // If discount_trade_in column is not yet created in Supabase schema, retry without it
    if (error && error.code === 'PGRST204') {
      delete payload.discount_trade_in;
      const retryResult = await supabase
        .from('products')
        .upsert(payload)
        .select()
        .maybeSingle();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Error inserting remote product:', err);
    return null;
  }
}

/**
 * Fetch all site content (hero, banners, storeStatus, brand, services, promos, testimonials, etc.) from Supabase 'site_content' table.
 */
export async function fetchRemoteSiteContent() {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('data')
      .eq('key', 'main')
      .maybeSingle();

    if (error) {
      console.warn('Supabase site_content fetch info/error:', error.message);
      return null;
    }

    return data?.data || null;
  } catch (err) {
    console.warn('Supabase site_content exception:', err);
    return null;
  }
}

/**
 * Persist all site content to Supabase 'site_content' table.
 */
export async function saveRemoteSiteContent(contentData) {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({
        key: 'main',
        data: contentData,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('Supabase site_content save error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase site_content save exception:', err);
    return false;
  }
}

/**
 * Delete product from Supabase.
 */
export async function deleteRemoteProduct(id) {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Error deleting remote product:', err);
    return false;
  }
}



