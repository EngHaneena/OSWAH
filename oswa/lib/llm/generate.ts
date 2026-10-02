import { getLLMClient, getModel } from './client';
import type { SituationResult } from '@/lib/retrieval/search';

export interface GeneratedContent {
  selected_id: string | null;
  empathy_intro: string;
  lesson_rephrase: string;
  practical_step: string;
}

const SYSTEM_PROMPT = `أنت مساعد يعمل ضمن منصة «أسوة» الإسلامية التي تعرض مواقف من السيرة النبوية.
قواعد صارمة لا تُخالَف:
1. لا تذكر حديثاً أو واقعة أو رقماً غير موجود في السياق المعطى.
2. لا تصدر فتوى ولا حكماً شرعياً على حالة شخصية.
3. لا تنقل نصاً شرعياً حرفياً أو تضعه بين علامات اقتباس.
4. لا تعرض مسألة خلافية بصيغة القطع.
5. لا تصوّر النبي ﷺ ولا تصفه وصفاً جسدياً.
6. إن لم يكن أي موقف مناسباً، أعد selected_id: null.
7. ردّ بـ JSON فقط وفق الشكل المطلوب، بدون أي نص إضافي.
8. اللغة عربية فصحى هادئة وإيجابية.
9. empathy_intro: جملتان كحد أقصى.
10. lesson_rephrase: ثلاث جمل كحد أقصى.
11. practical_step: جملتان، مستمدتان من lesson وprophetic_method فقط.`;

export async function generateWisdomResponse(
  userProblem: string,
  candidates: Pick<SituationResult, 'id' | 'title' | 'lesson' | 'prophetic_method' | 'emotions'>[]
): Promise<GeneratedContent> {
  const client = getLLMClient();
  const model = getModel();

  const candidatesContext = candidates
    .map((c, i) => `[${i + 1}] id: "${c.id}"\nالعنوان: ${c.title}\nالعبرة: ${c.lesson}\nالأسلوب النبوي: ${c.prophetic_method}\nالمشاعر: ${(c.emotions || []).join('، ')}`)
    .join('\n\n');

  const userMessage = `مشكلة المستخدم: "${userProblem}"

المواقف المتاحة:
${candidatesContext}

اختر الموقف الأنسب وأعد JSON بالشكل:
{
  "selected_id": "id الموقف أو null",
  "empathy_intro": "...",
  "lesson_rephrase": "...",
  "practical_step": "..."
}`;

  const message = await client.messages.create({
    model,
    max_tokens: 1024,
    temperature: 0.3,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('استجابة غير متوقعة من النموذج');

  const parsed = JSON.parse(content.text) as GeneratedContent;
  return parsed;
}
