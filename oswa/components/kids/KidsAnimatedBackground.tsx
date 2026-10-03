'use client';

import React from 'react';

export default function KidsAnimatedBackground() {
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

      {/* 3. Twinkling & Pulsing Stars (✨ / ⭐) */}
      {/* Top right cluster */}
      <div
        className="absolute top-12 end-16 text-3xl sm:text-4xl text-amber-400 dark:text-yellow-300 animate-star-twinkle filter drop-shadow-md"
        style={{ animationDelay: '0.2s', animationDuration: '2.8s' }}
      >
        ⭐
      </div>
      <div
        className="absolute top-20 end-32 text-2xl text-amber-300 dark:text-yellow-200 animate-star-twinkle"
        style={{ animationDelay: '1.4s', animationDuration: '2.2s' }}
      >
        ✨
      </div>

      {/* Center sky sparkles */}
      <div
        className="absolute top-36 start-1/3 text-2xl sm:text-3xl text-yellow-400 animate-star-twinkle"
        style={{ animationDelay: '0.8s', animationDuration: '3.2s' }}
      >
        ⭐
      </div>
      <div
        className="absolute top-64 end-1/4 text-2xl text-amber-300 animate-star-twinkle"
        style={{ animationDelay: '1.9s', animationDuration: '2.5s' }}
      >
        ✨
      </div>

      {/* Lower playful stars */}
      <div
        className="absolute bottom-28 start-16 text-3xl text-yellow-400 animate-star-twinkle"
        style={{ animationDelay: '1.1s', animationDuration: '2.7s' }}
      >
        ⭐
      </div>
      <div
        className="absolute bottom-40 end-20 text-3xl text-amber-300 animate-star-twinkle"
        style={{ animationDelay: '0.5s', animationDuration: '3s' }}
      >
        ✨
      </div>

      {/* 4. Celebratory Floating Balloons (🎈) */}
      <div
        className="absolute bottom-16 start-10 sm:start-24 text-4xl sm:text-5xl animate-balloon-float filter drop-shadow-lg"
        style={{ animationDelay: '0s', animationDuration: '5.2s' }}
      >
        🎈
      </div>
      <div
        className="absolute bottom-24 end-12 sm:end-28 text-4xl sm:text-5xl animate-balloon-float filter drop-shadow-lg"
        style={{ animationDelay: '2.4s', animationDuration: '4.8s' }}
      >
        🎈
      </div>
    </div>
  );
}
