'use client';

import React from 'react';
import Link from 'next/link';
import InteractiveStoryDemo from '@/components/kids/InteractiveStoryDemo';
import KidsAnimatedBackground from '@/components/kids/KidsAnimatedBackground';
import { useTranslation } from '@/lib/i18n';

export default function StoryPage() {
  const { t, dir, isArabic } = useTranslation();

  return (
    <div
      className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#FEF9C3] via-[#E0F2FE] to-[#FCE7F3] dark:bg-gradient-to-b dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden flex flex-col transition-colors duration-500"
      dir={dir}
    >
      <KidsAnimatedBackground />

      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full relative z-10">
        <div className="mb-6">
          <Link
            href="/kids"
            className="text-sky-700 dark:text-[#1E293B] font-bold hover:scale-105 bg-white/80 dark:bg-[#F5F2EB] px-5 py-2.5 rounded-full inline-flex items-center gap-2 shadow-sm border border-amber-500/20 transition-all text-sm sm:text-base"
            style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
          >
            <span>{isArabic ? '⬅️' : '➡️'}</span>
            <span>{t('kids.backToMenu')}</span>
          </Link>
        </div>

        <header className="text-center mb-8 animate-fade-in-up">
          <h1
            className="text-4xl sm:text-5xl font-bold text-sky-600 dark:text-sky-400 mb-2 drop-shadow-sm"
            style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
          >
            📚 {t('kids.storyTitle')}
          </h1>
          <p
            className="text-slate-700 dark:text-slate-300 font-medium text-base sm:text-lg"
            style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
          >
            {t('kids.readingSub')}
          </p>
        </header>

        <InteractiveStoryDemo />
      </main>
    </div>
  );
}
