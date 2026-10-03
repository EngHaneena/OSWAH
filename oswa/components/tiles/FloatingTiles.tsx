'use client';

import React, { useState, useEffect } from 'react';
import { TileData } from './types';
import Tile from './Tile';
import TileModal from './TileModal';
import { useTranslation } from '@/lib/i18n';
import { FLOATING_TILES_DATA, POSITION_SLOTS, UI_TRANSLATIONS } from './tilesData';

export default function FloatingTiles() {
  const { locale, isArabic } = useTranslation();
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);
  const [isHidden, setIsHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedHidden = localStorage.getItem('oswa_hide_floating_tiles') === 'true';
    setIsHidden(savedHidden);
  }, []);

  const toggleHide = () => {
    const nextState = !isHidden;
    setIsHidden(nextState);
    localStorage.setItem('oswa_hide_floating_tiles', String(nextState));
  };

  if (!mounted) return null;

  const tUI = UI_TRANSLATIONS[locale];

  return (
    <>
      {/* Toggle button: Hide / Show Floating Tiles */}
      <div className="w-full flex justify-center my-6 z-20 relative">
        <button
          onClick={toggleHide}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-gold)]/35 bg-[var(--color-surface)]/85 dark:bg-black/45 text-xs font-semibold text-[var(--color-ink-light)] dark:text-[#c4ceb8] hover:text-[var(--color-ink)] dark:hover:text-white hover:bg-[var(--color-gold)]/10 backdrop-blur-md transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
        >
          <span>{isHidden ? '👁️' : '🕶️'}</span>
          <span>{isHidden ? tUI.showTiles : tUI.hideTiles}</span>
        </button>
      </div>

      {!isHidden && (
        <>
          {/* Desktop Floating Layout (≥ 1024px): Absolute positioned side slots */}
          <div
            className="hidden lg:block absolute inset-0 pointer-events-none z-10 overflow-hidden"
            aria-label={isArabic ? 'البطاقات والمواقف العائمة' : 'Floating Prophetic Cards'}
          >
            {FLOATING_TILES_DATA.map((tile) => {
              const slot = POSITION_SLOTS[tile.position || ''] || {
                top: '20%',
                left: '4%',
                rotate: '0deg',
                duration: '8s',
                delay: '0s',
              };

              const positionStyle: React.CSSProperties = {
                position: 'absolute',
                top: slot.top,
                left: slot.left,
                right: slot.right,
                transform: `rotate(${slot.rotate})`,
                animation: `gentleFloat ${slot.duration} ease-in-out infinite alternate`,
                animationDelay: slot.delay,
              };

              return (
                <div
                  key={tile.id}
                  style={positionStyle}
                  className="pointer-events-auto transition-transform duration-300 hover:scale-105 hover:z-30 motion-reduce:animate-none motion-reduce:transform-none"
                >
                  <Tile
                    tile={tile}
                    isFloating={true}
                    onClick={(t) => setSelectedTile(t)}
                  />
                </div>
              );
            })}
          </div>

          {/* Tablet & Mobile Layout (< 1024px): Horizontal responsive scroll-snap strip */}
          <div className="block lg:hidden w-full max-w-5xl mx-auto px-4 my-8 z-20 relative">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-[var(--color-gold)] text-sm">✦</span>
              <h3 className="text-xs font-bold text-[var(--color-ink)] dark:text-[var(--color-cream)]">
                {isArabic ? 'مقتبسات ومواقف من السيرة' : 'Prophetic Insights & Situations'}
              </h3>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth snap-x snap-mandatory focus:outline-none">
              {FLOATING_TILES_DATA.map((tile) => (
                <div key={tile.id} className="snap-start shrink-0">
                  <Tile
                    tile={tile}
                    onClick={(t) => setSelectedTile(t)}
                    className="w-64"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Expanded Modal Popover */}
      {selectedTile && (
        <TileModal
          tile={selectedTile}
          onClose={() => setSelectedTile(null)}
        />
      )}
    </>
  );
}
