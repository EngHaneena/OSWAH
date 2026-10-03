import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Tile from '../components/tiles/Tile';
import TileModal from '../components/tiles/TileModal';
import KidsAnimatedBackground from '../components/kids/KidsAnimatedBackground';
import KidsMenuPage from '../app/kids/page';
import StoryPage from '../app/kids/story/page';
import GamePage from '../app/kids/game/page';
import ParentalPortalModal from '../components/kids/ParentalPortalModal';
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
  it('renders KidsAnimatedBackground with moon, clouds, dunes and caravan, and completely removes stars and balloons', () => {
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

    // 3. Stars and Balloons are COMPLETELY REMOVED from background
    expect(screen.queryByText('✨')).not.toBeInTheDocument();
    expect(screen.queryByText('🎈')).not.toBeInTheDocument();

    // 4. Cartoon Caravan Trail remains anchored at bottom
    expect(screen.getByTestId('caravan-trail')).toBeInTheDocument();
    expect(screen.getAllByText('🐪').length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText('⛺')).toBeInTheDocument();
  });

  it('renders KidsMenuPage with compact streak pill, parental portal button, and peer challenge', async () => {
    const { container } = render(
      <LanguageProvider>
        <KidsMenuPage />
      </LanguageProvider>
    );

    // Section title is Oswah Sprouts (براعم أُسوة)
    expect(screen.getByText('براعم أُسوة')).toBeInTheDocument();

    // Compact Streak Pill is pinned at top
    expect(screen.getByLabelText('عداد الستريك اليومي')).toBeInTheDocument();
    expect(screen.getByText(/ستريك.*أيام من الاقتداء/i)).toBeInTheDocument();

    // Parental Portal button is pinned at top corner
    const parentBtn = screen.getByRole('button', { name: /بوابة ولي الأمر/i });
    expect(parentBtn).toBeInTheDocument();

    // Story and game cards
    expect(screen.getByRole('link', { name: /قصة تفاعلية/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /لعبة المطابقة/i })).toBeInTheDocument();

    // Peer Challenge card is rendered
    expect(screen.getByText(/تحدي البراعم/i)).toBeInTheDocument();
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

  it('renders ParentalPortalModal with verification gate, screen time settings, and prophetic tips', () => {
    const handleClose = vi.fn();
    render(
      <LanguageProvider>
        <ParentalPortalModal isOpen={true} onClose={handleClose} sessionMinutes={12} />
      </LanguageProvider>
    );

    // Initial Gatekeeper Challenge is shown
    expect(screen.getByText('التحقق من إشراف ولي الأمر')).toBeInTheDocument();
    const submitBtn = screen.getByRole('button', { name: /تحقق ودخول/i });
    expect(submitBtn).toBeInTheDocument();

    // Input wrong answer
    const input = screen.getByPlaceholderText(/أدخل الناتج هنا/i);
    fireEvent.change(input, { target: { value: '999' } });
    fireEvent.click(submitBtn);

    // Error appears
    expect(screen.getByText(/الناتج غير صحيح/i)).toBeInTheDocument();

    // Find the math expression displayed on screen
    const formulaEl = screen.getByText(/×.*=/);
    const formulaText = formulaEl.textContent || '';
    const match = formulaText.match(/(\d+)\s*×\s*(\d+)/);
    expect(match).not.toBeNull();
    const [_, a, b] = match!;
    const correctAnswer = (parseInt(a, 10) * parseInt(b, 10)).toString();

    // Input correct answer
    const inputAfter = screen.getByPlaceholderText(/أدخل الناتج هنا/i);
    fireEvent.change(inputAfter, { target: { value: correctAnswer } });
    fireEvent.click(submitBtn);

    // Dashboard unlocked!
    expect(screen.getByText('بوابة ولي الأمر — إشراف الوالدين')).toBeInTheDocument();
    expect(screen.getByText(/نشاط وتقدم الطفل/i)).toBeInTheDocument();
    expect(screen.getByText(/وقت الشاشة والراحة/i)).toBeInTheDocument();
    expect(screen.getByText(/توجيهات السيرة التربوية/i)).toBeInTheDocument();

    // Click Screen Time Tab
    const screenTimeTab = screen.getByRole('button', { name: /وقت الشاشة والراحة/i });
    fireEvent.click(screenTimeTab);
    expect(screen.getByText(/الوقت المنقضي في هذه الجلسة/i)).toBeInTheDocument();
    expect(screen.getByText('12 دقيقة')).toBeInTheDocument();

    // Click Tips Tab
    const tipsTab = screen.getByRole('button', { name: /توجيهات السيرة التربوية/i });
    fireEvent.click(tipsTab);
    expect(screen.getByText(/تعزيز خُلق الصدق بالأمان لا بالعقاب/i)).toBeInTheDocument();
  });
});


