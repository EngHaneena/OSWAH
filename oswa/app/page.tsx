'use client';

import React, { useState } from 'react';
import { ProphetGlow } from '@/components/ornaments/IslamicPattern';
import DestinationModal from '@/components/modals/DestinationModal';
import PropheticLineageBackground from '@/components/lineage/PropheticLineageBackground';
import PropheticLineageModal from '@/components/lineage/PropheticLineageModal';
import LineageFloatingBadge from '@/components/lineage/LineageFloatingBadge';
import { useTranslation } from '@/lib/i18n';
import { UI_TRANSLATIONS } from '@/components/tiles/tilesData';

export default function LandingPage() {
  const { locale, isArabic, dir } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLineageModalOpen, setIsLineageModalOpen] = useState(false);
  const [isLineageHighlighted, setIsLineageHighlighted] = useState(false);
  const [isLineageHovered, setIsLineageHovered] = useState(false);

  const tUI = UI_TRANSLATIONS[locale];
  const isEffectiveHighlight = isLineageHighlighted || isLineageHovered;

  return (
    <main
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      dir={dir}
    >
      {/* 1. Subtle & Dignified Prophetic Lineage Tree Background Watermark (شجرة نسب النبي ﷺ) */}
      <PropheticLineageBackground isHighlighted={isEffectiveHighlight} />

      {/* 2. Central Hero Column (z-20 sits clearly above the background watermark) */}
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

        {/* Enter Button — Opens Destination Choice Modal */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-2 group relative inline-flex items-center justify-center px-10 sm:px-12 py-4 sm:py-5 bg-[var(--color-olive)] text-[var(--color-cream)] rounded-full text-xl sm:text-2xl shadow-xl hover:shadow-2xl hover:bg-[var(--color-ink)] hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in-up focus:outline-none focus:ring-4 focus:ring-[var(--color-gold)] gap-3 cursor-pointer"
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
        </button>
      </div>

      {/* 3. Destination Choice Modal (Wisdom vs Oswah Sprouts) */}
      <DestinationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* 4. Subtle Floating Badge in bottom corner: 📜 شجرة النسب الشريف */}
      <LineageFloatingBadge
        onClick={() => setIsLineageModalOpen(true)}
        onHoverStart={() => setIsLineageHovered(true)}
        onHoverEnd={() => setIsLineageHovered(false)}
        isHighlighted={isEffectiveHighlight}
      />

      {/* 5. Detailed Interactive Prophetic Lineage Modal */}
      <PropheticLineageModal
        isOpen={isLineageModalOpen}
        onClose={() => setIsLineageModalOpen(false)}
        isBackgroundHighlighted={isLineageHighlighted}
        onToggleHighlight={() => setIsLineageHighlighted(!isLineageHighlighted)}
      />
    </main>
  );
}
