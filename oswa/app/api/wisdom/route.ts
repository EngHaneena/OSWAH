import { NextRequest, NextResponse } from 'next/server';
import { classifyInput } from '@/lib/safety/classifier';
import { searchSituations, SituationResult } from '@/lib/retrieval/search';
import { generateWisdomResponse, GeneratedContent } from '@/lib/llm/generate';
import { validateGeneratedOutput } from '@/lib/validate/output';
import { EMERGENCY_CONTACTS, CRISIS_MESSAGE } from '@/config/emergency';

const SIMILARITY_THRESHOLD = parseFloat(process.env.SIMILARITY_THRESHOLD || '0.65');

// Rate limiting (simple in-memory)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 15; // طلبات
const RATE_WINDOW = 60 * 1000; // دقيقة

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'تجاوزت الحد المسموح. يُرجى الانتظار قليلاً.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const userInput: string = body.problem?.trim();
    const locale: 'ar' | 'en' = body.locale === 'en' ? 'en' : 'ar';

    if (!userInput || userInput.length < 3) {
      return NextResponse.json(
        { error: locale === 'en' ? 'Please describe your inquiry or situation.' : 'يُرجى كتابة مشكلتك أو سؤالك.' },
        { status: 400 }
      );
    }

    if (userInput.length > 2000) {
      return NextResponse.json(
        { error: locale === 'en' ? 'Text is too long. Please shorten your input.' : 'النص طويل جداً. يُرجى الاختصار.' },
        { status: 400 }
      );
    }

    // 1. فحص السلامة (Safety Classification)
    const safety = classifyInput(userInput);

    if (safety.category === 'crisis') {
      return NextResponse.json({
        type: 'crisis',
        message: locale === 'en'
          ? 'We hear you and care deeply about your well-being. Please remember that you are never alone and help is readily accessible.'
          : CRISIS_MESSAGE,
        contacts: EMERGENCY_CONTACTS,
      });
    }

    if (safety.category === 'personal_ruling') {
      return NextResponse.json({
        type: 'personal_ruling',
        message: locale === 'en'
          ? 'This matter requires personal consultation with a qualified Sharia scholar. Oswah is an educational reflection tool and does not issue legal religious verdicts (fatwas).'
          : 'هذا الموضوع يحتاج إلى استشارة متخصص شرعي مؤهل. المنصة أداة تعليمية ولا تُصدر فتاوى في حالات شخصية محددة.',
        referral: locale === 'en'
          ? 'We recommend reaching out to an accredited fatwa institution or trusted scholar.'
          : 'يُنصح بالتواصل مع مفتي موثوق أو مركز إفتاء معتمد.',
      });
    }

    // 2. البحث بالتشابه الدلالي والمطابقة الثنائية اللغة
    const candidates = await searchSituations(userInput, 3);

    // 3. فحص عتبة التشابه
    const topSimilarity = candidates[0]?.similarity || 0;
    if (candidates.length === 0 || topSimilarity < SIMILARITY_THRESHOLD) {
      return NextResponse.json({
        type: 'no_match',
        message: locale === 'en'
          ? 'No matching Prophetic event found for this specific inquiry. You may rephrase your question or explore related themes like patience, leadership, or grief.'
          : 'لم نجد موقفاً من السيرة النبوية يناسب ما تمر به بدقة. يمكنك إعادة الصياغة أو تجربة كلمات مفتاحية أخرى مثل: الصبر، القيادة، الحزن.',
      });
    }

    // 4. المواقف بمستوى حساسية ج: عرض مقيّد
    const mainCandidates = candidates.filter(c => c.sensitivity_level !== 'ج');
    const workingCandidates = mainCandidates.length > 0 ? mainCandidates : candidates;

    // 5. التوليد المعرفي والترجمة الثنائية الذكية
    let generated: GeneratedContent | null = null;
    let usedFallback = false;
    let selectedSituation: SituationResult = workingCandidates[0];

    try {
      const raw = await generateWisdomResponse(userInput, workingCandidates, locale);
      const validation = validateGeneratedOutput(
        {
          selected_id: raw.selected_id,
          empathy_intro: raw.empathy_intro,
          lesson_rephrase: raw.lesson_rephrase,
          practical_step: raw.practical_step,
        },
        workingCandidates.map(c => c.id)
      );

      if (!validation.valid) {
        console.warn('Validation flagged patterns, falling back to verified seed:', validation.errors);
        usedFallback = true;
        generated = {
          selected_id: selectedSituation.id,
          empathy_intro: locale === 'en'
            ? 'We understand the weight of your challenge and offer verified wisdom to illuminate your steps.'
            : 'نشعر بما تمر به ونلتمس لك من هدي النبوة ما يطمئن فؤادك ويسدد خطاك.',
          lesson_rephrase: selectedSituation.lesson || '',
          practical_step: selectedSituation.prophetic_method || '',
          prophetic_context: selectedSituation.story_summary || selectedSituation.title,
          actionable_steps: [
            locale === 'en' ? 'Pause and calm emotional tension completely.' : 'التروي والتهدئة التامة وتجنب الاستجابات الانفعالية اللحظية.',
            selectedSituation.prophetic_method || (locale === 'en' ? 'Act with prudence and consultation.' : 'تطبيق التوجيه النبوي بالحكمة والاستشارة.'),
            locale === 'en' ? 'Sustain with benevolence and integrity.' : 'المتابعة بالمعروف والإحسان وثبات المبدأ.'
          ],
          closing_statement: locale === 'en'
            ? 'Remember: In the life and character of the Prophet ﷺ, there is always light and a pathway out of every hardship.'
            : 'تذكر دائماً أن لنا في سيرة رسول الله ﷺ هدايةً ومخرجاً من كل ضيق.',
          values_balance: selectedSituation.values_balance || [88, 92, 78, 86, 84],
        };
      } else {
        generated = raw;
      }
    } catch (err) {
      console.error('LLM error:', err);
      usedFallback = true;
      generated = {
        selected_id: selectedSituation.id,
        empathy_intro: locale === 'en'
          ? 'We understand the weight of your challenge and offer verified wisdom to illuminate your steps.'
          : 'نشعر بما تمر به ونلتمس لك من هدي النبوة ما يطمئن فؤادك ويسدد خطاك.',
        lesson_rephrase: selectedSituation.lesson || '',
        practical_step: selectedSituation.prophetic_method || '',
        prophetic_context: selectedSituation.story_summary || selectedSituation.title,
        actionable_steps: [
          locale === 'en' ? 'Pause and calm emotional tension completely.' : 'التروي والتهدئة التامة وتجنب الاستجابات الانفعالية اللحظية.',
          selectedSituation.prophetic_method || (locale === 'en' ? 'Act with prudence and consultation.' : 'تطبيق التوجيه النبوي بالحكمة والاستشارة.'),
          locale === 'en' ? 'Sustain with benevolence and integrity.' : 'المتابعة بالمعروف والإحسان وثبات المبدأ.'
        ],
        closing_statement: locale === 'en'
          ? 'Remember: In the life and character of the Prophet ﷺ, there is always light and a pathway out of every hardship.'
          : 'تذكر دائماً أن لنا في سيرة رسول الله ﷺ هدايةً ومخرجاً من كل ضيق.',
        values_balance: selectedSituation.values_balance || [88, 92, 78, 86, 84],
      };
    }

    if (generated?.selected_id) {
      const match = workingCandidates.find(c => c.id === generated!.selected_id);
      if (match) selectedSituation = match;
    }

    // 6. جلب بيانات المصدر الشرعي — النص الشرعي يظل باللغة العربية حصراً ولا يُترجم
    const sourceData = {
      id: selectedSituation.id,
      title: selectedSituation.title,
      source_text_ar: selectedSituation.source_text_ar, // دائماً بالعربية الفصحى فقط
      source_book: selectedSituation.source_book,
      source_ref: selectedSituation.source_ref,
      narrator: selectedSituation.narrator,
      grade: selectedSituation.grade,
      source_url: selectedSituation.source_url,
      sensitivity_level: selectedSituation.sensitivity_level,
      status: selectedSituation.status,
      is_sensitive: selectedSituation.sensitivity_level === 'ج',
    };

    return NextResponse.json({
      type: 'success',
      generated: {
        empathy_intro: generated!.empathy_intro,
        lesson_rephrase: generated!.lesson_rephrase,
        practical_step: generated!.practical_step,
        prophetic_context: generated!.prophetic_context,
        actionable_steps: generated!.actionable_steps || [
          locale === 'en' ? 'Pause and calm emotional tension completely.' : 'التروي والتهدئة التامة وتجنب الاستجابات الانفعالية.',
          selectedSituation.prophetic_method || (locale === 'en' ? 'Act with prudence.' : 'المبادرة بالحكمة والشورى.'),
          locale === 'en' ? 'Sustain with benevolence.' : 'المتابعة بالمعروف والإحسان.'
        ],
        closing_statement: generated!.closing_statement || (locale === 'en'
          ? 'Remember: In the life and character of the Prophet ﷺ, there is always light and a pathway out of every hardship.'
          : 'تذكر دائماً أن لنا في سيرة رسول الله ﷺ هدايةً ومخرجاً من كل ضيق.'),
        values_balance: generated!.values_balance || selectedSituation.values_balance || [88, 92, 78, 86, 84],
        used_fallback: usedFallback,
        ai_generated: !usedFallback,
      },
      source: sourceData,
      disclaimer: locale === 'en'
        ? 'This platform is an AI-assisted educational tool and not a legal Sharia authority. Sacred texts are preserved in their original Arabic wording.'
        : 'هذه المنصة أداة تعليمية مدعومة بالذكاء الاصطناعي وليست مرجعاً شرعياً. النصوص الشرعية محفوظة بألفاظها العربية الأصيلة.',
    });
  } catch (error) {
    console.error('Wisdom API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع. يُرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}
