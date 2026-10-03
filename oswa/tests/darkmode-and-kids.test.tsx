import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Tile from '../components/tiles/Tile';
import TileModal from '../components/tiles/TileModal';
import KidsAnimatedBackground from '../components/kids/KidsAnimatedBackground';
import KidsMenuPage from '../app/kids/page';
import StoryPage from '../app/kids/story/page';
import GamePage from '../app/kids/game/page';
import { TileData } from '../components/tiles/types';
import { LanguageProvider } from '../lib/i18n';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/kids',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

const mockTile: TileData = {
  id: 'test-tile-dark',
  title: 'موقف نبوي عن الصدق',
  content: '«عليكم بالصدق، فإن الصدق يهدي إلى البر»',
  placement: 'right',
  accent_color: 'olive',
  size: 'md',
  is_sharia_text: true,
  narrator: 'عبدالله بن مسعود',
  source_book: 'صحيح مسلم',
  source_ref: '2607',
  grade: 'صحيح',
  lesson: 'الصدق منهج حياة وعلامة الإيمان الحق.',
  status: 'approved',
  sort_order: 1,
};

describe('Task 1: Dark Mode Customization (الوضع الليلي)', () => {
  it('ensures Tile component uses warm ivory #F5F2EB in dark mode, not stark white or dark background, with golden tint border and dark slate text', () => {
    const { container } = render(
      <LanguageProvider>
        <Tile tile={mockTile} onClick={() => {}} />
      </LanguageProvider>
    );

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();

    const className = button?.className || '';
    // Must use warm ivory #F5F2EB
    expect(className).toContain('dark:bg-[#F5F2EB]');
    // Must use subtle soft golden tint border
    expect(className).toContain('dark:border-amber-500/20');
    // Must use high-contrast dark slate text
    expect(className).toContain('dark:text-[#1E293B]');
  });

  it('ensures TileModal dialog and inner cards use warm ivory #F5F2EB and #EFECE4 in dark mode', () => {
    const { container } = render(
      <LanguageProvider>
        <TileModal tile={mockTile} onClose={() => {}} />
      </LanguageProvider>
    );

    const modalDialog = container.querySelector('[role="dialog"]');
    expect(modalDialog).toBeInTheDocument();

    const card = modalDialog?.firstElementChild as HTMLElement;
    const cardClass = card?.className || '';
    expect(cardClass).toContain('dark:bg-[#F5F2EB]');
    expect(cardClass).toContain('dark:text-[#1E293B]');
    expect(cardClass).toContain('dark:border-amber-500/20');

    // Inner cards (situation and sharia boxes)
    const innerCards = container.querySelectorAll('.dark\\:bg-\\[\\#EFECE4\\]');
    expect(innerCards.length).toBeGreaterThan(0);
  });
});

describe('Task 2: Kids Corner Theming & Animated Background (ركن الطفل)', () => {
  it('renders KidsAnimatedBackground with non-blocking pointer-events-none and essential cartoon keyframe elements', () => {
    const { container } = render(<KidsAnimatedBackground />);
    const bgContainer = container.firstChild as HTMLElement;

    // Must be non-blocking
    expect(bgContainer).toHaveClass('pointer-events-none');
    expect(bgContainer).toHaveAttribute('aria-hidden', 'true');

    // 1. Crescent moon (🌙) with gentle floating animation
    const moon = screen.getByText('🌙');
    expect(moon).toBeInTheDocument();
    expect(moon.className).toContain('animate-float-gentle');

    // 2. Drifting cartoon clouds (☁️)
    const clouds = screen.getAllByText('☁️');
    expect(clouds.length).toBeGreaterThanOrEqual(3);
    expect(clouds[0].className).toMatch(/animate-cloud-drift/);

    // 3. Twinkling & pulsing stars (✨ / ⭐)
    const stars = screen.getAllByText(/[⭐✨]/);
    expect(stars.length).toBeGreaterThanOrEqual(4);
    expect(stars[0].className).toContain('animate-star-twinkle');

    // 4. Celebratory balloons (🎈)
    const balloons = screen.getAllByText('🎈');
    expect(balloons.length).toBeGreaterThanOrEqual(2);
    expect(balloons[0].className).toContain('animate-balloon-float');
  });

  it('renders KidsMenuPage with day/night gradients, extra-rounded cards, and hover expansion', () => {
    const { container } = render(
      <LanguageProvider>
        <KidsMenuPage />
      </LanguageProvider>
    );

    // Page background includes bright pastel day gradient and whimsical night gradient
    const outerWrapper = container.firstChild as HTMLElement;
    expect(outerWrapper.className).toContain('from-[#FEF9C3]');
    expect(outerWrapper.className).toContain('via-[#E0F2FE]');
    expect(outerWrapper.className).toContain('to-[#FCE7F3]');
    expect(outerWrapper.className).toContain('dark:from-slate-900');
    expect(outerWrapper.className).toContain('dark:via-indigo-950');
    expect(outerWrapper.className).toContain('dark:to-purple-950');

    // Kids typography font-kids / Baloo Bhaijaan 2
    expect(screen.getByText('ركن الأطفال')).toBeInTheDocument();

    // Story and game cards with extra-rounded corners and hover expansion
    const storyLink = screen.getByRole('link', { name: /قصة تفاعلية/i });
    expect(storyLink).toBeInTheDocument();
    expect(storyLink.className).toContain('rounded-[2.5rem]');
    expect(storyLink.className).toContain('hover:scale-105');

    const gameLink = screen.getByRole('link', { name: /لعبة المطابقة/i });
    expect(gameLink).toBeInTheDocument();
    expect(gameLink.className).toContain('rounded-[2.5rem]');
    expect(gameLink.className).toContain('hover:scale-105');
  });

  it('renders StoryPage and GamePage without duplicate Navbar and with KidsAnimatedBackground', () => {
    const { container: storyContainer } = render(
      <LanguageProvider>
        <StoryPage />
      </LanguageProvider>
    );
    expect(storyContainer.querySelector('nav')).toBeNull(); // No duplicate navbar
    expect(storyContainer.querySelector('.animate-float-gentle')).toBeInTheDocument(); // Moon animation present

    const { container: gameContainer } = render(
      <LanguageProvider>
        <GamePage />
      </LanguageProvider>
    );
    expect(gameContainer.querySelector('nav')).toBeNull(); // No duplicate navbar
    expect(gameContainer.querySelector('.animate-float-gentle')).toBeInTheDocument(); // Moon animation present
  });
});
