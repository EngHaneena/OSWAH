'use client';

import React, { useEffect, useRef } from 'react';
import { TileData, getLocalizedText } from './types';
import { VerseFrame } from '@/components/ornaments/IslamicPattern';
import { useTranslation } from '@/lib/i18n';
import { UI_TRANSLATIONS } from './tilesData';

interface TileModalProps {
  tile: TileData | null;
  onClose: () => void;
}

export default function TileModal({ tile, onClose }: TileModalProps) {
  const { locale, isArabic } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [tile, onClose]);

  if (!tile) return null;

  const tUI = UI_TRANSLATIONS[locale];
  const titleText = getLocalizedText(tile.title, locale);
  const contentText = getLocalizedText(tile.content, locale);
  const rawArabicContent = typeof tile.content === 'object' ? tile.content.ar : tile.content;
  const sourceBook = getLocalizedText(tile.source_book, locale);
  const gradeText = getLocalizedText(tile.grade, locale);
  const narratorText = getLocalizedText(tile.narrator, locale);
  const lessonText = getLocalizedText(tile.lesson, locale);
  const methodText = getLocalizedText(tile.prophetic_method, locale);

  const badgeText = tile.badge
    ? (isArabic && tile.is_sharia_text ? 'نص شرعي موثق' : getLocalizedText(tile.badge, locale))
    : tile.is_sharia_text
    ? (isArabic ? 'نص شرعي موثق' : tUI.badgeHadith)
    : tUI.badgeSituation;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tileModalTitle"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[var(--color-surface)] dark:bg-[#F5F2EB] text-[#22301B] dark:text-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--color-gold)]/30 dark:border-amber-500/20 outline-none max-h-[90vh] overflow-y-auto"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--color-gold)]/20 dark:border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-gold)] text-lg">✦</span>
            <h3
              id="tileModalTitle"
              className="text-xl font-bold text-[var(--color-ink)] dark:text-[#1E293B]"
            >
              {titleText}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label={isArabic ? 'إغلاق النافذة' : 'Close window'}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-ink-light)] dark:text-slate-600 hover:bg-black/5 dark:hover:bg-black/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-5">
          {tile.is_sharia_text ? (
            /* Sharia Text Card */
            <VerseFrame className="bg-white/70 dark:bg-[#EFECE4] rounded-2xl border border-[var(--color-gold)]/30 dark:border-amber-500/20 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--color-gold)]/20 dark:bg-amber-200/60 text-[#8f743c] dark:text-[#785b1d] border border-[var(--color-gold)]/30 dark:border-amber-500/25">
                  {badgeText}
                </span>
                {gradeText && (
                  <span className="text-xs font-semibold text-[var(--color-olive)] dark:text-[#2d4023]">
                    {tUI.gradeLabel} {gradeText}
                  </span>
                )}
              </div>

              {/* Main Content Display */}
              <p
                className={`text-center my-4 leading-relaxed ${
                  isArabic
                    ? 'font-quran text-lg sm:text-xl text-[var(--color-olive)] dark:text-[#22301B]'
                    : 'text-base sm:text-lg text-[var(--color-ink)] dark:text-[#1E293B] font-medium'
                }`}
              >
                {contentText}
              </p>

              {/* If viewing in English, also display the original Arabic wording */}
              {!isArabic && rawArabicContent && rawArabicContent !== contentText && (
                <div className="mt-3 pt-3 border-t border-[var(--color-gold)]/15 dark:border-amber-500/20" dir="rtl">
                  <span className="text-[10px] font-bold text-[#B89B5E] dark:text-[#8B6914] block mb-1">
                    الأصل العربي:
                  </span>
                  <p className="font-quran text-base text-[var(--color-olive)] dark:text-[#22301B] text-center leading-[2]">
                    {rawArabicContent}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-[var(--color-gold)]/20 dark:border-amber-500/20 flex flex-wrap items-center justify-between text-xs text-[var(--color-ink-light)] dark:text-slate-600 gap-2">
                {narratorText && (
                  <span>
                    <strong>{tUI.narratorLabel}</strong> {narratorText}
                  </span>
                )}
                {sourceBook && (
                  <span>
                    <strong>{tUI.sourceLabel}</strong> {sourceBook}{' '}
                    {tile.source_ref && `(${tile.source_ref})`}
                  </span>
                )}
              </div>
            </VerseFrame>
          ) : (
            /* Historical / Life Situation */
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#EFECE4] border border-[var(--color-gold)]/25 dark:border-amber-500/20">
              <div className="mb-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#B89B5E]/15 dark:bg-amber-200/60 text-[#8f743c] dark:text-[#785b1d]">
                  {badgeText}
                </span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-[var(--color-ink)] dark:text-[#1E293B] font-medium">
                {contentText}
              </p>
              {sourceBook && (
                <div className="mt-3 pt-2 border-t border-[var(--color-gold)]/15 dark:border-amber-500/20 text-xs text-[var(--color-ink-light)] dark:text-slate-600">
                  <strong>{tUI.sourceLabel}</strong> {sourceBook}{' '}
                  {tile.source_ref && `(${tile.source_ref})`}
                </div>
              )}
            </div>
          )}

          {/* Lesson and Prophetic Method (if available) */}
          {lessonText && (
            <div className="p-4 rounded-2xl bg-[var(--color-olive)]/10 dark:bg-[#3F5233]/10 border border-[var(--color-olive)]/25 dark:border-[#3F5233]/25 space-y-1">
              <h4 className="text-xs font-bold text-[var(--color-olive)] dark:text-[#2d4023]">
                {tUI.lessonLabel}
              </h4>
              <p className="text-xs sm:text-sm text-[var(--color-ink)] dark:text-[#1E293B] leading-relaxed">
                {lessonText}
              </p>
            </div>
          )}

          {methodText && (
            <div className="p-4 rounded-2xl bg-[var(--color-gold)]/10 dark:bg-amber-100/50 border border-[var(--color-gold)]/25 dark:border-amber-500/25 space-y-1">
              <h4 className="text-xs font-bold text-[var(--color-gold)] dark:text-[#8B6914]">
                {tUI.methodLabel}
              </h4>
              <p className="text-xs sm:text-sm text-[var(--color-ink)] dark:text-[#1E293B] leading-relaxed">
                {methodText}
              </p>
            </div>
          )}
        </div>

        {/* Footer Close Button */}
        <div className="pt-3 border-t border-[var(--color-gold)]/20 dark:border-amber-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--color-olive)] text-[var(--color-cream)] text-xs font-bold hover:bg-[var(--color-ink)] dark:bg-[#3F5233] dark:text-white dark:hover:bg-[#22301B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {tUI.closeModal}
          </button>
        </div>
      </div>
    </div>
  );
}
