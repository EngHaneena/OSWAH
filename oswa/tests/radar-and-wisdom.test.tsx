import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ValuesRadarChart from '@/components/charts/ValuesRadarChart';
import WisdomResult from '@/components/cards/WisdomResult';
import { LanguageProvider } from '@/lib/i18n';

describe('ValuesRadarChart and WisdomResult Component Suite', () => {
  it('ValuesRadarChart renders SVG polygon radar with 5 value axes', () => {
    render(
      <LanguageProvider>
        <ValuesRadarChart values={[85, 90, 75, 88, 80]} />
      </LanguageProvider>
    );

    const svg = screen.getByRole('img');
    expect(svg).toBeDefined();

    // Verify radar labels in Arabic
    expect(screen.getByText('الحكمة والتروي')).toBeDefined();
    expect(screen.getByText('الصبر والمرونة')).toBeDefined();
    expect(screen.getByText('الحزم والعدل')).toBeDefined();
    expect(screen.getByText('الاحتواء والتعاطف')).toBeDefined();
    expect(screen.getByText('التشاور والمشاركة')).toBeDefined();

    // Percentage values displayed
    expect(screen.getByText('85%')).toBeDefined();
    expect(screen.getByText('90%')).toBeDefined();
  });

  it('WisdomResult displays authentic Arabic Hadith text, 3-step actionable roadmap, and radar', () => {
    const mockSuccessData = {
      type: 'success',
      generated: {
        empathy_intro: 'نشعر بما تمر به ونقدر صعوبة هذا الموقف.',
        lesson_rephrase: 'التحكم في الانفعال هو جوهر القوة الحقيقية.',
        prophetic_context: 'قصة وصية النبي ﷺ للرجل ألا يغضب.',
        actionable_steps: [
          'الخطوة 1: التروي والهدوء التام لمدة 24 ساعة.',
          'الخطوة 2: تغيير الهيئة والوضوء والتعوذ بالله.',
          'الخطوة 3: التحدث بالرفق بعد هدوء العاصفة.'
        ],
        closing_statement: 'تذكر دائماً أن لنا في سيرة رسول الله ﷺ هدايةً ومخرجاً من كل ضيق.',
        values_balance: [85, 95, 75, 88, 70],
        ai_generated: true,
      },
      source: {
        id: 'seerah-001',
        title: 'إدارة الغضب وضبط الانفعال وحفظ السكينة',
        source_text_ar: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ، أَنَّ رَجُلاً قَالَ لِلنَّبِيِّ ﷺ: أَوْصِنِي، قَالَ: «لاَ تَغْضَبْ».',
        source_book: 'صحيح البخاري',
        source_ref: 'رقم 6116',
        grade: 'صحيح',
      },
      disclaimer: 'هذه المنصة أداة تعليمية وليست مرجعاً شرعياً.',
    };

    render(
      <LanguageProvider>
        <WisdomResult data={mockSuccessData} problem="أعاني من سرعة الغضب والانفعال" />
      </LanguageProvider>
    );

    // Sacred Arabic text is present and within blockquote with dir="rtl"
    const hadithBlockquote = screen.getByText(/لاَ تَغْضَبْ/);
    expect(hadithBlockquote).toBeDefined();
    expect(hadithBlockquote.getAttribute('dir')).toBe('rtl');

    // Empathy intro is displayed
    expect(screen.getByText(/نشعر بما تمر به/)).toBeDefined();

    // 3 Actionable steps are present
    expect(screen.getByText(/الخطوة 1: التروي والهدوء/)).toBeDefined();
    expect(screen.getByText(/الخطوة 2: تغيير الهيئة/)).toBeDefined();
    expect(screen.getByText(/الخطوة 3: التحدث بالرفق/)).toBeDefined();

    // Clicking step toggles completed state
    const step1 = screen.getByText(/الخطوة 1: التروي والهدوء/);
    fireEvent.click(step1);

    // Download Action Card button is present
    const downloadBtn = screen.getByRole('button', { name: /تحميل خطة العمل/ });
    expect(downloadBtn).toBeDefined();

    // Source book is cited
    expect(screen.getAllByText(/صحيح البخاري/).length).toBeGreaterThan(0);
  });

  it('WisdomResult handles crisis and personal ruling safely', () => {
    const crisisData = {
      type: 'crisis',
      message: 'نحن معك ونقدر مشاعرك. يُرجى التواصل مع الدعم المتخصص فوراً.',
    };

    const { rerender } = render(
      <LanguageProvider>
        <WisdomResult data={crisisData} problem="أشعر برغبة في إنهاء حياتي" />
      </LanguageProvider>
    );

    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText(/نحن معك/)).toBeDefined();

    const rulingData = {
      type: 'personal_ruling',
      message: 'هذا الموضوع يحتاج إلى استشارة متخصص شرعي مؤهل.',
      referral: 'يُنصح بالتواصل مع دار الإفتاء.',
    };

    rerender(
      <LanguageProvider>
        <WisdomResult data={rulingData} problem="هل يجوز لي كذا وكذا شرعاً؟" />
      </LanguageProvider>
    );

    expect(screen.getByText(/استشارة متخصص شرعي مؤهل/)).toBeDefined();
  });
});
