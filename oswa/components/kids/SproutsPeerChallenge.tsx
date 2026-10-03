'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

interface Buddy {
  id: string;
  nameAr: string;
  nameEn: string;
  avatar: string;
  gradient: string;
}

const PRESET_BUDDIES: Buddy[] = [
  { id: 'sara', nameAr: 'سارة', nameEn: 'Sara', avatar: '🌸', gradient: 'from-pink-400 to-rose-400' },
  { id: 'omar', nameAr: 'عمر', nameEn: 'Omar', avatar: '🚀', gradient: 'from-sky-400 to-blue-500' },
  { id: 'zaid', nameAr: 'زيد', nameEn: 'Zaid', avatar: '⭐', gradient: 'from-amber-400 to-yellow-500' },
  { id: 'maryam', nameAr: 'مريم', nameEn: 'Maryam', avatar: '🎈', gradient: 'from-purple-400 to-fuchsia-500' },
];

export default function SproutsPeerChallenge() {
  const { t, isArabic, dir } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBuddyId, setSelectedBuddyId] = useState<string>('sara');
  const [customBuddyName, setCustomBuddyName] = useState<string>('');
  const [challengeType, setChallengeType] = useState<'seerah' | 'sunnah'>('sunnah');
  const [userProgress, setUserProgress] = useState<number>(30);
  const [buddyProgress, setBuddyProgress] = useState<number>(60);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const activeBuddy = PRESET_BUDDIES.find((b) => b.id === selectedBuddyId);
  const displayedBuddyName = customBuddyName.trim()
    ? customBuddyName.trim()
    : isArabic
    ? activeBuddy?.nameAr || 'سارة'
    : activeBuddy?.nameEn || 'Sara';
  const displayedBuddyAvatar = customBuddyName.trim() ? '🤝' : activeBuddy?.avatar || '🌸';

  const handleAdvanceUser = () => {
    if (userProgress >= 100) return;
    const nextVal = Math.min(100, userProgress + 35);
    setUserProgress(nextVal);
    if (nextVal >= 100) {
      setIsCompleted(true);
      setBuddyProgress(100);
    }
  };

  const handleReset = () => {
    setUserProgress(30);
    setBuddyProgress(60);
    setIsCompleted(false);
  };

  return (
    <>
      {/* 1. Sprouts Challenge Launch Card on Kids Menu */}
      <div className="w-full max-w-3xl mt-8">
        <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-amber-100 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-amber-950/40 rounded-[2.5rem] p-6 sm:p-8 border-4 border-purple-300/70 dark:border-purple-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 transition-transform duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-4xl sm:text-5xl shadow-md text-white animate-bounce" style={{ animationDuration: '3s' }}>
              ⚔️
            </div>
            <div className="text-start">
              <h3
                className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-purple-200 mb-1"
                style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
              >
                {t('kids.challengeCardTitle')}
              </h3>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-md font-medium leading-relaxed">
                {t('kids.challengeCardDesc')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              handleReset();
              setIsOpen(true);
            }}
            className="w-full md:w-auto px-7 py-3.5 rounded-full font-bold text-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
            style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
          >
            <span>{t('kids.challengeBtn')}</span>
            <span className={`transform transition-transform ${isArabic ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>
              {isArabic ? '⬅️' : '➡️'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Peer Challenge Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-fade-in-up"
          role="dialog"
          aria-modal="true"
          aria-labelledby="peerChallengeTitle"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            dir={dir}
            className="w-full max-w-2xl bg-white/95 dark:bg-[#F5F2EB] text-[#1E293B] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-4 border-purple-400/50 dark:border-purple-600/40 relative max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label={t('kids.close')}
              className="absolute top-5 end-5 w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-black bg-black/5 hover:bg-black/10 transition-colors font-bold text-lg"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <span className="text-4xl">⚔️</span>
              <h2
                id="peerChallengeTitle"
                className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-purple-900 mt-2"
                style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
              >
                {t('kids.challengeModalTitle')}
              </h2>
            </div>

            {/* Step 1: Select Buddy */}
            <div className="mb-6">
              <label
                className="block text-sm sm:text-base font-bold text-slate-800 dark:text-slate-800 mb-2.5"
                style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
              >
                {t('kids.chooseBuddy')}
              </label>

              {/* Avatar Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {PRESET_BUDDIES.map((buddy) => {
                  const isSelected = selectedBuddyId === buddy.id && !customBuddyName.trim();
                  return (
                    <button
                      key={buddy.id}
                      type="button"
                      onClick={() => {
                        setSelectedBuddyId(buddy.id);
                        setCustomBuddyName('');
                      }}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-100/70 dark:bg-purple-200/80 scale-105 shadow-md'
                          : 'border-slate-200 dark:border-slate-300 hover:border-purple-300 bg-slate-50 dark:bg-white'
                      }`}
                    >
                      <span className="text-3xl">{buddy.avatar}</span>
                      <span
                        className="font-bold text-sm text-slate-800"
                        style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
                      >
                        {isArabic ? buddy.nameAr : buddy.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Friend Name Option */}
              <input
                type="text"
                value={customBuddyName}
                onChange={(e) => setCustomBuddyName(e.target.value)}
                placeholder={t('kids.customBuddyPlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-400 bg-white dark:bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
              />
            </div>

            {/* Step 2: Select Challenge Type */}
            <div className="mb-6">
              <label
                className="block text-sm sm:text-base font-bold text-slate-800 dark:text-slate-800 mb-2.5"
                style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
              >
                {t('kids.chooseChallengeType')}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setChallengeType('seerah')}
                  className={`p-3.5 rounded-2xl border-2 text-start transition-all flex items-start gap-2.5 ${
                    challengeType === 'seerah'
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-100 shadow-md'
                      : 'border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-white'
                  }`}
                >
                  <span className="text-2xl">📖</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-800">
                    {t('kids.challengeTypeSeerah')}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setChallengeType('sunnah')}
                  className={`p-3.5 rounded-2xl border-2 text-start transition-all flex items-start gap-2.5 ${
                    challengeType === 'sunnah'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-100 shadow-md'
                      : 'border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-white'
                  }`}
                >
                  <span className="text-2xl">😊</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-800">
                    {t('kids.challengeTypeSunnah')}
                  </div>
                </button>
              </div>
            </div>

            {/* Step 3: Versus Mode Badge & Progress Bars */}
            <div className="bg-purple-50/70 dark:bg-purple-100/70 rounded-3xl p-5 border border-purple-200 mb-6">
              {/* VS Header */}
              <div className="flex items-center justify-around text-center mb-4">
                {/* You */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-2xl shadow-md">
                    🌟
                  </div>
                  <span
                    className="font-bold text-sm text-slate-800 mt-1"
                    style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
                  >
                    {t('kids.you')}
                  </span>
                </div>

                {/* VS Badge */}
                <div className="px-3 py-1 rounded-full bg-purple-600 text-white font-extrabold text-sm sm:text-base tracking-wider shadow animate-pulse">
                  {t('kids.vs')}
                </div>

                {/* Buddy */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-2xl shadow-md">
                    {displayedBuddyAvatar}
                  </div>
                  <span
                    className="font-bold text-sm text-slate-800 mt-1"
                    style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
                  >
                    {displayedBuddyName}
                  </span>
                </div>
              </div>

              {/* Progress: User */}
              <div className="mb-3">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>{t('kids.you')} (🌟)</span>
                  <span>{userProgress}%</span>
                </div>
                <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${userProgress}%` }}
                  />
                </div>
              </div>

              {/* Progress: Buddy */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>{displayedBuddyName} ({displayedBuddyAvatar})</span>
                  <span>{buddyProgress}%</span>
                </div>
                <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${buddyProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Celebration or Action Button */}
            {isCompleted ? (
              <div className="text-center p-4 bg-emerald-100 rounded-2xl border-2 border-emerald-400 animate-bounce mb-4">
                <div className="text-4xl mb-1">🎉🏆🎉</div>
                <p
                  className="font-bold text-emerald-900 text-base sm:text-lg"
                  style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
                >
                  {t('kids.congratsMessage')}
                </p>
                <button
                  onClick={handleReset}
                  className="mt-3 px-5 py-2 rounded-full font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  {isArabic ? 'العب تحدياً آخر 🔄' : 'Play Another Challenge 🔄'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAdvanceUser}
                  className="flex-1 py-3 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
                >
                  <span>⭐</span>
                  <span>
                    {challengeType === 'seerah'
                      ? isArabic
                        ? 'قرأت فقرة من القصة! 📖'
                        : 'Read a story paragraph! 📖'
                      : isArabic
                      ? 'تبسمت في وجه أخي! 😊'
                      : 'Smiled at someone! 😊'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserProgress(100);
                    setBuddyProgress(100);
                    setIsCompleted(true);
                  }}
                  className="py-3 px-5 rounded-2xl font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 border border-purple-300 transition-colors"
                  style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}
                >
                  {t('kids.completeChallenge')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
