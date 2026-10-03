'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { navItems } from '@/config/nav';
import { useTranslation } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, setLocale, isArabic, dir } = useTranslation();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // User state
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');

  const themeRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Track scroll position for height shrinking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Supabase user or check localStorage guest
  useEffect(() => {
    const supabase = createClient();
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (user.is_anonymous) {
            setIsGuest(true);
            setUser(null);
            // Check if guest has a local name saved
            const localName = localStorage.getItem('oswa_guest_name');
            if (localName) setDisplayName(localName);
          } else {
            setUser(user);
            setIsGuest(false);
            // Fetch profile name or user metadata
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', user.id)
              .maybeSingle();

            setDisplayName(profile?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم');
          }
        } else {
          // Check localStorage for guest mode flag
          const localGuest = localStorage.getItem('oswa_is_guest');
          if (localGuest === 'true') {
            setIsGuest(true);
            const localName = localStorage.getItem('oswa_guest_name');
            if (localName) setDisplayName(localName);
          } else {
            setUser(null);
            setIsGuest(false);
          }
        }
      } catch (err) {
        console.error('Error fetching user auth in TopNav:', err);
      } finally {
        setLoadingUser(false);
      }
    }

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        if (session.user.is_anonymous) {
          setIsGuest(true);
          setUser(null);
        } else {
          setUser(session.user);
          setIsGuest(false);
        }
      } else {
        const localGuest = localStorage.getItem('oswa_is_guest');
        setIsGuest(localGuest === 'true');
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Close menus on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setThemeMenuOpen(false);
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Auto-focus drawer close button
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const toggleLanguage = () => {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem('oswa_is_guest');
    localStorage.removeItem('oswa_guest_name');
    setUser(null);
    setIsGuest(false);
    router.push('/');
  };

  // Filter items (hide dev items in production)
  const isDev = process.env.NODE_ENV === 'development';
  const visibleNavItems = navItems.filter((item) => !item.devOnly || isDev);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b border-[var(--color-gold)]/20 ${
          isScrolled
            ? 'h-14 bg-[var(--color-surface)]/90 dark:bg-[#151f0f]/90 shadow-sm backdrop-blur-md'
            : 'h-16 bg-[var(--color-surface)]/75 dark:bg-[#151f0f]/80 backdrop-blur-sm'
        }`}
        dir={dir}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo (Right in RTL / Left in LTR) */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded-lg px-1 py-0.5"
            aria-label={t('nav.home')}
          >
            {/* Small Islamic geometric star */}
            <span
              className="text-[var(--color-gold)] group-hover:rotate-45 transition-transform duration-500 text-lg select-none"
              aria-hidden="true"
            >
              ✦
            </span>
            <span
              className="text-2xl sm:text-3xl text-[var(--color-ink)] dark:text-[var(--color-cream)] transition-colors tracking-wide"
              style={{ fontFamily: 'Aref Ruqaa, serif' }}
            >
              {t('nav.siteName')}
            </span>
          </Link>

          {/* Desktop Navigation Tabs (Center) */}
          <nav
            className="hidden md:flex items-center gap-1.5 lg:gap-2 px-2 py-1 bg-black/[0.03] dark:bg-white/[0.04] rounded-full border border-[var(--color-gold)]/15"
            aria-label={t('nav.navAria')}
          >
            {visibleNavItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] ${
                    isActive
                      ? 'text-[var(--color-cream)] bg-[var(--color-olive)] dark:bg-[#4A6038] shadow-sm font-semibold'
                      : 'text-[var(--color-ink-light)] dark:text-[#c4ceb8] hover:text-[var(--color-ink)] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t(`nav.${item.translationKey}`)}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[var(--color-gold)] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* End side actions (In Order: 1. Language, 2. Dark mode, 3. User box) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* 1) Language Switcher (AR / EN) */}
            <button
              onClick={toggleLanguage}
              aria-label={t('nav.switchLanguage')}
              title={t('nav.switchLanguage')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[var(--color-gold)]/30 hover:border-[var(--color-gold)] bg-white/50 dark:bg-black/20 text-[var(--color-ink)] dark:text-[var(--color-cream)] hover:bg-[var(--color-gold)]/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            >
              {locale === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* 2) Dark Mode Button with 3 states (Light / Dark / System) */}
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                aria-label={t('nav.theme')}
                aria-expanded={themeMenuOpen}
                aria-haspopup="true"
                className="p-2 rounded-xl text-[var(--color-ink-light)] dark:text-[#c4ceb8] hover:text-[var(--color-ink)] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] border border-transparent hover:border-[var(--color-gold)]/20"
                title={t('nav.theme')}
              >
                {resolvedTheme === 'dark' ? (
                  /* Moon icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  /* Sun icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>

              {/* Theme Dropdown */}
              {themeMenuOpen && (
                <div
                  className="absolute end-0 mt-2 w-36 py-1.5 bg-[var(--color-surface)] dark:bg-[#1b2614] rounded-xl shadow-xl border border-[var(--color-gold)]/25 text-xs font-medium z-50 animate-fade-in-up"
                  role="menu"
                >
                  <button
                    onClick={() => {
                      setTheme('light');
                      setThemeMenuOpen(false);
                    }}
                    role="menuitem"
                    className={`w-full flex items-center gap-2 px-3 py-2 text-start transition-colors ${
                      theme === 'light'
                        ? 'text-[var(--color-olive)] dark:text-[var(--color-gold-light)] font-bold bg-[var(--color-gold)]/10'
                        : 'text-[var(--color-ink)] dark:text-[#e4ddcc] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>☀️</span>
                    <span>{t('nav.lightMode')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('dark');
                      setThemeMenuOpen(false);
                    }}
                    role="menuitem"
                    className={`w-full flex items-center gap-2 px-3 py-2 text-start transition-colors ${
                      theme === 'dark'
                        ? 'text-[var(--color-olive)] dark:text-[var(--color-gold-light)] font-bold bg-[var(--color-gold)]/10'
                        : 'text-[var(--color-ink)] dark:text-[#e4ddcc] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>🌙</span>
                    <span>{t('nav.darkMode')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('system');
                      setThemeMenuOpen(false);
                    }}
                    role="menuitem"
                    className={`w-full flex items-center gap-2 px-3 py-2 text-start transition-colors ${
                      theme === 'system'
                        ? 'text-[var(--color-olive)] dark:text-[var(--color-gold-light)] font-bold bg-[var(--color-gold)]/10'
                        : 'text-[var(--color-ink)] dark:text-[#e4ddcc] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>💻</span>
                    <span>{t('nav.systemMode')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3) User Box (Unauthenticated / Guest / Authenticated) */}
            <div className="relative" ref={userRef}>
              {loadingUser ? (
                <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 animate-pulse" />
              ) : user ? (
                /* Authenticated */
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
                    title={displayName}
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--color-olive)] text-[var(--color-cream)] flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-[var(--color-gold)]/40">
                      {displayName.charAt(0).toUpperCase() || '👤'}
                    </div>
                    <span className="max-w-[100px] lg:max-w-[130px] truncate text-xs font-semibold text-[var(--color-ink)] dark:text-[var(--color-cream)]">
                      {displayName}
                    </span>
                    <svg className="w-3.5 h-3.5 text-[var(--color-ink-light)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute end-0 mt-2 w-44 py-1.5 bg-[var(--color-surface)] dark:bg-[#1b2614] rounded-xl shadow-xl border border-[var(--color-gold)]/25 text-xs font-medium z-50 animate-fade-in-up"
                      role="menu"
                    >
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-2 px-3 py-2 text-[var(--color-ink)] dark:text-[#e4ddcc] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        <span>👤</span>
                        <span>{t('nav.myAccount')}</span>
                      </Link>
                      <hr className="my-1 border-[var(--color-gold)]/20" />
                      <button
                        onClick={handleLogout}
                        role="menuitem"
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-start"
                      >
                        <span>🚪</span>
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : isGuest ? (
                /* Guest */
                <div className="relative group">
                  <Link
                    href="/account"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 text-xs font-medium text-[var(--color-ink)] dark:text-[var(--color-cream)] hover:bg-[var(--color-gold)]/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
                    <span>{t('nav.guest')}</span>
                  </Link>

                  {/* Guest Tooltip */}
                  <div className="absolute end-0 top-full mt-2 hidden group-hover:block group-focus-within:block w-52 p-2 bg-[var(--color-surface)] dark:bg-[#1b2614] text-[var(--color-ink)] dark:text-[#e4ddcc] text-[11px] rounded-lg shadow-lg border border-[var(--color-gold)]/30 z-50 pointer-events-none animate-fade-in-up">
                    {t('nav.guestTooltip')}
                  </div>
                </div>
              ) : (
                /* Unauthenticated */
                <Link
                  href="/login"
                  className="px-4 py-1.5 bg-[var(--color-olive)] hover:bg-[var(--color-ink)] text-[var(--color-cream)] text-xs font-semibold rounded-full shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t('nav.menu')}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl text-[var(--color-ink)] dark:text-[var(--color-cream)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Small Bottom Geometric Decorative Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent" aria-hidden="true" />
      </header>

      {/* Mobile Drawer (Accessible, focus-trapped, safe-area-inset) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div
            ref={drawerRef}
            tabIndex={-1}
            dir={dir}
            className={`fixed inset-y-0 ${
              isArabic ? 'right-0' : 'left-0'
            } w-full max-w-xs bg-[var(--color-surface)] dark:bg-[#151f0f] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto outline-none transition-transform duration-300 border-s border-[var(--color-gold)]/20`}
            style={{
              paddingTop: 'calc(1.5rem + env(safe-area-inset-top, 0px))',
              paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
            }}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--color-gold)]/20 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-gold)] text-lg">✦</span>
                  <span
                    className="text-2xl text-[var(--color-ink)] dark:text-[var(--color-cream)]"
                    style={{ fontFamily: 'Aref Ruqaa, serif' }}
                  >
                    {t('nav.siteName')}
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={t('nav.closeMenu')}
                  className="p-2 rounded-lg text-[var(--color-ink-light)] dark:text-[#c4ceb8] hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2 mb-8" aria-label={t('nav.navAria')}>
                {visibleNavItems.map((item) => {
                  const isActive =
                    item.path === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        isActive
                          ? 'bg-[var(--color-olive)] text-[var(--color-cream)] shadow-sm font-semibold'
                          : 'text-[var(--color-ink)] dark:text-[#e4ddcc] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {t(`nav.${item.translationKey}`)}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Controls: Language, Theme, User */}
            <div className="pt-6 border-t border-[var(--color-gold)]/20 flex flex-col gap-4">
              {/* Language Switch */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-ink-light)] dark:text-[#a0a896]">
                  {t('nav.language')}
                </span>
                <button
                  onClick={toggleLanguage}
                  className="px-3 py-1 text-xs font-semibold rounded-lg border border-[var(--color-gold)]/30 bg-white/50 dark:bg-black/20 text-[var(--color-ink)] dark:text-[var(--color-cream)]"
                >
                  {locale === 'ar' ? 'English' : 'العربية'}
                </button>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-ink-light)] dark:text-[#a0a896]">
                  {t('nav.theme')}
                </span>
                <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
                  <button
                    onClick={() => setTheme('light')}
                    className={`px-2.5 py-1 text-xs rounded-md ${
                      theme === 'light' ? 'bg-[var(--color-olive)] text-white' : ''
                    }`}
                  >
                    ☀️
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`px-2.5 py-1 text-xs rounded-md ${
                      theme === 'dark' ? 'bg-[var(--color-olive)] text-white' : ''
                    }`}
                  >
                    🌙
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`px-2.5 py-1 text-xs rounded-md ${
                      theme === 'system' ? 'bg-[var(--color-olive)] text-white' : ''
                    }`}
                  >
                    💻
                  </button>
                </div>
              </div>

              {/* User Account / Login */}
              <div className="pt-2">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/5 rounded-xl">
                      <div className="w-9 h-9 rounded-full bg-[var(--color-olive)] text-[var(--color-cream)] flex items-center justify-center font-bold text-sm">
                        {displayName.charAt(0).toUpperCase() || '👤'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--color-ink)] dark:text-[var(--color-cream)] truncate">
                          {displayName}
                        </p>
                        <p className="text-[11px] text-[var(--color-ink-light)] dark:text-[#a0a896] truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center py-2 px-3 rounded-lg border border-[var(--color-gold)]/30 text-xs font-medium text-[var(--color-ink)] dark:text-[var(--color-cream)]"
                      >
                        {t('nav.myAccount')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-center py-2 px-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium"
                      >
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                ) : isGuest ? (
                  <div className="flex flex-col gap-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{t('nav.guest')}</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-ink-light)] dark:text-[#a0a896]">
                      {t('nav.guestTooltip')}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center py-2 rounded-lg border border-[var(--color-gold)]/30 text-xs font-medium"
                      >
                        {t('nav.myAccount')}
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center py-2 rounded-lg bg-[var(--color-olive)] text-white text-xs font-semibold"
                      >
                        {t('nav.login')}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-3 rounded-xl bg-[var(--color-olive)] text-white font-semibold text-sm shadow-md"
                  >
                    {t('nav.login')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
