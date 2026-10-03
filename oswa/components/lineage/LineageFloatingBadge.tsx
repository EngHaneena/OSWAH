'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';

interface LineageFloatingBadgeProps {
  onClick: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  isHighlighted: boolean;
}

export default function LineageFloatingBadge({
  onClick,
  onHoverStart,
  onHoverEnd,
  isHighlighted,
}: LineageFloatingBadgeProps) {
  const { t, isArabic } = useTranslation();

  return (
    <div className="fixed bottom-5 start-5 sm:bottom-6 sm:start-6 z-30">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        onFocus={onHoverStart}
        onBlur={onHoverEnd}
        aria-label={t('lineage.badgeTitle')}
        title={t('lineage.badgeTooltip')}
        className={`group relative inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-xl backdrop-blur-md active:scale-95 cursor-pointer border ${
          isHighlighted
            ? 'bg-[var(--color-olive)] text-[var(--color-cream)] border-amber-400/60 ring-2 ring-amber-400/40'
            : 'bg-white/90 dark:bg-[#F5F2EB]/95 text-[#22301B] dark:text-[#1E293B] border-[var(--color-gold)]/40 dark:border-amber-500/30 hover:border-[var(--color-gold)]'
        }`}
      >
        {/* Scroll Icon with gentle hover rotation */}
        <span className="text-base sm:text-lg transform group-hover:scale-110 transition-transform">
          📜
        </span>

        {/* Badge Label */}
        <span
          className="text-xs sm:text-sm font-bold tracking-wide"
          style={{ fontFamily: isArabic ? 'Aref Ruqaa, serif' : 'inherit' }}
        >
          {t('lineage.badgeTitle')}
        </span>

        {/* Subtle Visual Eye / Sparkle Hint */}
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            isHighlighted
              ? 'bg-amber-300 animate-ping'
              : 'bg-[var(--color-gold)] opacity-70 group-hover:opacity-100'
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
