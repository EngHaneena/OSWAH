'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

const SCREEN_TIME_KEY = 'oswa_screen_time_limit';

interface ParentalPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionMinutes: number;
}

export default function ParentalPortalModal({
  isOpen,
  onClose,
  sessionMinutes,
}: ParentalPortalModalProps) {
  const { t, isArabic, dir } = useTranslation();

  // Verification Gate States
  const [num1, setNum1] = useState(7);
  const [num2, setNum2] = useState(8);
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  // Dashboard Tabs: 'progress' | 'screentime' | 'tips'
  const [activeTab, setActiveTab] = useState<'progress' | 'screentime' | 'tips'>('progress');

  // Screen time settings
  const [selectedLimit, setSelectedLimit] = useState<number>(20);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Streak data loaded from localStorage
  const [streakDays, setStreakDays] = useState(3);

  useEffect(() => {
    if (isOpen) {
      // Generate a new multiplication challenge on every open if not verified
      if (!isVerified) {
        const n1 = Math.floor(Math.random() * 4) + 6; // 6 to 9
        const n2 = Math.floor(Math.random() * 4) + 6; // 6 to 9
        setNum1(n1);
        setNum2(n2);
        setUserAnswer('');
        setErrorMsg(false);
      }

      try {
        const savedLimit = localStorage.getItem(SCREEN_TIME_KEY);
        if (savedLimit !== null) {
          setSelectedLimit(parseInt(savedLimit, 10));
        }
        const savedStreak = localStorage.getItem('oswa_sprouts_streak');
        if (savedStreak) {
          setStreakDays(parseInt(savedStreak, 10));
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen, isVerified]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = num1 * num2;
    if (parseInt(userAnswer.trim(), 10) === correct) {
      setIsVerified(true);
      setErrorMsg(false);
    } else {
      setErrorMsg(true);
      // Generate new challenge on wrong answer
      const n1 = Math.floor(Math.random() * 4) + 6;
      const n2 = Math.floor(Math.random() * 4) + 6;
      setNum1(n1);
      setNum2(n2);
      setUserAnswer('');
    }
  };

  const handleSaveScreenTime = () => {
    try {
      localStorage.setItem(SCREEN_TIME_KEY, selectedLimit.toString());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portalTitle"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        dir={dir}
        className="w-full max-w-2xl bg-white/95 dark:bg-[#F5F2EB] text-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--color-gold)]/40 dark:border-amber-500/25 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={t('parentPortal.close')}
          className="absolute top-5 end-5 w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-black bg-black/5 hover:bg-black/10 transition-colors font-bold text-base"
        >
          ✕
        </button>

        {!isVerified ? (
          /* ========================================================
             1. Parental Gatekeeper Challenge (حماية برقم سري / عملية حسابية)
             ======================================================== */
          <div className="text-center py-4 sm:py-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-800 flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
              🛡️
            </div>
            <h2
              id="portalTitle"
              className="text-2xl sm:text-3xl font-bold text-[#22301B] dark:text-[#1E293B] mb-2"
              style={{ fontFamily: isArabic ? 'Aref Ruqaa, serif' : 'inherit' }}
            >
              {t('parentPortal.gateTitle')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-700 max-w-md mx-auto mb-6">
              {t('parentPortal.gatePrompt')}
            </p>

            <form onSubmit={handleGateSubmit} className="max-w-xs mx-auto space-y-4">
              <div className="p-4 rounded-2xl bg-[var(--color-surface)] dark:bg-[#EFECE4] border border-[var(--color-gold)]/30 dark:border-amber-500/30 text-2xl sm:text-3xl font-extrabold text-amber-900 tracking-wider">
                {num1} × {num2} = ?
              </div>

              <input
                type="number"
                inputMode="numeric"
                autoFocus
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={t('parentPortal.gatePlaceholder')}
                className="w-full text-center px-4 py-3 text-xl font-bold rounded-xl border border-slate-300 dark:border-slate-400 bg-white dark:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              {errorMsg && (
                <p className="text-xs sm:text-sm font-bold text-red-600 animate-fade-in-up">
                  {t('parentPortal.gateError')}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md transition-all active:scale-95 text-base"
              >
                {t('parentPortal.gateSubmit')}
              </button>
            </form>
          </div>
        ) : (
          /* ========================================================
             2. Parental Dashboard (لوحة تحكم ولي الأمر)
             ======================================================== */
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-2xl sm:text-3xl text-amber-700 dark:text-amber-800 mb-1">
                <span>🛡️</span>
                <h2
                  id="portalTitle"
                  className="font-bold text-[#22301B] dark:text-[#1E293B]"
                  style={{ fontFamily: isArabic ? 'Aref Ruqaa, serif' : 'inherit' }}
                >
                  {t('parentPortal.dashboardTitle')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-700">
                {t('parentPortal.dashboardSubtitle')}
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-black/5 dark:bg-black/5 mb-6">
              <button
                onClick={() => setActiveTab('progress')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === 'progress'
                    ? 'bg-white dark:bg-[#EFECE4] text-amber-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📊 {t('parentPortal.tabProgress')}
              </button>
              <button
                onClick={() => setActiveTab('screentime')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === 'screentime'
                    ? 'bg-white dark:bg-[#EFECE4] text-amber-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⏳ {t('parentPortal.tabScreenTime')}
              </button>
              <button
                onClick={() => setActiveTab('tips')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === 'tips'
                    ? 'bg-white dark:bg-[#EFECE4] text-amber-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                💡 {t('parentPortal.tabTips')}
              </button>
            </div>

            {/* Tab 1: Child Progress & Activity */}
            {activeTab === 'progress' && (
              <div className="space-y-4 animate-fade-in-up">
                {/* Streak Highlight */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🔥</span>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-amber-900 dark:text-amber-900">
                        {t('parentPortal.streakDays')}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-700">
                        {t('parentPortal.streakDesc', { days: streakDays })}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-extrabold text-sm shadow-xs">
                    {streakDays} {isArabic ? 'أيام' : 'days'}
                  </span>
                </div>

                {/* Completed Stories Card */}
                <div className="p-4 rounded-2xl bg-[var(--color-surface)] dark:bg-[#EFECE4] border border-slate-200 dark:border-slate-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <span>📚</span>
                      <span>{t('parentPortal.completedStories')}</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {t('parentPortal.storyStatusDone')}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-800">
                    {t('parentPortal.story1')}
                  </p>
                </div>

                {/* Quiz & Matching Game Card */}
                <div className="p-4 rounded-2xl bg-[var(--color-surface)] dark:bg-[#EFECE4] border border-slate-200 dark:border-slate-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <span>🎮</span>
                      <span>{t('parentPortal.quizTitle')}</span>
                    </span>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {t('parentPortal.quizScore')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-300 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                {/* Sprouts Challenge Card */}
                <div className="p-4 rounded-2xl bg-[var(--color-surface)] dark:bg-[#EFECE4] border border-slate-200 dark:border-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">⚔️</span>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-800">
                        {t('parentPortal.challengeTitle')}
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-700">
                        {t('parentPortal.challengeDone')}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg">🏆</span>
                </div>
              </div>
            )}

            {/* Tab 2: Screen Time & Breaks */}
            {activeTab === 'screentime' && (
              <div className="space-y-5 animate-fade-in-up">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-800 mb-1">
                    {t('parentPortal.screenTimeTitle')}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-700">
                    {t('parentPortal.screenTimeDesc')}
                  </p>
                </div>

                {/* Current Elapsed Time */}
                <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-100 border border-sky-200 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-sky-900">
                    ⏱️ {t('parentPortal.sessionElapsed')}
                  </span>
                  <span className="text-sm font-extrabold text-sky-800">
                    {sessionMinutes} {t('parentPortal.minutes')}
                  </span>
                </div>

                {/* Limit Options */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 15, label: t('parentPortal.limit15') },
                    { value: 20, label: t('parentPortal.limit20') },
                    { value: 30, label: t('parentPortal.limit30') },
                    { value: 0, label: t('parentPortal.limitNone') },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedLimit(opt.value)}
                      className={`p-3 rounded-2xl border-2 text-center font-bold text-xs sm:text-sm transition-all ${
                        selectedLimit === opt.value
                          ? 'border-amber-500 bg-amber-100/70 dark:bg-amber-200 text-amber-900 shadow-sm'
                          : 'border-slate-200 dark:border-slate-300 bg-white dark:bg-[#EFECE4] text-slate-700 hover:border-amber-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleSaveScreenTime}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-amber-600 hover:bg-amber-700 shadow transition-all active:scale-95"
                  >
                    {t('parentPortal.saveLimit')}
                  </button>
                  {saveSuccess && (
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-800">
                      ✓ {t('parentPortal.savedSuccess')}
                    </span>
                  )}
                </div>

                {/* Break Notification Preview Box */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-100/70 border border-amber-300/60">
                  <span className="text-xs font-bold text-amber-900 block mb-1">
                    {t('parentPortal.breakPreviewTitle')}
                  </span>
                  <p className="text-xs text-amber-800 italic leading-relaxed">
                    «{t('parentPortal.breakNotificationMessage')}»
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Prophetic Behavioral Parenting Tips */}
            {activeTab === 'tips' && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#EFECE4] border border-[var(--color-gold)]/30 dark:border-amber-500/25">
                  <h5 className="font-bold text-sm text-amber-900 dark:text-amber-900 mb-1 flex items-center gap-1.5">
                    <span>🌱</span>
                    <span>{t('parentPortal.tip1Title')}</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-800 leading-relaxed font-medium">
                    {t('parentPortal.tip1Text')}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#EFECE4] border border-[var(--color-gold)]/30 dark:border-amber-500/25">
                  <h5 className="font-bold text-sm text-amber-900 dark:text-amber-900 mb-1 flex items-center gap-1.5">
                    <span>🕊️</span>
                    <span>{t('parentPortal.tip2Title')}</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-800 leading-relaxed font-medium">
                    {t('parentPortal.tip2Text')}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#EFECE4] border border-[var(--color-gold)]/30 dark:border-amber-500/25">
                  <h5 className="font-bold text-sm text-amber-900 dark:text-amber-900 mb-1 flex items-center gap-1.5">
                    <span>😊</span>
                    <span>{t('parentPortal.tip3Title')}</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-800 leading-relaxed font-medium">
                    {t('parentPortal.tip3Text')}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#EFECE4] border border-[var(--color-gold)]/30 dark:border-amber-500/25">
                  <h5 className="font-bold text-sm text-amber-900 dark:text-amber-900 mb-1 flex items-center gap-1.5">
                    <span>🤲</span>
                    <span>{t('parentPortal.tip4Title')}</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-800 leading-relaxed font-medium">
                    {t('parentPortal.tip4Text')}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
