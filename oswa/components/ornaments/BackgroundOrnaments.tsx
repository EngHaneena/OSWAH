'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function BackgroundOrnaments() {
  const pathname = usePathname() || '';
  const isKids = pathname.startsWith('/kids');
  const isHome = pathname === '/';

  if (isKids) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Islamic Geometric Pattern Repeated across the background (6-8% opacity) */}
      <svg
        className={`absolute inset-0 w-full h-full ${
          isKids ? 'opacity-[0.04]' : 'opacity-[0.07] dark:opacity-[0.05]'
        }`}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="islamic-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* Eight-pointed star geometry */}
            <path
              d="M40 10 L50 25 L65 15 L55 30 L70 40 L55 50 L65 65 L50 55 L40 70 L30 55 L15 65 L25 50 L10 40 L25 30 L15 15 L30 25 Z"
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="0.8"
            />
            {/* Connecting lines */}
            <path
              d="M0 0 L40 40 M80 0 L40 40 M0 80 L40 40 M80 80 L40 40"
              stroke="var(--color-olive)"
              strokeWidth="0.4"
            />
            <circle cx="40" cy="40" r="4" fill="none" stroke="var(--color-gold)" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-grid)" />
      </svg>

      {/* 2. Large Faint Eight-Pointed Star behind Title on Home */}
      {isHome && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[550px] h-[550px] opacity-[0.06] dark:opacity-[0.04] transition-opacity">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_120s_linear_infinite] motion-reduce:animate-none">
            <polygon
              points="100,10 120,60 175,25 140,80 190,100 140,120 175,175 120,140 100,190 80,140 25,175 60,120 10,100 60,80 25,25 80,60"
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="1.5"
            />
            <circle cx="100" cy="100" r="45" fill="none" stroke="var(--color-olive)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>
      )}

      {/* 3. Soft Corner Arabesque Ornaments */}
      {/* Top Right Corner */}
      <svg
        className="absolute top-0 end-0 w-44 h-44 sm:w-64 sm:h-64 opacity-[0.09] dark:opacity-[0.06] text-[var(--color-gold)]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
      >
        <path d="M200 0 C140 0, 100 40, 100 100 C100 160, 40 200, 0 200" strokeWidth="1.5" />
        <path d="M200 40 C160 40, 130 70, 130 110 C130 150, 90 180, 50 190" strokeWidth="1" />
        <circle cx="150" cy="50" r="12" strokeWidth="1" />
        <circle cx="180" cy="20" r="6" strokeWidth="1" />
      </svg>

      {/* Bottom Left Corner */}
      <svg
        className="absolute bottom-0 start-0 w-44 h-44 sm:w-64 sm:h-64 opacity-[0.09] dark:opacity-[0.06] text-[var(--color-gold)] rotate-180"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
      >
        <path d="M200 0 C140 0, 100 40, 100 100 C100 160, 40 200, 0 200" strokeWidth="1.5" />
        <path d="M200 40 C160 40, 130 70, 130 110 C130 150, 90 180, 50 190" strokeWidth="1" />
        <circle cx="150" cy="50" r="12" strokeWidth="1" />
        <circle cx="180" cy="20" r="6" strokeWidth="1" />
      </svg>
    </div>
  );
}
