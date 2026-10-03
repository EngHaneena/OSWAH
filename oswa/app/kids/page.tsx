'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import KidsAnimatedBackground from '@/components/kids/KidsAnimatedBackground';

export default function KidsMenuPage() {
  const { t, dir, isArabic } = useTranslation();

  return (
    <div
      className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#FEF9C3] via-[#E0F2FE] to-[#FCE7F3] dark:bg-gradient-to-b dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden flex flex-col items-center justify-center px-4 py-12 transition-colors duration-500"
      dir={dir}
    >
      {/* Cartoon animated elements: drifting clouds, smiling crescent moon, stars, balloons */}
      <KidsAnimatedBackground />

      <main className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center">
        {/* Playful Header */}
        <header className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center justify-center gap-2 mb-3 text-4xl sm:text-5xl animate-bounce">
            <span>⭐</span>
            <span className="text-amber-500 dark:text-yellow-300">🎈</span>
            <span>⭐</span>
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-amber-600 dark:text-yellow-300 mb-4 drop-shadow-sm font-kids tracking-wide"
            style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
          >
            {t('kids.title')}
          </h1>

          <p
            className="text-lg sm:text-xl md:text-2xl font-bold text-[#1E293B] bg-white/75 dark:bg-[#F5F2EB] px-8 py-3 rounded-full inline-block shadow-md border border-amber-500/20 backdrop-blur-md transition-colors"
            style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
          >
            {t('kids.subtitle')}
          </p>
        </header>

        {/* Kids Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* Interactive Story Card */}
          <Link
            href="/kids/story"
            className="group flex flex-col items-center justify-between text-center gap-6 bg-white/90 dark:bg-[#F5F2EB] rounded-[2.5rem] p-8 sm:p-10 shadow-xl border-4 border-sky-300/80 dark:border-sky-400/40 hover:border-sky-400 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in-up relative overflow-hidden"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="w-28 h-28 rounded-full bg-sky-100 dark:bg-sky-200/60 flex items-center justify-center text-6xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner">
              📚
            </div>

            <div className="space-y-2">
              <h2
                className="text-3xl sm:text-4xl font-bold text-sky-600 dark:text-sky-700"
                style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
              >
                {t('kids.storyTitle')}
              </h2>
              <p className="text-slate-600 dark:text-slate-700 font-medium text-base sm:text-lg leading-relaxed">
                {t('kids.storyDesc')}
              </p>
            </div>

            <div
              className="w-full mt-2 py-3.5 px-6 rounded-full font-bold text-lg sm:text-xl text-white bg-gradient-to-r from-sky-400 to-sky-500 shadow-md group-hover:shadow-lg transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
            >
              <span>{t('kids.storyBtn')}</span>
              <span className={`transform transition-transform ${isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                {isArabic ? '⬅️' : '➡️'}
              </span>
            </div>
          </Link>

          {/* Matching Game Card */}
          <Link
            href="/kids/game"
            className="group flex flex-col items-center justify-between text-center gap-6 bg-white/90 dark:bg-[#F5F2EB] rounded-[2.5rem] p-8 sm:p-10 shadow-xl border-4 border-amber-300/80 dark:border-amber-400/40 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in-up relative overflow-hidden"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="w-28 h-28 rounded-full bg-amber-100 dark:bg-amber-200/60 flex items-center justify-center text-6xl transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-inner">
              🎮
            </div>

            <div className="space-y-2">
              <h2
                className="text-3xl sm:text-4xl font-bold text-amber-600 dark:text-amber-700"
                style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
              >
                {t('kids.gameTitle')}
              </h2>
              <p className="text-slate-600 dark:text-slate-700 font-medium text-base sm:text-lg leading-relaxed">
                {t('kids.gameDesc')}
              </p>
            </div>

            <div
              className="w-full mt-2 py-3.5 px-6 rounded-full font-bold text-lg sm:text-xl text-white bg-gradient-to-r from-amber-400 to-orange-400 shadow-md group-hover:shadow-lg transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
            >
              <span>{t('kids.gameBtn')}</span>
              <span className={`transform transition-transform ${isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                {isArabic ? '⬅️' : '➡️'}
              </span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
