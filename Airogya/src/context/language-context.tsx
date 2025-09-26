'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, getTranslation } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  fontClass: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('airogya-language') as Language;
    if (savedLanguage && ['en', 'hi', 'or'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('airogya-language', lang);
  };

  const t = (key: string): string => {
    const currentTranslations = translations[language];
    const fallbackTranslations = translations['en']; // Always fallback to English
    
    return getTranslation(currentTranslations, key, fallbackTranslations);
  };

  const getFontClass = (lang: Language): string => {
    switch (lang) {
      case 'hi':
        return 'font-devanagari';
      case 'or':
        return 'font-odia';
      default:
        return 'font-sans';
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        fontClass: getFontClass(language),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
