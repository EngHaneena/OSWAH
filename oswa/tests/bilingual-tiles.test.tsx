import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { FLOATING_TILES_DATA } from '@/components/tiles/tilesData';
import Tile from '@/components/tiles/Tile';
import LandingPage from '@/app/page';
import WisdomTilesCarousel from '@/components/wisdom/WisdomTilesCarousel';
import DestinationModal from '@/components/modals/DestinationModal';
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

describe('Bilingual Tiles & Navigation Flow Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Requirement 1: FLOATING_TILES_DATA contains 8 bilingual cards with proper structure', () => {
    expect(FLOATING_TILES_DATA).toHaveLength(8);

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
  });

  it('Requirement 3: LandingPage "دخول" opens DestinationModal with choice between Wisdom and Kids Corner', () => {
    render(
      <LanguageProvider defaultLocale="ar">
        <LandingPage />
      </LanguageProvider>
    );

    expect(screen.getByText('أُسـوة')).toBeInTheDocument();
    expect(screen.getByText(/لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ/)).toBeInTheDocument();

    // Destination modal is initially not in DOM
    expect(screen.queryByRole('dialog', { name: /اختر وجهتك في أُسـوة/i })).not.toBeInTheDocument();

    // Clicking "دخول" button opens the Destination Choice modal
    const enterBtn = screen.getByRole('button', { name: /دخول/i });
    fireEvent.click(enterBtn);

    // Modal dialog is now visible
    const modal = screen.getByRole('dialog', { name: /اختر وجهتك في أُسـوة/i });
    expect(modal).toBeInTheDocument();

    // Destination 1: Wisdom Page
    const wisdomLink = screen.getByRole('link', { name: /صفحة العظة والعبرة/i });
    expect(wisdomLink).toBeInTheDocument();
    expect(wisdomLink).toHaveAttribute('href', '/wisdom');

    // Destination 2: Kids Corner
    const kidsLink = screen.getByRole('link', { name: /ركن الأطفال/i });
    expect(kidsLink).toBeInTheDocument();
    expect(kidsLink).toHaveAttribute('href', '/kids');
  });

  it('Requirement 4: DestinationModal renders in English and closes with close button', () => {
    const handleClose = vi.fn();
    render(
      <LanguageProvider defaultLocale="en">
        <LanguageSwitcher targetLang="en" />
        <DestinationModal isOpen={true} onClose={handleClose} />
      </LanguageProvider>
    );

    expect(screen.getByText('Choose Your Destination in Oswah')).toBeInTheDocument();
    expect(screen.getByText('Wisdom & Lessons')).toBeInTheDocument();
    expect(screen.getByText('Kids Corner')).toBeInTheDocument();

    // Close button
    const closeBtn = screen.getByLabelText(/Close/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('Requirement 5: WisdomTilesCarousel renders Hero Banner with auto-rotation controls, dots, and dark mode ivory styling', () => {
    vi.useFakeTimers();

    const { container } = render(
      <LanguageProvider defaultLocale="ar">
        <WisdomTilesCarousel />
      </LanguageProvider>
    );

    // Card background in dark mode has #F5F2EB and text-[#1E293B]
    const bannerBox = container.querySelector('.dark\\:bg-\\[\\#F5F2EB\\]');
    expect(bannerBox).toBeInTheDocument();
    expect(bannerBox?.className).toContain('dark:border-amber-500/20');
    expect(bannerBox?.className).toContain('dark:text-[#1E293B]');

    // First tile title is displayed initially
    expect(screen.getByText('الرفق في كل أمر')).toBeInTheDocument();

    // 8 dots for navigation
    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(8);

    // Clicking next button advances to next tile
    const nextBtn = screen.getByLabelText(/الموقف التالي/i);
    fireEvent.click(nextBtn);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Should now show second tile title
    const tile2Title = (FLOATING_TILES_DATA[1].title as any).ar;
    expect(screen.getByText(tile2Title)).toBeInTheDocument();

    // Test auto-rotation: advance timer 5000ms
    act(() => {
      vi.advanceTimersByTime(5200);
    });
    const tile3Title = (FLOATING_TILES_DATA[2].title as any).ar;
    expect(screen.getByText(tile3Title)).toBeInTheDocument();

    vi.useRealTimers();
  });
});
