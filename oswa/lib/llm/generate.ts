import { getLLMClient, getModel } from './client';
import type { SituationResult } from '@/lib/retrieval/search';
import { generateSystemPrompt } from './bilingual-prompt';

export interface GeneratedContent {
  selected_id: string | null;
  empathy_intro: string;
  lesson_rephrase: string;
  practical_step: string;
  prophetic_context?: string;
  actionable_steps?: string[];
  source_citation?: string;
  closing_statement?: string;
  values_balance?: number[];
}

export async function generateWisdomResponse(
  userProblem: string,
  candidates: SituationResult[],
  language: 'ar' | 'en' = 'ar'
): Promise<GeneratedContent> {
  const topCandidate = candidates[0];

  // في حال توفر مفاتيح LLM الخارجية، نقوم بالاستدعاء المباشر
  if (process.env.ANTHROPIC_API_KEY && process.env.LLM_MODEL) {
    try {
      const client = getLLMClient();
      const model = getModel();

      const evidenceData = {
        situation: topCandidate?.story_summary || topCandidate?.title || '',
        solutions: topCandidate?.prophetic_method || '',
        evidence: topCandidate?.source_text_ar || '',
        lessons: topCandidate?.lesson || '',
        source: `${topCandidate?.source_book || ''} - ${topCandidate?.source_ref || ''}`,
      };

      const systemPrompt = generateSystemPrompt(userProblem, evidenceData, language);

      const message = await client.messages.create({
        model,
        max_tokens: 1024,
        temperature: 0.3,
        system: systemPrompt,
        messages: [{ role: 'user', content: `المشكلة أو الاستفسار: "${userProblem}"` }],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        const cleaned = content.text.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return {
          selected_id: topCandidate.id,
          empathy_intro: parsed.empathy_intro || '',
          lesson_rephrase: parsed.prophetic_context || parsed.lesson_rephrase || topCandidate.lesson || '',
          practical_step: Array.isArray(parsed.actionable_steps)
            ? parsed.actionable_steps.join('\n')
            : parsed.practical_step || topCandidate.prophetic_method || '',
          prophetic_context: parsed.prophetic_context || topCandidate.lesson || '',
          actionable_steps: Array.isArray(parsed.actionable_steps) ? parsed.actionable_steps : [
            language === 'en' ? 'Pause & Reflect (24h): Take a calm step back.' : 'التروي والهدوء: تجنب رد الفعل الانفعالي اللحظي.',
            topCandidate.prophetic_method || (language === 'en' ? 'Act with wisdom.' : 'المبادرة بالحكمة والرفق.'),
            language === 'en' ? 'Sustain with grace and empathy.' : 'المتابعة بالمعروف وحفظ الحقوق.'
          ],
          source_citation: parsed.source_citation || `${topCandidate.source_book} (${topCandidate.source_ref})`,
          closing_statement: parsed.closing_statement || (language === 'en'
            ? 'Remember: In the life and character of the Prophet ﷺ, there is always light and a pathway out of every hardship.'
            : 'تذكر دائماً أن لنا في سيرة رسول الله ﷺ هدايةً ومخرجاً من كل ضيق.'),
          values_balance: topCandidate.values_balance || [88, 92, 78, 86, 84],
        };
      }
    } catch (llmErr) {
      console.warn('Anthropic API call skipped or failed, using authentic verified generation:', (llmErr as any)?.message || llmErr);
    }
  }

  // التوليد الآمن الرصين المستند إلى بيانات السيرة الموثقة
  if (language === 'en') {
    return {
      selected_id: topCandidate?.id || null,
      empathy_intro: 'We deeply feel the weight of this challenge you are navigating. Take heart in knowing that authentic wisdom offers clarity and steady guidance through modern dilemmas.',
      lesson_rephrase: topCandidate?.lesson || 'Steadfast patience, ethical clarity, and consultation are the foundation of overcoming personal and workplace obstacles.',
      practical_step: topCandidate?.prophetic_method || 'Pause before reacting, seek wise counsel, and take measured benevolent action.',
      prophetic_context: topCandidate?.story_summary || topCandidate?.title || '',
      actionable_steps: [
        'Step 1 (First 24 hours): Pause and refrain from any reactive decisions; restore emotional balance through calm reflection.',
        `Step 2 (Within 48 hours): Implement the prophetic method: ${topCandidate?.prophetic_method || 'Seek prudent consultation and take measured practical initiative'}.`,
        'Step 3 (Ongoing): Sustain your actions with patience, benevolence, and steadfast integrity.'
      ],
      source_citation: `${topCandidate?.source_book || 'Authentic Seerah'} - ${topCandidate?.source_ref || ''}`,
      closing_statement: 'Remember: In the life and character of the Prophet ﷺ, there is always light and a pathway out of every hardship.',
      values_balance: topCandidate?.values_balance || [88, 92, 78, 86, 84],
    };
  }

  return {
    selected_id: topCandidate?.id || null,
    empathy_intro: 'نشعر بما تمر به ونقدر ثقل هذه التجربة والتحدي الذي يواجهك، ونسأل الله أن يلهمك السكينة ويهديك لأحسن السبل.',
    lesson_rephrase: topCandidate?.lesson || 'الحكمة والتوازن وضبط النفس هي الركائز الأساسية لتجاوز العقبات وحفظ العلاقات.',
    practical_step: topCandidate?.prophetic_method || 'التروي، والاستشارة، والمبادرة بالعمل النافع دون تردد.',
    prophetic_context: topCandidate?.story_summary || topCandidate?.title || '',
    actionable_steps: [
      'الخطوة الأولى (خلال 24 ساعة): التروي والتهدئة التامة وتجنب أي رد فعل انفعالي لحظي حتى تسكن النفس.',
      `الخطوة الثانية (خلال 48 ساعة): تطبيق الهدي النبوي: ${topCandidate?.prophetic_method || 'المبادرة بالحكمة والتشاور واتخاذ الخطوة العملية المباشرة'}.`,
      'الخطوة الثالثة (التطبيق المستمر): المتابعة بالرفق والإحسان وصيانة الحقوق وثبات المبدأ.'
    ],
    source_citation: `${topCandidate?.source_book || 'المصادر المعتمدة للسيرة'} - ${topCandidate?.source_ref || ''}`,
    closing_statement: 'تذكر دائماً أن لنا في سيرة رسول الله ﷺ هدايةً ومخرجاً من كل ضيق.',
    values_balance: topCandidate?.values_balance || [88, 92, 78, 86, 84],
  };
}
