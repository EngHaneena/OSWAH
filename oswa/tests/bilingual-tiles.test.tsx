import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FLOATING_TILES_DATA, UI_TRANSLATIONS } from '@/components/tiles/tilesData';
import Tile from '@/components/tiles/Tile';
import FloatingTiles from '@/components/tiles/FloatingTiles';
import LandingPage from '@/app/page';
import { LanguageProvider, useTranslation } from '@/lib/i18n';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Helper component to switch language in tests
function LanguageSwitcher({ targetLang }: { targetLang: 'ar' | 'en' }) {
  const { setLocale } = useTranslation();
  React.useEffect(() => {
    setLocale(targetLang);
  }, [targetLang, setLocale]);
  return null;
}

describe('Bilingual Floating Tiles & Home Elements Suite', () => {
  it('Requirement 1 & 2: FLOATING_TILES_DATA contains 8 bilingual cards with proper positions', () => {
    expect(FLOATING_TILES_DATA).toHaveLength(8);

    const positions = FLOATING_TILES_DATA.map(t => t.position);
    expect(positions).toContain('top-left');
    expect(positions).toContain('mid-left');
    expect(positions).toContain('bottom-left-1');
    expect(positions).toContain('bottom-left-2');
    expect(positions).toContain('top-right');
    expect(positions).toContain('mid-right-1');
    expect(positions).toContain('mid-right-2');
    expect(positions).toContain('bottom-right');

    for (const tile of FLOATING_TILES_DATA) {
      expect(typeof tile.title).toBe('object');
      expect((tile.title as any).ar).toBeTruthy();
      expect((tile.title as any).en).toBeTruthy();

      expect(typeof tile.content).toBe('object');
      expect((tile.content as any).ar).toBeTruthy();
      expect((tile.content as any).en).toBeTruthy();

      expect(typeof tile.badge).toBe('object');
      expect((tile.badge as any).ar).toBeTruthy();
      expect((tile.badge as any).en).toBeTruthy();
    }
  });

  it('Requirement 2: Tile component renders Arabic content when locale is Arabic and English when locale is English', () => {
    const tile1 = FLOATING_TILES_DATA[0]; // Gentleness in All Matters

    // Arabic Render
    const { rerender } = render(
      <LanguageProvider defaultLocale="ar">
        <Tile tile={tile1} onClick={() => {}} />
      </LanguageProvider>
    );

    expect(screen.getByText('الرفق في كل أمر')).toBeInTheDocument();
    expect(screen.getByText(/إن الرفق لا يكون في شيء/)).toBeInTheDocument();
    expect(screen.getByText('عرض التفاصيل')).toBeInTheDocument();
    expect(screen.getByText('←')).toBeInTheDocument();

    // English Render
    rerender(
      <LanguageProvider defaultLocale="en">
        <LanguageSwitcher targetLang="en" />
        <Tile tile={tile1} onClick={() => {}} />
      </LanguageProvider>
    );

    expect(screen.getByText('Gentleness in All Matters')).toBeInTheDocument();
    expect(screen.getByText(/Gentleness is not in anything/)).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
    expect(screen.getByText('→')).toBeInTheDocument();
  });

  it('Requirement 3 & 4: LandingPage renders bilingual Verse, Brand Name, and Enter button', () => {
    // Render in Arabic
    const { rerender } = render(
      <LanguageProvider defaultLocale="ar">
        <LanguageSwitcher targetLang="ar" />
        <LandingPage />
      </LanguageProvider>
    );

    expect(screen.getByText('أُسـوة')).toBeInTheDocument();
    expect(screen.getByText(/لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ/)).toBeInTheDocument();
    expect(screen.getByText('دخول')).toBeInTheDocument();
    expect(screen.getByText('إخفاء البطاقات')).toBeInTheDocument();

    // Render in English
    rerender(
      <LanguageProvider defaultLocale="en">
        <LanguageSwitcher targetLang="en" />
        <LandingPage />
      </LanguageProvider>
    );

    expect(screen.getByText('Oswah')).toBeInTheDocument();
    expect(screen.getByText(/There has certainly been for you in the Messenger of Allah an excellent pattern/)).toBeInTheDocument();
    expect(screen.getByText('Enter')).toBeInTheDocument();
    expect(screen.getByText('Hide Floating Tiles')).toBeInTheDocument();
  });

  it('Requirement 4 & 5: FloatingTiles toggle button and hide/show behavior in English and Arabic', () => {
    render(
      <LanguageProvider defaultLocale="en">
        <LanguageSwitcher targetLang="en" />
        <FloatingTiles />
      </LanguageProvider>
    );

    const toggleBtn = screen.getByRole('button', { name: /Hide Floating Tiles/i });
    expect(toggleBtn).toBeInTheDocument();

    // Clicking toggle hides tiles and changes button text to Show
    fireEvent.click(toggleBtn);
    expect(screen.getByText(/Show Floating Tiles/i)).toBeInTheDocument();

    // Clicking again shows them
    fireEvent.click(screen.getByRole('button', { name: /Show Floating Tiles/i }));
    expect(screen.getByText(/Hide Floating Tiles/i)).toBeInTheDocument();
  });
});
