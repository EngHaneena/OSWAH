'use client';

import React from 'react';
import Link from 'next/link';
import { team, projectRepo, challengeUrl } from '@/config/team';
import { useTranslation } from '@/lib/i18n';
import { IslamicDivider } from '@/components/ornaments/IslamicPattern';

export default function TeamPage() {
  const { t, locale, isArabic, dir } = useTranslation();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" dir={dir}>
      <main className="max-w-xl mx-auto flex flex-col items-center">
        {/* Top Back Link */}
        <div className="w-full flex justify-start mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-gold)] hover:underline"
          >
            <span>{isArabic ? '←' : '→'}</span>
            <span>{t('team.backHome')}</span>
          </Link>
        </div>

        {/* Central Header */}
        <header className="text-center mb-8 w-full animate-fade-in-up">
          {/* Logo / Brand Name */}
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="text-[var(--color-gold)] text-xl">✦</span>
            <h1
              className="text-4xl sm:text-5xl text-[var(--color-ink)] dark:text-[var(--color-cream)] tracking-wide"
              style={{ fontFamily: 'Aref Ruqaa, serif' }}
            >
              {t('nav.siteName')}
            </h1>
            <span className="text-[var(--color-gold)] text-xl">✦</span>
          </div>

          {/* Subtitle & Challenge */}
          <p className="text-xs sm:text-sm text-[var(--color-ink-light)] dark:text-[#c4ceb8] max-w-md mx-auto leading-relaxed mb-4">
            {t('team.subtitle')}
          </p>

          <a
            href={challengeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--color-gold)]/15 border border-[var(--color-gold)]/30 text-xs font-semibold text-[var(--color-olive)] dark:text-[var(--color-gold-light)] hover:bg-[var(--color-gold)]/25 transition-all shadow-sm"
          >
            <span>🏆</span>
            <span>{t('team.challengeBadge')}</span>
            <span className="text-[10px] opacity-70">↗</span>
          </a>
        </header>

        <div className="w-full mb-8">
          <IslamicDivider />
        </div>

        {/* Team Cards (Linktree style) */}
        <div className="w-full flex flex-col gap-4">
          {team.map((member, index) => {
            const isLead = index === 0;
            const name = member.name[locale] || member.name.ar;
            const role = member.role[locale] || member.role.ar;
            const hasLinks = Boolean(member.linkedin || member.github);

            return (
              <div
                key={member.name.ar}
                className={`w-full rounded-2xl transition-all duration-300 border backdrop-blur-md animate-fade-in-up ${
                  isLead
                    ? 'p-6 bg-[var(--color-surface)] dark:bg-[#1b2614] border-[var(--color-gold)]/40 shadow-md ring-1 ring-[var(--color-gold)]/20'
                    : 'p-5 bg-[var(--color-surface)]/80 dark:bg-[#1b2614]/80 border-[var(--color-gold)]/20 shadow-sm hover:shadow hover:border-[var(--color-gold)]/40'
                }`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
                  {/* Name, Badge, Role */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <h3
                        className={`font-bold text-[var(--color-ink)] dark:text-[var(--color-cream)] ${
                          isLead ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                        }`}
                      >
                        {name}
                      </h3>
                      {isLead && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-olive)] text-[var(--color-cream)] shadow-sm">
                          {t('team.leadRole')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-ink-light)] dark:text-[#a0a896] leading-relaxed">
                      {role}
                    </p>
                  </div>

                  {/* Action Icons (LinkedIn & GitHub only when available) */}
                  {hasLinks && (
                    <div className="flex items-center gap-2.5 shrink-0">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t('team.linkedinAria', { name })}
                          title={`LinkedIn — ${name}`}
                          className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--color-gold)]/30 bg-white/60 dark:bg-black/20 text-[var(--color-olive)] dark:text-[var(--color-gold-light)] hover:bg-[var(--color-gold)]/15 hover:scale-105 active:scale-95 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
                        >
                          {/* LinkedIn SVG */}
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}

                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t('team.githubAria', { name })}
                          title={`GitHub — ${name}`}
                          className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--color-gold)]/30 bg-white/60 dark:bg-black/20 text-[var(--color-ink)] dark:text-[var(--color-cream)] hover:bg-[var(--color-gold)]/15 hover:scale-105 active:scale-95 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
                        >
                          {/* GitHub SVG */}
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Project Repo Link (only shown if not empty) */}
        {projectRepo && projectRepo.trim() !== '' && (
          <div className="mt-8 w-full text-center">
            <a
              href={projectRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-olive)] text-[var(--color-cream)] text-xs font-bold hover:bg-[var(--color-ink)] transition-colors shadow-sm"
            >
              <span>{t('team.projectRepo')}</span>
              <span>↗</span>
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
