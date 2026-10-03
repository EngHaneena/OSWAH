'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/i18n';
import { PROPHETIC_LINEAGE } from './lineageData';

interface PropheticLineageModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBackgroundHighlighted: boolean;
  onToggleHighlight: () => void;
}

export default function PropheticLineageModal({
  isOpen,
  onClose,
  isBackgroundHighlighted,
  onToggleHighlight,
}: PropheticLineageModalProps) {
  const { t, isArabic, dir } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lineageModalTitle"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        dir={dir}
        className="w-full max-w-3xl bg-white/95 dark:bg-[#F5F2EB] text-[#22301B] dark:text-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--color-gold)]/40 dark:border-amber-500/25 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={t('lineage.close')}
          className="absolute top-5 end-5 w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-black bg-black/5 hover:bg-black/10 transition-colors font-bold text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 pt-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold)] mb-3">
            <span className="text-2xl">📜</span>
          </div>
          <h2
            id="lineageModalTitle"
            className="text-2xl sm:text-3xl font-bold text-[#22301B] dark:text-[#1E293B] mb-2"
            style={{ fontFamily: isArabic ? 'Aref Ruqaa, serif' : 'inherit' }}
          >
            {t('lineage.modalTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-900 font-medium max-w-xl mx-auto leading-relaxed">
            {t('lineage.fromAdnan')}
          </p>
        </div>

        {/* Noble Selection Hadith Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#EFECE4] border border-[var(--color-gold)]/30 dark:border-amber-500/25 mb-6 text-center">
          <p
            className="text-base sm:text-lg text-[var(--color-olive)] dark:text-[#1E293B] font-medium leading-relaxed italic"
            style={{ fontFamily: isArabic ? 'var(--font-amiri), serif' : 'inherit' }}
          >
            {t('lineage.modalSubtitle')}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-600 block mt-2 font-semibold">
            {t('lineage.sourceHadith')}
          </span>
        </div>

        {/* Quick Background Highlight Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 mb-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-950">
            <span>✨</span>
            <span>{t('lineage.highlightToggle')}</span>
          </div>
          <button
            onClick={onToggleHighlight}
            type="button"
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              isBackgroundHighlighted
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white/80 dark:bg-white text-slate-700 hover:bg-white'
            }`}
          >
            {isBackgroundHighlighted ? t('lineage.highlightToggle') + ' ✓' : t('lineage.softModeToggle')}
          </button>
        </div>

        {/* Complete Lineage Sequence Chain (from Muhammad ﷺ back to Adnan) */}
        <div className="mb-6">
          <h3
            className="text-base sm:text-lg font-bold text-[#22301B] dark:text-[#1E293B] mb-3 flex items-center justify-between"
            style={{ fontFamily: isArabic ? 'Aref Ruqaa, serif' : 'inherit' }}
          >
            <span>{t('lineage.nobleSequence')}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-olive)]/15 text-[var(--color-olive)] dark:bg-emerald-100 dark:text-emerald-900 font-bold">
              {t('lineage.generationsCount')}
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PROPHETIC_LINEAGE.map((ancestor) => {
              const isProphet = ancestor.isProphet;
              const isPivotal = ancestor.isPivotal;

              return (
                <div
                  key={ancestor.generation}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    isProphet
                      ? 'bg-amber-100/80 dark:bg-amber-200/90 border-amber-400 dark:border-amber-500 sm:col-span-2 shadow-sm'
                      : isPivotal
                      ? 'bg-[var(--color-surface)] dark:bg-[#EFECE4] border-[var(--color-gold)]/40 dark:border-amber-500/30'
                      : 'bg-white dark:bg-white/70 border-slate-200 dark:border-slate-300'
                  }`}
                >
                  {/* Generation Badge */}
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isProphet
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-black/5 dark:bg-black/10 text-slate-700'
                    }`}
                  >
                    {isArabic ? ancestor.generation.toLocaleString('ar-EG') : ancestor.generation}
                  </span>

                  {/* Name and Historical Significance */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4
                        className={`font-bold text-sm sm:text-base ${
                          isProphet
                            ? 'text-amber-950 font-extrabold text-base sm:text-lg'
                            : 'text-[#22301B] dark:text-[#1E293B]'
                        }`}
                        style={{ fontFamily: isArabic ? 'var(--font-amiri), serif' : 'inherit' }}
                      >
                        {isArabic ? ancestor.nameAr : ancestor.nameEn}
                      </h4>
                      {isPivotal && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:bg-amber-100 dark:text-amber-900 border border-amber-500/20">
                          {isArabic ? 'علم بارز' : 'Pivotal'}
                        </span>
                      )}
                    </div>

                    {ancestor.descAr && (
                      <p className="text-xs text-slate-600 dark:text-slate-700 mt-0.5 leading-relaxed font-medium">
                        {isArabic ? ancestor.descAr : ancestor.descEn}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Close */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2.5 rounded-full bg-[var(--color-olive)] text-[var(--color-cream)] font-bold text-sm hover:bg-[var(--color-ink)] transition-colors shadow-sm"
          >
            {t('lineage.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
