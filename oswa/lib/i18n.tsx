'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import arMessages from '../messages/ar.json';
import enMessages from '../messages/en.json';

export type Locale = 'ar' | 'en';

type MessagesType = typeof arMessages;

interface LanguageContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  dir: 'rtl' | 'ltr';
  t: (path: string, params?: Record<string, string | number>) => string;
  isArabic: boolean;
}

const messagesMap: Record<Locale, any> = {
  ar: arMessages,
  en: enMessages,
};

const LanguageContext = createContext<LanguageContextType>({
  locale: 'ar',
  setLocale: () => {},
  dir: 'rtl',
  t: (path: string) => path,
  isArabic: true,
});

export function LanguageProvider({
  children,
  defaultLocale = 'ar',
}: {
  children: React.ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('oswa_locale') as Locale | null;
    if (saved === 'ar' || saved === 'en') {
      setLocaleState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
    } else {
      setLocaleState(defaultLocale);
      document.documentElement.lang = defaultLocale;
      document.documentElement.dir = defaultLocale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [defaultLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('oswa_locale', newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: any = messagesMap[locale];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to Arabic if missing in current locale
        let fallback: any = messagesMap.ar;
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            fallback = null;
            break;
          }
        }
        current = fallback || path;
        break;
      }
    }

    if (typeof current !== 'string') {
      return path;
    }

    let text = current;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return text;
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        dir,
        t,
        isArabic: locale === 'ar',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
