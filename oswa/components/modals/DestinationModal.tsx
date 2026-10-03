'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { UI_TRANSLATIONS } from '@/components/tiles/tilesData';

interface DestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DestinationModal({ isOpen, onClose }: DestinationModalProps) {
  const { locale, isArabic, dir } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const tUI = UI_TRANSLATIONS[locale];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
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
      aria-labelledby="destinationModalTitle"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white/95 dark:bg-[#F5F2EB] text-[#22301B] dark:text-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--color-gold)]/40 dark:border-amber-500/25 outline-none relative animate-fade-in-up"
        dir={dir}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={tUI.closeModal}
          className="absolute top-5 end-5 w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-600 dark:hover:text-black bg-black/5 dark:bg-black/5 hover:bg-black/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] font-bold text-base"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 sm:mb-8 pt-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold)] mb-3">
            <span className="text-2xl">✦</span>
          </div>
          <h2
            id="destinationModalTitle"
            className="text-2xl sm:text-3xl font-bold text-[#22301B] dark:text-[#1E293B] mb-2"
            style={{ fontFamily: isArabic ? 'Aref Ruqaa, serif' : 'inherit' }}
          >
            {isArabic ? 'اختر وجهتك في أُسـوة' : 'Choose Your Destination in Oswah'}
          </h2>
          <p className="text-sm sm:text-base text-[#4A6038] dark:text-slate-700 max-w-lg mx-auto leading-relaxed">
            {isArabic
              ? 'استلهم من هدي النبي ﷺ في مواقف حياتك، أو شارك أطفالك متعة التعلم القيمي من السيرة'
              : 'Draw inspiration from Prophetic guidance for your daily life, or explore moral learning with children'}
          </p>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* 1. Wisdom & Lessons Destination */}
          <Link
            href="/wisdom"
            onClick={onClose}
            className="group flex flex-col justify-between p-6 rounded-2xl bg-[var(--color-surface)] dark:bg-[#EFECE4] border border-[var(--color-gold)]/30 dark:border-amber-500/25 hover:border-[var(--color-olive)] dark:hover:border-amber-600/50 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] text-start relative overflow-hidden"
          >
            {/* Top Tag & Icon */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-3xl group-hover:scale-110 transition-transform">🌿</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-olive)]/15 text-[var(--color-olive)] dark:bg-emerald-100 dark:text-emerald-900 border border-[var(--color-olive)]/20">
                {isArabic ? 'للبالغين والأسرة' : 'For Adults & Family'}
              </span>
            </div>

            {/* Title & Description */}
            <div className="mb-5">
              <h3
                className="text-xl font-bold text-[#22301B] dark:text-[#1E293B] mb-2 group-hover:text-[var(--color-olive)] dark:group-hover:text-amber-800 transition-colors"
                style={{ fontFamily: isArabic ? 'Aref Ruqaa, serif' : 'inherit' }}
              >
                {isArabic ? 'صفحة العظة والعبرة' : 'Wisdom & Lessons'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-700 leading-relaxed font-medium">
                {isArabic
                  ? 'استشارات سلوكية وتنفيذية مستنبطة من السيرة النبوية المطهرة لما تمر به من مواقف وتحديات.'
                  : 'Behavioral insights, verified Seerah resolutions, and actionable roadmaps for life dilemmas.'}
              </p>
            </div>

            {/* Action CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-gold)]/20 dark:border-amber-500/20 text-xs font-bold text-[var(--color-olive)] dark:text-amber-800">
              <span>{isArabic ? 'دخول صفحة العظة' : 'Explore Wisdom'}</span>
              <span className={`transform transition-transform ${isArabic ? 'group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'}`}>
                {isArabic ? '⬅️' : '➡️'}
              </span>
            </div>
          </Link>

          {/* 2. Oswah Sprouts Destination */}
          <Link
            href="/kids"
            onClick={onClose}
            className="group flex flex-col justify-between p-6 rounded-2xl bg-[var(--color-surface)] dark:bg-[#EFECE4] border border-amber-300/40 dark:border-amber-500/25 hover:border-amber-500 dark:hover:border-amber-600/50 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] text-start relative overflow-hidden"
          >
            {/* Top Tag & Icon */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-3xl group-hover:scale-110 transition-transform">⭐</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:bg-amber-100 dark:text-amber-900 border border-amber-500/20">
                {isArabic ? 'للأطفال والناشئة' : 'For Sprouts & Youth'}
              </span>
            </div>

            {/* Title & Description */}
            <div className="mb-5">
              <h3
                className="text-xl font-bold text-[#22301B] dark:text-[#1E293B] mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-800 transition-colors"
                style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
              >
                {isArabic ? 'براعم أُسوة' : 'Oswah Sprouts'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-700 leading-relaxed font-medium">
                {isArabic
                  ? 'قصص تفاعلية شيقة وألعاب ممتعة لغرس أخلاق النبي ﷺ ومحبة الصحابة في نفوس الصغار.'
                  : 'Engaging interactive stories and playful matching games instilling noble Prophetic virtues.'}
              </p>
            </div>

            {/* Action CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-gold)]/20 dark:border-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-800">
              <span style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}>
                {isArabic ? 'دخول براعم أُسوة' : 'Enter Oswah Sprouts'}
              </span>
              <span className={`transform transition-transform ${isArabic ? 'group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'}`}>
                {isArabic ? '⬅️' : '➡️'}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
