'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';

export default function SiteFooter() {
  const pathname = usePathname();
  const { t, dir } = useTranslation();
  const isKids = pathname.startsWith('/kids');

  return (
    <footer
      className={`w-full mt-auto relative z-10 border-t border-[var(--color-gold)]/20 ${
        isKids
          ? 'bg-[#FFF8F0]/80 dark:bg-[#1a2517]/80'
          : 'bg-[var(--color-surface)]/80 dark:bg-[#151f0f]/80'
      } backdrop-blur-md transition-colors`}
      dir={dir}
    >
      {/* Decorative thin line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center gap-5 text-center">
        {/* Challenge Link */}
        <div>
          <a
            href="https://islamicaich.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--color-olive)] dark:text-[var(--color-gold-light)] hover:text-[var(--color-ink)] dark:hover:text-white transition-colors"
          >
            <span>🏆</span>
            <span>{t('footer.challengeText')}</span>
            <span className="text-[10px] opacity-70">↗</span>
          </a>
        </div>

        {/* Links and Team LinkedIn Icon */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[var(--color-ink-light)] dark:text-[#c4ceb8]">
          <Link
            href="/privacy"
            className="hover:text-[var(--color-gold)] transition-colors"
          >
            {t('footer.privacy')}
          </Link>
          <span className="text-[var(--color-gold)]/40" aria-hidden="true">•</span>
          <Link
            href="/team"
            className="hover:text-[var(--color-gold)] transition-colors"
          >
            {t('footer.team')}
          </Link>
          <span className="text-[var(--color-gold)]/40" aria-hidden="true">•</span>

          {/* LinkedIn Icon Link to /team */}
          <Link
            href="/team"
            aria-label={t('footer.teamAccounts')}
            title={t('footer.teamAccounts')}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[var(--color-gold)]/30 text-[var(--color-olive)] dark:text-[var(--color-gold-light)] hover:bg-[var(--color-gold)]/15 hover:scale-110 transition-all"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </Link>
        </div>

        {/* AI Transparency Line */}
        <p className="text-[11px] text-[var(--color-ink-light)] dark:text-[#8e9986] max-w-md">
          {t('footer.transparency')}
        </p>

        {/* Copyright */}
        <p className="text-[10px] text-[var(--color-gold)] opacity-75 font-quran">
          {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
