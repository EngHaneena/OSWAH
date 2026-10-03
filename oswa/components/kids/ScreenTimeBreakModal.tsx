'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';

interface ScreenTimeBreakModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSnooze: () => void;
}

export default function ScreenTimeBreakModal({
  isOpen,
  onDismiss,
  onSnooze,
}: ScreenTimeBreakModalProps) {
  const { t, isArabic, dir } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="breakModalTitle"
    >
      <div
        dir={dir}
        className="w-full max-w-md bg-white/95 dark:bg-[#F5F2EB] text-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-emerald-400/60 dark:border-emerald-500/40 text-center relative animate-fade-in-up"
      >
        {/* Soft Smiling Leaf / Sunnah icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-200/80 flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner animate-bounce" style={{ animationDuration: '3s' }}>
          🌿
        </div>

        <h2
          id="breakModalTitle"
          className="text-2xl sm:text-3xl font-bold text-emerald-800 dark:text-emerald-900 mb-3"
          style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
        >
          {t('parentPortal.breakNotificationTitle')}
        </h2>

        <p
          className="text-sm sm:text-base text-slate-700 dark:text-slate-800 leading-relaxed font-medium mb-6"
          style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
        >
          {t('parentPortal.breakNotificationMessage')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 py-3 px-5 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md transition-all active:scale-95"
            style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
          >
            {t('parentPortal.breakDismiss')}
          </button>

          <button
            type="button"
            onClick={onSnooze}
            className="py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-800 bg-slate-100 dark:bg-slate-200 hover:bg-slate-200 transition-colors"
            style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
          >
            {t('parentPortal.breakSnooze')}
          </button>
        </div>
      </div>
    </div>
  );
}
