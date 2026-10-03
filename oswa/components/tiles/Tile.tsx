'use client';

import React from 'react';
import { TileData, getLocalizedText } from './types';
import { useTranslation } from '@/lib/i18n';
import { UI_TRANSLATIONS } from './tilesData';

interface TileProps {
  tile: TileData;
  onClick: (tile: TileData) => void;
  style?: React.CSSProperties;
  className?: string;
  isFloating?: boolean;
}

const colorMap = {
  olive: {
    border: 'border-[#3F5233]/30 dark:border-amber-500/20',
    hoverBorder: 'hover:border-[#3F5233] dark:hover:border-amber-400/60',
    badgeBg: 'bg-[#3F5233]/10 text-[#3F5233] dark:bg-[#3F5233]/15 dark:text-[#2d4023]',
    title: 'text-[#22301B] dark:text-[#1E293B]',
    accentDot: 'bg-[#3F5233] dark:bg-[#4d663d]',
  },
  gold: {
    border: 'border-[#B89B5E]/30 dark:border-amber-500/25',
    hoverBorder: 'hover:border-[#B89B5E] dark:hover:border-amber-400/60',
    badgeBg: 'bg-[#B89B5E]/15 text-[#8f743c] dark:bg-amber-100 dark:text-[#8B6914]',
    title: 'text-[#22301B] dark:text-[#1E293B]',
    accentDot: 'bg-[#B89B5E] dark:bg-[#D4AF37]',
  },
  sand: {
    border: 'border-[#D4B97A]/35 dark:border-amber-500/20',
    hoverBorder: 'hover:border-[#D4B97A] dark:hover:border-amber-400/60',
    badgeBg: 'bg-[#EDE5CF] text-[#5c4923] dark:bg-[#EFECE4] dark:text-[#5c4923]',
    title: 'text-[#22301B] dark:text-[#1E293B]',
    accentDot: 'bg-[#D4B97A] dark:bg-[#B89B5E]',
  },
  sage: {
    border: 'border-[#52B788]/30 dark:border-amber-500/20',
    hoverBorder: 'hover:border-[#52B788] dark:hover:border-amber-400/60',
    badgeBg: 'bg-[#52B788]/15 text-[#2d6a4f] dark:bg-emerald-100 dark:text-[#1b4332]',
    title: 'text-[#22301B] dark:text-[#1E293B]',
    accentDot: 'bg-[#52B788] dark:bg-[#2d6a4f]',
  },
  clay: {
    border: 'border-[#C86D51]/30 dark:border-amber-500/20',
    hoverBorder: 'hover:border-[#C86D51] dark:hover:border-amber-400/60',
    badgeBg: 'bg-[#C86D51]/15 text-[#9a452c] dark:bg-orange-100 dark:text-[#7f260f]',
    title: 'text-[#22301B] dark:text-[#1E293B]',
    accentDot: 'bg-[#C86D51] dark:bg-[#9a452c]',
  },
};

const sizeClasses = {
  sm: 'w-56 p-3.5 text-xs',
  md: 'w-64 p-4 text-xs',
  lg: 'w-72 p-5 text-sm',
};

export default function Tile({ tile, onClick, style, className = '', isFloating = false }: TileProps) {
  const { locale, isArabic } = useTranslation();
  const color = colorMap[tile.accent_color || 'olive'] || colorMap.olive;
  const sizeClass = sizeClasses[tile.size || 'md'] || sizeClasses.md;

  const titleText = getLocalizedText(tile.title, locale);
  const contentText = getLocalizedText(tile.content, locale);

  const badgeText = tile.badge
    ? getLocalizedText(tile.badge, locale)
    : tile.is_sharia_text
    ? UI_TRANSLATIONS[locale].badgeHadith
    : UI_TRANSLATIONS[locale].badgeSituation;

  const tUI = UI_TRANSLATIONS[locale];

  return (
    <button
      type="button"
      onClick={() => onClick(tile)}
      style={style}
      aria-haspopup="dialog"
      className={`group text-start rounded-2xl bg-[var(--color-surface)]/95 dark:bg-[#F5F2EB] dark:text-[#1E293B] backdrop-blur-md border ${
        color.border
      } ${
        color.hoverBorder
      } ${sizeClass} shadow-sm hover:shadow-xl dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer select-none ${
        isFloating ? 'tile-floating hover:pause-animation' : ''
      } ${className}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Header with dot, title, and badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className={`w-2 h-2 rounded-full shrink-0 ${color.accentDot}`} aria-hidden="true" />
          <h4 className={`font-bold truncate ${color.title} text-xs sm:text-sm`}>
            {titleText}
          </h4>
        </div>
        <span
          className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 tracking-wide ${color.badgeBg}`}
        >
          {badgeText}
        </span>
      </div>

      {/* Excerpt content with high-contrast text */}
      <p
        className={`line-clamp-2 leading-relaxed text-[var(--color-ink-light)] dark:text-[#1E293B] ${
          tile.is_sharia_text && isArabic
            ? 'font-quran text-xs sm:text-sm text-[#3F5233] dark:text-[#22301B] font-semibold'
            : 'text-xs'
        }`}
      >
        {contentText}
      </p>

      {/* Bottom hint on hover with direction-aware arrow */}
      <div className="mt-2.5 pt-1.5 border-t border-[var(--color-gold)]/15 dark:border-amber-500/20 flex items-center justify-between text-[10px] text-[var(--color-gold)] dark:text-[#8B6914] opacity-80 group-hover:opacity-100 transition-opacity font-medium">
        <span>{tUI.detailsBtn}</span>
        <span
          className={`transform transition-transform duration-200 ${
            isArabic ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
          }`}
        >
          {isArabic ? '←' : '→'}
        </span>
      </div>
    </button>
  );
}
