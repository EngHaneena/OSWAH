'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

const STREAK_STORAGE_KEY = 'oswa_sprouts_streak';
const LAST_CHECKIN_STORAGE_KEY = 'oswa_sprouts_last_checkin';

export default function KidsStreakBadge() {
  const { t, isArabic } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState(3);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const savedStreak = localStorage.getItem(STREAK_STORAGE_KEY);
      const savedLastCheckin = localStorage.getItem(LAST_CHECKIN_STORAGE_KEY);

      if (savedStreak !== null) {
        const parsed = parseInt(savedStreak, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          setStreak(parsed);
        }
      } else {
        // Default to a 3-day encouraging streak
        localStorage.setItem(STREAK_STORAGE_KEY, '3');
        setStreak(3);
      }

      if (savedLastCheckin === todayStr) {
        setHasCheckedInToday(true);
      }
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
    }
  }, []);

  const handleDailyCheckIn = () => {
    if (hasCheckedInToday) return;

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const newStreak = streak + 1;
      setStreak(newStreak);
      setHasCheckedInToday(true);
      setShowCelebration(true);

      localStorage.setItem(STREAK_STORAGE_KEY, newStreak.toString());
      localStorage.setItem(LAST_CHECKIN_STORAGE_KEY, todayStr);

      setTimeout(() => setShowCelebration(false), 3000);
    } catch {
      // Fallback
    }
  };

  const formattedStreak = isArabic ? streak.toLocaleString('ar-EG') : streak.toString();

  if (!mounted) {
    return (
      <div className="h-9 w-36 bg-white/40 dark:bg-white/10 rounded-full animate-pulse" />
    );
  }

  return (
    <div
      aria-label="عداد الستريك اليومي"
      className="relative inline-flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/95 dark:bg-[#F5F2EB] text-[#1E293B] border-2 border-amber-400/60 dark:border-amber-500/40 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-md select-none group"
      title={hasCheckedInToday ? t('kids.streakDoneToday') : t('kids.streakTooltip')}
    >
      {/* Flame Icon & Count */}
      <div className="flex items-center gap-1.5 font-bold">
        <span className="text-xl sm:text-2xl animate-pulse">🔥</span>
        <span
          className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-900 tracking-wide"
          style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
        >
          {t('kids.streakTitle', { days: formattedStreak })}
        </span>
      </div>

      {/* Compact Check-in Action / Status */}
      <button
        onClick={handleDailyCheckIn}
        disabled={hasCheckedInToday}
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1 whitespace-nowrap active:scale-95 ${
          hasCheckedInToday
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-200/90 dark:text-emerald-950 cursor-default'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs hover:scale-105'
        }`}
        style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
        aria-label={hasCheckedInToday ? t('kids.streakDoneToday') : t('kids.streakCheckin')}
      >
        {hasCheckedInToday ? (
          <>
            <span>✓</span>
            <span className="hidden sm:inline">{t('kids.streakDoneToday')}</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span>{t('kids.streakCheckin')}</span>
          </>
        )}
      </button>

      {/* Celebratory Floating Pop */}
      {showCelebration && (
        <span className="absolute -bottom-7 start-1/2 -translate-x-1/2 text-xs font-bold text-emerald-700 dark:text-emerald-800 bg-white/90 dark:bg-[#EFECE4] px-2.5 py-0.5 rounded-full shadow border border-emerald-400 whitespace-nowrap animate-bounce">
          🎉 +1 {isArabic ? 'ستريك متألق!' : 'Streak updated!'}
        </span>
      )}
    </div>
  );
}
