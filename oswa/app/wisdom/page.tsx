'use client';

import { useState } from 'react';
import { IslamicDivider, ProphetGlow } from '@/components/ornaments/IslamicPattern';
import WisdomResult from '@/components/cards/WisdomResult';
import WisdomTilesCarousel from '@/components/wisdom/WisdomTilesCarousel';
import { useTranslation } from '@/lib/i18n';

export default function WisdomPage() {
  const { t, locale, isArabic, dir } = useTranslation();
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const emotionTags = [
    { key: 'loneliness', label: t('wisdom.tags.loneliness'), icon: '🌑' },
    { key: 'grief', label: t('wisdom.tags.grief'), icon: '💧' },
    { key: 'anxiety', label: t('wisdom.tags.anxiety'), icon: '🌊' },
    { key: 'anger', label: t('wisdom.tags.anger'), icon: '⚡' },
    { key: 'fatigue', label: t('wisdom.tags.fatigue'), icon: '🌿' },
    { key: 'disappointment', label: t('wisdom.tags.disappointment'), icon: '🌧️' },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!problem.trim() || problem.trim().length < 3) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/wisdom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, locale }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError(isArabic ? 'حدث خطأ في الاتصال. يُرجى المحاولة.' : 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function appendTag(label: string) {
    setProblem(p => (p ? `${p}، ${label}` : label));
  }

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      <main className="flex-1 px-4 py-6 sm:py-8 max-w-4xl mx-auto w-full">
        {/* 1. Hero Banner: Auto-Rotating Prophetic Tiles Carousel */}
        <WisdomTilesCarousel />

        {/* 2. رأس الصفحة */}
        <header className="text-center mb-8 animate-fade-in-up mt-6">
          <div className="flex justify-center mb-4">
            <ProphetGlow className="w-20 h-20" />
          </div>
          <h1
            className="text-4xl md:text-5xl text-[#22301B] brand-title mb-3"
            style={{ fontFamily: isArabic ? 'Aref Ruqaa, serif' : 'inherit' }}
          >
            {t('wisdom.heroTitle')}
          </h1>
          <p className="text-[#4A6038] dark:text-[#a5bfa0] text-base md:text-lg max-w-xl mx-auto">
            {t('wisdom.heroSubtitle')}
          </p>
        </header>

        {/* وسوم المشاعر العائمة */}
        <div className="relative h-20 mb-2 flex items-center justify-center pointer-events-none" aria-hidden="true">
          {emotionTags.map((tag, i) => {
            const left = `${10 + i * 14}%`;
            const top = `${i % 2 === 0 ? 5 : 35}px`;
            const delay = `${i * 0.6}s`;

            return (
              <div
                key={tag.key}
                className="absolute animate-float"
                style={{ left, top, animationDelay: delay }}
              >
                <button
                  type="button"
                  onClick={() => appendTag(tag.label)}
                  className="pointer-events-auto text-xs sm:text-sm font-medium text-[#3F5233] dark:text-[#1E293B] bg-white/85 dark:bg-[#F5F2EB] border border-[#B89B5E]/30 dark:border-amber-500/20 rounded-full px-3.5 py-1.5 hover:bg-[#3F5233] hover:text-white dark:hover:bg-amber-100 hover:scale-105 shadow-sm backdrop-blur-sm transition-all"
                >
                  {tag.icon} {tag.label}
                </button>
              </div>
            );
          })}
        </div>

        {/* نموذج الإدخال */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white/70 dark:bg-[#F5F2EB] p-6 rounded-[2rem] shadow-sm border border-[#B89B5E]/20 dark:border-amber-500/20 animate-fade-in-up relative z-10"
          style={{ animationDelay: '0.1s' }}
        >
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder={t('wisdom.inputPlaceholder')}
            maxLength={2000}
            rows={5}
            className="w-full rounded-2xl border border-[#3F5233]/20 dark:border-amber-500/20 bg-white dark:bg-[#EFECE4] text-[#22301B] dark:text-[#1E293B] placeholder-[#B89B5E]/80 dark:placeholder-slate-500 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#3F5233] focus:border-transparent resize-none mb-3 text-base md:text-lg leading-relaxed shadow-inner transition-colors"
            aria-label={t('wisdom.heroTitle')}
          />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-[#B89B5E] font-medium">{problem.length}/2000</span>
            <button
              type="submit"
              disabled={loading || problem.trim().length < 3}
              className="w-full sm:w-auto bg-[#3F5233] hover:bg-[#22301B] text-[#F6F1E3] rounded-xl px-8 py-3.5 font-bold text-base md:text-lg transition-all disabled:opacity-50 disabled:scale-100 hover:scale-105 active:scale-95 shadow-md focus-visible:ring-4 focus-visible:ring-[#B89B5E] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ms-1 me-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t('wisdom.btnSearching')}</span>
                </>
              ) : (
                t('wisdom.btnSearch')
              )}
            </button>
          </div>
        </form>

        {error && (
          <div role="alert" className="bg-red-50 text-red-700 border border-red-200 rounded-2xl px-5 py-4 mb-6 text-center animate-fade-in-up">
            {error}
          </div>
        )}

        {result && <WisdomResult data={result} problem={problem} />}

        <div className="mt-12 text-center pb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <IslamicDivider className="w-full max-w-sm mx-auto mb-6 opacity-50" />
          <p className="text-xs text-[#4A6038] dark:text-[#8ea781]">
            ⚠️ {t('wisdom.disclaimer')}
          </p>
        </div>
      </main>
    </div>
  );
}
