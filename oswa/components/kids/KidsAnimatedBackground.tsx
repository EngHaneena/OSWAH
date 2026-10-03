'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';

export default function KidsAnimatedBackground() {
  const { dir } = useTranslation();
  const isRtl = dir === 'rtl';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Soft Smiling Crescent Moon (🌙) floating in the upper sky */}
      <div
        className="absolute top-6 start-8 sm:top-10 sm:start-14 text-5xl sm:text-6xl animate-float-gentle filter drop-shadow-[0_4px_12px_rgba(251,191,36,0.45)] dark:drop-shadow-[0_4px_24px_rgba(253,224,71,0.6)]"
        style={{ animationDuration: '6s' }}
      >
        🌙
      </div>

      {/* 2. Drifting Cartoon Clouds (☁️) across different altitudes */}
      {/* Upper slow cloud */}
      <div
        className="absolute top-14 text-6xl sm:text-7xl opacity-80 dark:opacity-40 animate-cloud-drift-slow"
        style={{ animationDelay: '0s', animationDuration: '55s' }}
      >
        ☁️
      </div>

      {/* Mid cloud with different speed and vertical offset */}
      <div
        className="absolute top-44 text-5xl sm:text-6xl opacity-75 dark:opacity-30 animate-cloud-drift-fast"
        style={{ animationDelay: '-15s', animationDuration: '38s' }}
      >
        ☁️
      </div>

      {/* Lower faint cloud */}
      <div
        className="absolute top-72 text-6xl opacity-60 dark:opacity-20 animate-cloud-drift-slow"
        style={{ animationDelay: '-32s', animationDuration: '65s' }}
      >
        ☁️
      </div>

      {/* 5. Desert Sand Dunes & Cartoon Caravan Trail (مسار القافلة الكرتوني) */}
      <div className="absolute bottom-0 inset-x-0 h-40 sm:h-48 overflow-hidden pointer-events-none select-none z-0">
        {/* Soft Background Dunes (Back Layer) */}
        <svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-32 sm:h-36 opacity-60 text-amber-200/70 dark:text-indigo-950/80 transition-colors"
          fill="currentColor"
        >
          <path d="M0,120 C320,60, 480,180, 800,100 C1120,20, 1280,140, 1440,90 L1440,220 L0,220 Z" />
        </svg>

        {/* Foreground Dunes (Front Layer) */}
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-24 sm:h-28 opacity-90 text-amber-300/80 dark:text-indigo-900/90 transition-colors"
          fill="currentColor"
        >
          <path d="M0,90 C240,150, 520,70, 780,130 C1060,190, 1260,80, 1440,110 L1440,200 L0,200 Z" />
        </svg>

        {/* Decorative Cartoon Palm Trees (🌴) planted on dunes */}
        <div className="absolute bottom-14 start-[10%] text-3xl sm:text-4xl filter drop-shadow opacity-90">
          🌴
        </div>
        <div className="absolute bottom-16 start-[38%] text-2xl sm:text-3xl filter drop-shadow opacity-80">
          🌴
        </div>
        <div className="absolute bottom-12 end-[14%] text-3xl sm:text-4xl filter drop-shadow opacity-90">
          🌴
        </div>
        <div className="absolute bottom-18 end-[34%] text-xl sm:text-2xl filter drop-shadow opacity-75">
          🌴
        </div>

        {/* Continuous Looping Mini Caravan (🐪 🐪 🐪 ⛺) drifting across the dunes */}
        <div
          data-testid="caravan-trail"
          className={`absolute bottom-6 sm:bottom-8 whitespace-nowrap text-3xl sm:text-4xl filter drop-shadow-md ${
            isRtl ? 'animate-caravan-rtl' : 'animate-caravan-ltr'
          }`}
        >
          {isRtl ? (
            <div className="inline-flex items-end gap-2.5 sm:gap-4">
              <span className="animate-camel-step" style={{ animationDelay: '0s' }}>🐪</span>
              <span className="animate-camel-step" style={{ animationDelay: '0.4s' }}>🐪</span>
              <span className="animate-camel-step" style={{ animationDelay: '0.8s' }}>🐪</span>
              <span className="text-3xl sm:text-4xl filter drop-shadow">⛺</span>
            </div>
          ) : (
            <div className="inline-flex items-end gap-2.5 sm:gap-4">
              <span className="text-3xl sm:text-4xl filter drop-shadow">⛺</span>
              <span className="animate-camel-step scale-x-[-1]" style={{ animationDelay: '0.8s' }}>🐪</span>
              <span className="animate-camel-step scale-x-[-1]" style={{ animationDelay: '0.4s' }}>🐪</span>
              <span className="animate-camel-step scale-x-[-1]" style={{ animationDelay: '0s' }}>🐪</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
