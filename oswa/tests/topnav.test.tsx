import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TopNav from '../components/layout/TopNav';
import { LanguageProvider } from '../lib/i18n';
import { ThemeProvider } from '../components/theme/ThemeProvider';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

// Mock Supabase
let mockUser: any = null;
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockImplementation(() => Promise.resolve({ data: { user: mockUser } })),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: mockUser ? { display_name: 'أحمد' } : null }),
        }),
      }),
    }),
  }),
}));

describe('Requirement 1 & 2: TopNav and Mobile Drawer', () => {
  beforeEach(() => {
    mockUser = null;
    localStorage.clear();
  });

  it('renders tabs from config, logo linking to home, and language/theme toggles', async () => {
    render(
      <ThemeProvider>
        <LanguageProvider>
          <TopNav />
        </LanguageProvider>
      </ThemeProvider>
    );

    // Brand logo
    const brandLink = screen.getByLabelText(/^الرئيسية$|^Home$/i);
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute('href', '/');

    // Nav tabs
    expect(screen.getByText('عظة وعبرة')).toBeInTheDocument();
    expect(screen.getByText('براعم أُسوة')).toBeInTheDocument();

    // Language switch button
    const langBtn = screen.getByTitle(/Switch to English|التحويل إلى العربية/i);
    expect(langBtn).toBeInTheDocument();

    // Unauthenticated state: Login button present
    await waitFor(() => {
      expect(screen.getAllByText(/تسجيل الدخول|Log In/i)[0]).toBeInTheDocument();
    });
  });

  it('displays Guest badge when guest mode is active', async () => {
    localStorage.setItem('oswa_is_guest', 'true');

    render(
      <ThemeProvider>
        <LanguageProvider>
          <TopNav />
        </LanguageProvider>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/ضيف|Guest/i)[0]).toBeInTheDocument();
    });
  });

  it('displays User avatar circle and dropdown for authenticated user', async () => {
    mockUser = { id: 'user-123', email: 'test@example.com', is_anonymous: false };

    render(
      <ThemeProvider>
        <LanguageProvider>
          <TopNav />
        </LanguageProvider>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('أحمد')).toBeInTheDocument();
    });

    // Clicking avatar opens user menu
    const userBtn = screen.getByTitle('أحمد');
    fireEvent.click(userBtn);

    expect(screen.getByText('حسابي')).toBeInTheDocument();
    expect(screen.getByText('تسجيل الخروج')).toBeInTheDocument();
  });

  it('Requirement 2: Mobile drawer opens and closes properly', () => {
    render(
      <ThemeProvider>
        <LanguageProvider>
          <TopNav />
        </LanguageProvider>
      </ThemeProvider>
    );

    const hamburgerBtn = screen.getByLabelText(/القائمة الرئيسية|Main Menu/i);
    fireEvent.click(hamburgerBtn);

    // Drawer is now open with dialog role
    const dialog = screen.getByRole('dialog', { name: /القائمة الرئيسية|Main Menu/i });
    expect(dialog).toBeInTheDocument();

    // Close button works
    const closeBtn = screen.getByLabelText(/إغلاق القائمة|Close Menu/i);
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog', { name: /القائمة الرئيسية|Main Menu/i })).not.toBeInTheDocument();
  });

  it('Requirement: Theme toggle mounts safely without hydration mismatch', async () => {
    render(
      <ThemeProvider>
        <LanguageProvider>
          <TopNav />
        </LanguageProvider>
      </ThemeProvider>
    );

    const themeToggleBtn = screen.getByTitle(/مظهر الموقع|المظهر|Theme/i);
    expect(themeToggleBtn).toBeInTheDocument();

    // After mounted, svg icon is rendered inside button
    await waitFor(() => {
      const svg = themeToggleBtn.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});
