'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { COLORS, FONTS } from '@/constants/tokens';
import { IslamicDivider, ProphetGlow, IslamicCardFrame } from '@/components/ornaments/IslamicPattern';

export default function DesignPage() {
  const { t, dir } = useTranslation();

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8" dir={dir}>
      <main className="max-w-4xl mx-auto space-y-10">
        <header className="text-center">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 mb-3 border border-amber-500/30">
            بيئة التطوير — Developer Only
          </span>
          <h1
            className="text-4xl text-[var(--color-ink)] dark:text-[var(--color-cream)] mb-2"
            style={{ fontFamily: 'Aref Ruqaa, serif' }}
          >
            نظام التصميم والهوية البصرية — «أسوة»
          </h1>
          <p className="text-sm text-[var(--color-ink-light)] dark:text-[#a0a896]">
            دليل المتغيرات والألوان والرموز المعتمدة لضمان التوافق البصري وعدم كسر الهوية
          </p>
        </header>

        <IslamicDivider />

        {/* Colors Palette */}
        <section className="bg-[var(--color-surface)] dark:bg-[#1b2614] rounded-2xl p-6 border border-[var(--color-gold)]/25">
          <h2 className="text-xl font-bold text-[var(--color-ink)] dark:text-[var(--color-cream)] mb-4">
            لوحة الألوان الأساسية (Design Tokens)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(COLORS).map(([name, hex]) => (
              <div key={name} className="flex flex-col rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm">
                <div className="h-16 w-full" style={{ backgroundColor: hex }} />
                <div className="p-2.5 bg-white/70 dark:bg-black/20 text-xs">
                  <p className="font-bold text-[var(--color-ink)] dark:text-[var(--color-cream)] capitalize">{name}</p>
                  <p className="font-mono text-[10px] text-[var(--color-ink-light)] dark:text-[#a0a896] uppercase">{hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="bg-[var(--color-surface)] dark:bg-[#1b2614] rounded-2xl p-6 border border-[var(--color-gold)]/25 space-y-4">
          <h2 className="text-xl font-bold text-[var(--color-ink)] dark:text-[var(--color-cream)] mb-2">
            الخطوط المعتمدة (Typography)
          </h2>
          <div className="p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[var(--color-gold)]/20">
            <p className="text-xs text-[var(--color-gold)] font-semibold mb-1">Aref Ruqaa — شعار المشروع والعناوين الكبرى</p>
            <p className="text-3xl text-[var(--color-ink)] dark:text-[var(--color-cream)]" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
              منصة أسوة — اقتداءً بالنبي ﷺ
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[var(--color-gold)]/20">
            <p className="text-xs text-[var(--color-gold)] font-semibold mb-1">Amiri — النصوص الشرعية والآيات الكريمة</p>
            <p className="text-2xl font-quran text-[var(--color-olive)] dark:text-[var(--color-gold-light)] leading-relaxed">
              ﴿ لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ ﴾
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[var(--color-gold)]/20">
            <p className="text-xs text-[var(--color-gold)] font-semibold mb-1">IBM Plex Sans Arabic — نصوص الواجهة والأزرار</p>
            <p className="text-base text-[var(--color-ink)] dark:text-[#e4ddcc]">
              واجهة واضحة، سهلة القراءة، ومريحة للعين في جميع أوضاع الاستخدام.
            </p>
          </div>
        </section>

        {/* Symbols & Glow */}
        <section className="bg-[var(--color-surface)] dark:bg-[#1b2614] rounded-2xl p-6 border border-[var(--color-gold)]/25 flex flex-col items-center">
          <h2 className="text-xl font-bold text-[var(--color-ink)] dark:text-[var(--color-cream)] mb-4">
            رمز النور النبوي الشريف (Glow)
          </h2>
          <p className="text-xs text-center text-[var(--color-ink-light)] dark:text-[#a0a896] max-w-md mb-6">
            امتثالاً لضوابط التقديس، لا يُصوّر النبي ﷺ بأي وجه أو جسد بشري، ويُرمز له بنور مشرق ذهبي وأبيض فقط.
          </p>
          <ProphetGlow className="w-32 h-32" />
        </section>
      </main>
    </div>
  );
}
