import { useContext } from 'react';
import { SiteDataContext } from './SiteDataContextObject';

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
}
