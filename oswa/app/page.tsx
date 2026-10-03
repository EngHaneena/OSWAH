'use client';

import React from 'react';
import Link from 'next/link';
import { ProphetGlow } from '@/components/ornaments/IslamicPattern';
import FloatingTiles from '@/components/tiles/FloatingTiles';
import { useTranslation } from '@/lib/i18n';
import { UI_TRANSLATIONS } from '@/components/tiles/tilesData';

export default function LandingPage() {
  const { locale, isArabic, dir } = useTranslation();
  const tUI = UI_TRANSLATIONS[locale];

  return (
    <main
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      dir={dir}
    >
      {/* Decorative dynamic ambient rings */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="w-[800px] h-[800px] border-[1px] border-[var(--color-olive)] rounded-full animate-ping"
          style={{ animationDuration: '10s' }}
        />
        <div
          className="absolute w-[600px] h-[600px] border-[1px] border-[var(--color-gold)] rounded-full animate-ping"
          style={{ animationDuration: '12s' }}
        />
      </div>

      {/* Central Hero Column — max-w-2xl keeps sides completely safe for floating tiles */}
      <div className="z-20 flex flex-col items-center animate-fade-in-up max-w-2xl w-full text-center my-auto">
        {/* Glow Element */}
        <div className="relative mb-6 transform hover:scale-110 transition-transform duration-700">
          <ProphetGlow className="w-36 h-36 md:w-52 md:h-52" />
        </div>

        {/* App Title */}
        <h1
          className="text-7xl sm:text-8xl md:text-[140px] text-[var(--color-ink)] brand-title mb-2 leading-none drop-shadow-sm transition-all"
          style={{ fontFamily: isArabic ? 'Aref Ruqaa, serif' : 'inherit', fontWeight: 800 }}
        >
          {isArabic ? 'أُسـوة' : 'Oswah'}
        </h1>

        {/* Central Verse */}
        <div
          className="my-8 px-6 sm:px-8 py-5 sm:py-6 bg-white/75 dark:bg-[#F5F2EB] rounded-[2rem] border border-[var(--color-gold)]/30 dark:border-amber-500/20 backdrop-blur-md shadow-sm relative animate-fade-in-up hover:bg-white/85 dark:hover:bg-[#EFECE4] transition-colors max-w-xl"
          style={{ animationDelay: '0.2s' }}
        >
          {isArabic ? (
            <p
              className="text-xl sm:text-2xl md:text-3xl text-[var(--color-olive)] dark:text-[#1E293B] font-quran leading-[2] md:leading-[2.2]"
              dir="rtl"
            >
              ﴿ {tUI.verse} ﴾
            </p>
          ) : (
            <p
              className="text-lg sm:text-xl md:text-2xl text-[var(--color-olive)] dark:text-[#1E293B] font-medium leading-relaxed italic"
              dir="ltr"
            >
              {tUI.verse}
            </p>
          )}
        </div>

        {/* Enter Button */}
        <Link
          href="/wisdom"
          className="mt-2 group relative inline-flex items-center justify-center px-10 sm:px-12 py-4 sm:py-5 bg-[var(--color-olive)] text-[var(--color-cream)] rounded-full text-xl sm:text-2xl shadow-xl hover:shadow-2xl hover:bg-[var(--color-ink)] hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in-up focus:outline-none focus:ring-4 focus:ring-[var(--color-gold)] gap-3"
          style={{ animationDelay: '0.4s' }}
          dir={dir}
        >
          <span
            className="font-bold tracking-wide"
            style={{ fontFamily: isArabic ? 'Aref Ruqaa, serif' : 'inherit' }}
          >
            {tUI.enterBtn}
          </span>
          <div
            className={`bg-white/20 p-2 rounded-full transform transition-transform duration-300 ${
              isArabic ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'
            }`}
          >
            <svg
              className={`w-6 h-6 ${!isArabic ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Floating Tiles (Desktop absolute sides + mobile responsive strip) */}
      <FloatingTiles />
    </main>
  );
}
