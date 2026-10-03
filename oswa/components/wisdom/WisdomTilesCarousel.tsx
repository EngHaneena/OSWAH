'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FLOATING_TILES_DATA, UI_TRANSLATIONS } from '@/components/tiles/tilesData';
import { TileData, getLocalizedText } from '@/components/tiles/types';
import TileModal from '@/components/tiles/TileModal';
import { useTranslation } from '@/lib/i18n';

export default function WisdomTilesCarousel() {
  const { locale, isArabic, dir } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const tiles = FLOATING_TILES_DATA;
  const currentTile = tiles[currentIndex];
  const tUI = UI_TRANSLATIONS[locale];

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % tiles.length);
      setIsTransitioning(false);
    }, 150);
  }, [tiles.length]);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + tiles.length) % tiles.length);
      setIsTransitioning(false);
    }, 150);
  }, [tiles.length]);

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  // Auto-rotation every 5 seconds (5000ms), paused on hover or user toggle
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isPaused || prefersReducedMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, handleNext]);

  const titleText = getLocalizedText(currentTile.title, locale);
  const contentText = getLocalizedText(currentTile.content, locale);
  const lessonText = getLocalizedText(currentTile.lesson, locale);
  const badgeText = currentTile.badge
    ? getLocalizedText(currentTile.badge, locale)
    : currentTile.is_sharia_text
    ? tUI.badgeHadith
    : tUI.badgeSituation;

  return (
    <>
      <section
        className="w-full max-w-4xl mx-auto mb-8 animate-fade-in-up"
        aria-label={isArabic ? 'شريط المواقف النبوية الملهمة' : 'Featured Prophetic Wisdom Banner'}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        dir={dir}
      >
        <div className="relative rounded-[2rem] bg-white/90 dark:bg-[#F5F2EB] text-[#22301B] dark:text-[#1E293B] p-6 sm:p-8 shadow-lg border border-[var(--color-gold)]/35 dark:border-amber-500/20 backdrop-blur-md overflow-hidden transition-all duration-300">
          {/* Subtle Top Ambient Accent Ribbon */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[var(--color-gold)] via-[var(--color-olive)] to-[var(--color-gold)] opacity-70" />

          {/* Banner Header: Badge, Status, Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--color-gold)]/20 dark:border-amber-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-olive)] animate-pulse" aria-hidden="true" />
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-olive)]/15 text-[var(--color-olive)] dark:bg-amber-100 dark:text-amber-900 border border-[var(--color-olive)]/20">
                {badgeText}
              </span>
              <span className="text-xs text-[var(--color-gold)] dark:text-[#8B6914] font-medium hidden sm:inline">
                ✦ {isArabic ? 'قبس نبوي ملهم' : 'Featured Wisdom'}
              </span>
            </div>

            {/* Controls: Pause/Play indicator, Slide index, Arrows */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="text-xs text-slate-500 dark:text-slate-700 hover:text-slate-800 dark:hover:text-black px-2 py-1 rounded-md bg-black/5 dark:bg-black/5 transition-colors font-medium flex items-center gap-1.5"
                title={isPaused ? (isArabic ? 'تشغيل التدوير التلقائي' : 'Resume rotation') : (isArabic ? 'إيقاف التدوير التلقائي' : 'Pause rotation')}
                aria-label={isPaused ? (isArabic ? 'تشغيل التدوير التلقائي' : 'Resume rotation') : (isArabic ? 'إيقاف التدوير التلقائي' : 'Pause rotation')}
              >
                <span>{isPaused ? '▶' : '⏸'}</span>
                <span className="text-[11px] hidden md:inline">{isPaused ? (isArabic ? 'متوقف' : 'Paused') : (isArabic ? 'تلقائي' : 'Auto')}</span>
              </button>

              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-700" dir="ltr">
                {currentIndex + 1} / {tiles.length}
              </span>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 dark:bg-black/5 hover:bg-[var(--color-olive)] hover:text-white dark:hover:bg-amber-600 dark:hover:text-white text-slate-700 dark:text-slate-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] font-bold text-sm"
                  aria-label={isArabic ? 'الموقف السابق' : 'Previous wisdom'}
                  title={isArabic ? 'الموقف السابق' : 'Previous wisdom'}
                >
                  {isArabic ? '❯' : '❮'}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 dark:bg-black/5 hover:bg-[var(--color-olive)] hover:text-white dark:hover:bg-amber-600 dark:hover:text-white text-slate-700 dark:text-slate-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] font-bold text-sm"
                  aria-label={isArabic ? 'الموقف التالي' : 'Next wisdom'}
                  title={isArabic ? 'الموقف التالي' : 'Next wisdom'}
                >
                  {isArabic ? '❮' : '❯'}
                </button>
              </div>
            </div>
          </div>

          {/* Main Slide Content with Smooth Transition */}
          <div
            className={`transition-all duration-300 transform ${
              isTransitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Title */}
            <h2
              className="text-xl sm:text-2xl font-bold text-[#22301B] dark:text-[#1E293B] mb-3 flex items-center gap-2"
              style={{ fontFamily: isArabic ? 'Aref Ruqaa, serif' : 'inherit' }}
            >
              <span>{titleText}</span>
            </h2>

            {/* Prophetic Text / Quote Box */}
            <blockquote
              className={`rounded-2xl p-4 sm:p-5 my-3 shadow-inner border-s-4 border-[var(--color-gold)] dark:border-amber-600 bg-[#F6F1E3]/85 dark:bg-[#EFECE4] text-[#22301B] dark:text-[#1E293B] leading-relaxed ${
                currentTile.is_sharia_text && isArabic
                  ? 'font-quran text-lg sm:text-xl leading-[2.3]'
                  : 'text-base sm:text-lg font-medium'
              }`}
            >
              {contentText}
            </blockquote>

            {/* Core Lesson Excerpt */}
            {lessonText && (
              <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-700 my-2 font-medium">
                <span className="text-base leading-none">🌿</span>
                <p>
                  <strong className="text-[#3F5233] dark:text-[#8B6914]">{tUI.lessonLabel}</strong> {lessonText}
                </p>
              </div>
            )}
          </div>

          {/* Banner Footer: Dots & Details CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-[var(--color-gold)]/15 dark:border-amber-500/20">
            {/* Dots Indicator */}
            <div className="flex items-center gap-1.5" role="tablist" aria-label={isArabic ? 'مؤشرات التنقل' : 'Slide indicators'}>
              {tiles.map((tile, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={tile.id}
                    onClick={() => handleDotClick(idx)}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`${isArabic ? 'الموقف' : 'Wisdom'} ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] ${
                      isActive
                        ? 'w-7 bg-[var(--color-olive)] dark:bg-amber-600'
                        : 'w-2 bg-slate-300 dark:bg-slate-400 hover:bg-slate-400 dark:hover:bg-slate-500'
                    }`}
                  />
                );
              })}
            </div>

            {/* Button to Open Full Modal */}
            <button
              type="button"
              onClick={() => setSelectedTile(currentTile)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[var(--color-olive)] hover:bg-[#22301B] text-white dark:bg-amber-600 dark:hover:bg-amber-700 dark:text-white shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            >
              <span>📜 {tUI.detailsBtn}</span>
              <span className={`transform transition-transform ${isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                {isArabic ? '←' : '→'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Modal Dialog for Selected Tile */}
      {selectedTile && (
        <TileModal tile={selectedTile} onClose={() => setSelectedTile(null)} />
      )}
    </>
  );
}
