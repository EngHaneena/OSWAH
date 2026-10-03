import { describe, it, expect } from 'vitest';
import {
  expandQueryBilingual,
  matchFallbackSituations,
  SEERAH_AUTHENTIC_DATABASE,
  EN_TO_AR_KEYWORDS,
} from '@/lib/retrieval/search';
import { generateSystemPrompt } from '@/lib/llm/bilingual-prompt';

describe('Bilingual RAG & Database Linking Guide', () => {
  it('Requirement: English to Arabic keyword expansion dictionary works accurately', () => {
    expect(EN_TO_AR_KEYWORDS['anger']).toContain('غضب');
    expect(EN_TO_AR_KEYWORDS['debt']).toContain('دين');
    expect(EN_TO_AR_KEYWORDS['leadership']).toContain('قيادة');
    expect(EN_TO_AR_KEYWORDS['consultation']).toContain('شورى');
    expect(EN_TO_AR_KEYWORDS['forgiveness']).toContain('عفو');

    const expandedAnger = expandQueryBilingual('I have heavy anger issues');
    expect(expandedAnger).toContain('غضب');

    const expandedDebt = expandQueryBilingual('I am drowning in debt');
    expect(expandedDebt).toContain('دين');
  });

  it('Requirement: Fallback Seerah database contains authentic verified records matching oswa_data.xlsx', () => {
    expect(SEERAH_AUTHENTIC_DATABASE.length).toBeGreaterThanOrEqual(8);
    const books = SEERAH_AUTHENTIC_DATABASE.map(s => s.source_book);
    expect(books.some(b => b?.includes('البخاري'))).toBe(true);
    expect(books.some(b => b?.includes('أبي داود'))).toBe(true);
    expect(books.some(b => b?.includes('مسلم') || b?.includes('أحمد'))).toBe(true);

    // Every record has authentic Arabic source text
    for (const record of SEERAH_AUTHENTIC_DATABASE) {
      expect(record.source_text_ar).toBeTruthy();
      expect(record.values_balance).toHaveLength(5);
      expect(record.lesson).toBeTruthy();
      expect(record.prophetic_method).toBeTruthy();
    }
  });

  it('Requirement: Bilingual search retrieves relevant records for both Arabic and English queries', () => {
    const angerMatches = matchFallbackSituations('غضب شديد وعصبية', 1);
    expect(angerMatches[0].title).toContain('الغضب');

    const englishAngerMatches = matchFallbackSituations('anger and rage management', 1);
    expect(englishAngerMatches[0].title).toContain('الغضب');

    const debtMatches = matchFallbackSituations('ديون وهموم متراكمة', 1);
    expect(debtMatches[0].title).toContain('الديون');

    const englishDebtMatches = matchFallbackSituations('accumulated debt and financial stress', 1);
    expect(englishDebtMatches[0].title).toContain('الديون');

    const leadershipMatches = matchFallbackSituations('leadership crisis and team dispute', 1);
    expect(leadershipMatches[0].title).toMatch(/القيادة|الخلافات/);
  });

  it('Requirement: Bilingual Agent Prompt adheres to structural rules in both Arabic and English', () => {
    const sampleEvidence = {
      situation: 'موقف المشورة في صلح الحديبية',
      solutions: 'المبادرة بالعمل بالفعل',
      evidence: 'صحيح البخاري رقم 2731',
      lessons: 'الاستماع للشريك ليس ضعفاً',
      source: 'صحيح البخاري',
    };

    // Arabic Prompt
    const arPrompt = generateSystemPrompt('كيف أدير فريقي؟', sampleEvidence, 'ar');
    expect(arPrompt).toContain('أنت المستشار (أُسوة)');
    expect(arPrompt).toContain('الاستيعاب الوجداني');
    expect(arPrompt).toContain('خطة عمل تنفيذية (3 خطوات)');
    expect(arPrompt).toContain('تذكر دائماً أن لنا في سيرة رسول الله ﷺ هدايةً ومخرجاً من كل ضيق');

    // English Prompt
    const enPrompt = generateSystemPrompt('How do I lead my team?', sampleEvidence, 'en');
    expect(enPrompt).toContain('You are "Oswah"');
    expect(enPrompt).toContain('Empathetic Resonance');
    expect(enPrompt).toContain('Actionable Roadmap (3 Steps)');
    expect(enPrompt).toContain('Authentic Source Citation');
    expect(enPrompt).toContain('Strict Constraint');
    expect(enPrompt).toContain('Remember: In the life and character of the Prophet ﷺ, there is always light');
  });
});
