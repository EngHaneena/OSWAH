'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial dark mode from localStorage or system
    const isDarkMode = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const tabs = [
    { name: 'عظة وعبرة', path: '/wisdom', icon: '🌿' },
    { name: 'ركن الأطفال', path: '/kids', icon: '⭐' },
  ];

  return (
    <nav className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-[#B89B5E]/30 shadow-sm transition-colors" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/" className="text-3xl text-[#3F5233] hover:text-[#22301B] transition-colors" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
          أسوة
        </Link>
        
        {/* Tabs */}
        <div className="flex gap-1 sm:gap-4 flex-1 justify-center">
          {tabs.map(tab => {
            const isActive = pathname.startsWith(tab.path);
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-[#3F5233] text-[#F6F1E3] shadow-md scale-105'
                    : 'bg-transparent text-[#4A6038] hover:bg-black/5 hover:text-[#3F5233]'
                }`}
              >
                <span className="text-lg sm:text-xl">{tab.icon}</span>
                <span className="font-semibold text-xs sm:text-base">{tab.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-black/5 transition-colors text-[#4A6038]"
            title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          
          <Link 
            href="/profile"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#B89B5E]/20 text-[#3F5233] hover:bg-[#B89B5E]/40 transition-colors"
            title="حسابي"
          >
            👤
          </Link>
        </div>
      </div>
    </nav>
  );
}
