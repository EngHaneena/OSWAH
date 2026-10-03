'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { IslamicDivider } from '@/components/ornaments/IslamicPattern';

export default function PrivacyPage() {
  const { t, isArabic, dir } = useTranslation();

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8" dir={dir}>
      <main className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-gold)] hover:underline mb-6"
        >
          <span>{isArabic ? '←' : '→'}</span>
          <span>{t('privacy.backHome')}</span>
        </Link>

        <article className="bg-[var(--color-surface)] dark:bg-[#1b2614] rounded-3xl p-6 sm:p-10 shadow-sm border border-[var(--color-gold)]/25 backdrop-blur-md">
          <header className="mb-6">
            <h1
              className="text-3xl sm:text-4xl text-[var(--color-ink)] dark:text-[var(--color-cream)] mb-2"
              style={{ fontFamily: 'Aref Ruqaa, serif' }}
            >
              {t('privacy.title')}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-ink-light)] dark:text-[#a0a896] leading-relaxed">
              {t('privacy.intro')}
            </p>
          </header>

          <IslamicDivider />

          <div className="space-y-8 text-xs sm:text-sm text-[var(--color-ink)] dark:text-[#e4ddcc] leading-relaxed mt-6">
            {/* Section 1 */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-olive)] dark:text-[var(--color-gold-light)]">
                {t('privacy.section1Title')}
              </h2>
              <p>{t('privacy.section1Text')}</p>
              <ul className="list-disc list-inside space-y-1.5 text-[var(--color-ink-light)] dark:text-[#c4ceb8] pe-2">
                <li>{t('privacy.section1Item1')}</li>
                <li>{t('privacy.section1Item2')}</li>
                <li>{t('privacy.section1Item3')}</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-olive)] dark:text-[var(--color-gold-light)]">
                {t('privacy.section2Title')}
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-[var(--color-ink-light)] dark:text-[#c4ceb8] pe-2">
                <li>{t('privacy.section2Item1')}</li>
                <li>{t('privacy.section2Item2')}</li>
                <li>{t('privacy.section2Item3')}</li>
                <li>{t('privacy.section2Item4')}</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-olive)] dark:text-[var(--color-gold-light)]">
                {t('privacy.section3Title')}
              </h2>
              <p className="text-[var(--color-ink-light)] dark:text-[#c4ceb8]">
                {t('privacy.section3Text')}
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-olive)] dark:text-[var(--color-gold-light)]">
                {t('privacy.section4Title')}
              </h2>
              <p className="text-[var(--color-ink-light)] dark:text-[#c4ceb8]">
                {t('privacy.section4Text')}
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
