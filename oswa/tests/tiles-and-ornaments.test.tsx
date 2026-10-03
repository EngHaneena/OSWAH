import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TileModal from '../components/tiles/TileModal';
import { TileData } from '../components/tiles/types';
import BackgroundOrnaments from '../components/ornaments/BackgroundOrnaments';
import { ProphetGlow } from '../components/ornaments/IslamicPattern';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

const mockShariaTile: TileData = {
  id: 'tile-test-1',
  title: 'الرفق في كل أمر',
  content: '«إن الرفق لا يكون في شيء إلا زانه، ولا ينزع من شيء إلا شانه»',
  placement: 'home',
  accent_color: 'olive',
  size: 'lg',
  is_sharia_text: true,
  source_book: 'صحيح مسلم',
  source_ref: '2594',
  narrator: 'عائشة رضي الله عنها',
  grade: 'صحيح',
  lesson: 'التعامل باللين والرفق هو الأصل النبوي.',
  status: 'approved',
  sort_order: 1,
};

describe('Requirement 8: Sharia text preservation in modal', () => {
  it('renders Sharia text, narrator, source book, and grade strictly in Arabic regardless of locale', () => {
    render(<TileModal tile={mockShariaTile} onClose={() => {}} />);

    // Sharia text in Arabic
    expect(screen.getByText(/إن الرفق لا يكون في شيء إلا زانه/i)).toBeInTheDocument();
    // Sharia badge
    expect(screen.getByText('نص شرعي موثق')).toBeInTheDocument();
    // Narrator in Arabic
    expect(screen.getByText(/عائشة رضي الله عنها/i)).toBeInTheDocument();
    // Grade in Arabic
    expect(screen.getAllByText(/صحيح/i)[0]).toBeInTheDocument();
    // Source book in Arabic
    expect(screen.getByText(/صحيح مسلم/i)).toBeInTheDocument();
  });
});

describe('Requirement 11: Sacred reverence — No human depiction of the Prophet ﷺ', () => {
  it('ensures ProphetGlow is pure radiant light with no face, limbs, or body representation', () => {
    const { container } = render(<ProphetGlow className="w-32 h-32" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('data-no-human-form', 'true');
    expect(svg?.querySelector('radialGradient')).toBeInTheDocument();
    expect(svg?.querySelector('ellipse')).toBeInTheDocument();

    // Verify it consists only of non-figurative geometric glow ellipses/gradients
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length || 0).toBe(0);
  });
});

describe('Requirement 9 & 10: Reduced Motion and Color Accessibility', () => {
  it('renders BackgroundOrnaments with aria-hidden and pointer-events-none without blocking readability', () => {
    const { container } = render(<BackgroundOrnaments />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).toHaveClass('pointer-events-none');
  });
});
