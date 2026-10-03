import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import type { CompanySettings } from '../types';

interface SettingsContextType {
  settings: CompanySettings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<CompanySettings>) => Promise<CompanySettings>;
}

const defaultFallbackSettings: CompanySettings = {
  id: 1,
  company_name: 'RMVS Web Services',
  logo_url: '/logo.png',
  favicon_url: '/favicon.png',
  tagline: 'DESIGN • DEVELOP • GROW TOGETHER',
  description: 'Enterprise web architecture, digital platforms, and elite engineering solutions.',
  primary_color: '#0066FF',
  secondary_color: '#00F2FE',
  email: 'contact@rmvswebservices.com',
  phone: '+91 9400900000',
  whatsapp: '+91 9400900000',
  website: 'https://rmvswebservices.com',
  github_url: 'https://github.com/LingamalluRitesh',
  linkedin_url: 'https://linkedin.com',
  twitter_url: '',
  youtube_url: '',
  address: 'Hyderabad, India',
  business_hours: 'Monday – Friday, 9:00 AM – 6:00 PM',
  footer_copyright: '© 2026 RMVS Web Services. All rights reserved.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings | null>(defaultFallbackSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const applyBrandingToDocument = (data: CompanySettings) => {
    if (data.company_name) {
      document.title = `${data.company_name} | ${data.tagline || 'DESIGN • DEVELOP • GROW TOGETHER'}`;
    }
    if (data.favicon_url || data.logo_url) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = data.favicon_url || '/favicon.png';
    }
  };

  const refreshSettings = async () => {
    try {
      const res = await api.get<CompanySettings>('/settings');
      if (res.data) {
        setSettings(res.data);
        applyBrandingToDocument(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch company settings, using defaults.', err);
      applyBrandingToDocument(defaultFallbackSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<CompanySettings>): Promise<CompanySettings> => {
    const res = await api.put<CompanySettings>('/settings', newSettings);
    setSettings(res.data);
    applyBrandingToDocument(res.data);
    return res.data;
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings: settings || defaultFallbackSettings, isLoading, refreshSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
