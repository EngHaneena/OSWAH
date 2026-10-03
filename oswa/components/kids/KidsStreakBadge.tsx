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
      <div className="h-16 w-full max-w-md mx-auto mb-6 bg-white/40 dark:bg-white/10 rounded-3xl animate-pulse" />
    );
  }

  return (
    <section
      aria-label="عداد الستريك اليومي"
      className="relative w-full max-w-xl mx-auto mb-8 bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 dark:from-amber-950/60 dark:via-orange-950/40 dark:to-amber-950/60 p-4 sm:p-5 rounded-3xl border-2 border-amber-400/60 dark:border-amber-500/40 shadow-lg text-center backdrop-blur-md transition-all duration-300 transform hover:scale-[1.01]"
    >
      {/* Decorative fire glow effect */}
      <div className="absolute -top-3 -start-3 text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
        🔥
      </div>
      <div className="absolute -top-3 -end-3 text-2xl animate-bounce" style={{ animationDuration: '2.4s', animationDelay: '0.4s' }}>
        ✨
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Streak Flame & Count Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md text-3xl animate-pulse">
            🔥
            {showCelebration && (
              <span className="absolute -top-2 -end-2 text-xl animate-ping">
                ⭐
              </span>
            )}
          </div>

          <div className="text-start">
            <h2
              className="text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-200"
              style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
            >
              {t('kids.streakTitle', { days: formattedStreak })}
            </h2>
            <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 font-medium">
              {hasCheckedInToday
                ? t('kids.streakDoneToday')
                : t('kids.streakTooltip')}
            </p>
          </div>
        </div>

        {/* Daily Action Check-in Button */}
        <button
          onClick={handleDailyCheckIn}
          disabled={hasCheckedInToday}
          className={`px-4 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 shadow-md flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
            hasCheckedInToday
              ? 'bg-emerald-500 text-white cursor-default shadow-emerald-500/20'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:shadow-lg hover:scale-105'
          }`}
          style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
        >
          {hasCheckedInToday ? (
            <>
              <span>✓</span>
              <span>{t('kids.streakDoneToday')}</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>{t('kids.streakCheckin')}</span>
            </>
          )}
        </button>
      </div>

      {showCelebration && (
        <div className="mt-2 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in-up">
          🎉 {isArabic ? 'رائع جداً! تم تسجيل حضورك اليومي بنجاح!' : 'Awesome! Daily streak saved successfully!'}
        </div>
      )}
    </section>
  );
}
