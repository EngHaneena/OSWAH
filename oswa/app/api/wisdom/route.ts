import { NextRequest, NextResponse } from 'next/server';
import { classifyInput } from '@/lib/safety/classifier';
import { searchSituations, SituationResult } from '@/lib/retrieval/search';
import { generateWisdomResponse, GeneratedContent } from '@/lib/llm/generate';
import { validateGeneratedOutput } from '@/lib/validate/output';
import { EMERGENCY_CONTACTS, CRISIS_MESSAGE } from '@/config/emergency';

const SIMILARITY_THRESHOLD = parseFloat(process.env.SIMILARITY_THRESHOLD || '0.65');

// Rate limiting (simple in-memory — استبدل بـ Redis في الإنتاج)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // طلبات
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

    if (!userInput || userInput.length < 5) {
      return NextResponse.json(
        { error: 'يُرجى كتابة مشكلتك أو سؤالك.' },
        { status: 400 }
      );
    }

    if (userInput.length > 2000) {
      return NextResponse.json(
        { error: 'النص طويل جداً. يُرجى الاختصار.' },
        { status: 400 }
      );
    }

    // 1. فحص السلامة
    const safety = classifyInput(userInput);

    if (safety.category === 'crisis') {
      return NextResponse.json({
        type: 'crisis',
        message: CRISIS_MESSAGE,
        contacts: EMERGENCY_CONTACTS,
      });
    }

    if (safety.category === 'personal_ruling') {
      return NextResponse.json({
        type: 'personal_ruling',
        message: 'هذا الموضوع يحتاج إلى استشارة متخصص شرعي مؤهل. المنصة أداة تعليمية ولا تُصدر فتاوى في حالات شخصية محددة.',
        referral: 'يُنصح بالتواصل مع مفتي موثوق أو مركز إفتاء معتمد.',
      });
    }

    // 2. البحث بالتشابه الدلالي
    const candidates = await searchSituations(userInput, 3);

    // 3. فحص عتبة التشابه
    const topSimilarity = candidates[0]?.similarity || 0;
    if (candidates.length === 0 || topSimilarity < SIMILARITY_THRESHOLD) {
      return NextResponse.json({
        type: 'no_match',
        message: 'لم نجد موقفاً من السيرة النبوية يناسب ما تمر به. نأسف لذلك. يمكنك إعادة الصياغة أو تجربة موضوع مختلف.',
      });
    }

    // 4. المواقف بمستوى حساسية ج: عرض مقيّد
    const sensitiveCandidate = candidates.find(c => c.sensitivity_level === 'ج');
    const mainCandidates = candidates.filter(c => c.sensitivity_level !== 'ج');
    const workingCandidates = mainCandidates.length > 0 ? mainCandidates : candidates;

    // 5. التوليد
    let generated: GeneratedContent | null = null;
    let usedFallback = false;
    let selectedSituation: SituationResult | null = null;

    const candidatesForLLM = workingCandidates.map(c => ({
      id: c.id,
      title: c.title,
      lesson: c.lesson,
      prophetic_method: c.prophetic_method,
      emotions: c.emotions,
    }));

    try {
      const raw = await generateWisdomResponse(userInput, candidatesForLLM);
      const validation = validateGeneratedOutput(raw, candidatesForLLM.map(c => c.id));

      if (!validation.valid) {
        // إعادة محاولة واحدة
        console.warn('Validation failed, retrying:', validation.errors);
        const retry = await generateWisdomResponse(userInput, candidatesForLLM);
        const retryValidation = validateGeneratedOutput(retry, candidatesForLLM.map(c => c.id));

        if (!retryValidation.valid) {
          // الرجوع للقالب البديل
          usedFallback = true;
          const fallback = workingCandidates[0];
          selectedSituation = fallback;
          generated = {
            selected_id: fallback.id,
            empathy_intro: '',
            lesson_rephrase: fallback.lesson || '',
            practical_step: fallback.prophetic_method || '',
          };
        } else {
          generated = retry;
        }
      } else {
        generated = raw;
      }
    } catch (err) {
      console.error('LLM error:', err);
      usedFallback = true;
      const fallback = workingCandidates[0];
      selectedSituation = fallback;
      generated = {
        selected_id: fallback.id,
        empathy_intro: '',
        lesson_rephrase: fallback.lesson || '',
        practical_step: fallback.prophetic_method || '',
      };
    }

    // 6. جلب بيانات المصدر من قاعدة البيانات مباشرة
    if (!selectedSituation && generated?.selected_id) {
      selectedSituation = workingCandidates.find(c => c.id === generated!.selected_id) || workingCandidates[0];
    }
    if (!selectedSituation) selectedSituation = workingCandidates[0];

    // تحضير بيانات الاستجابة — النص الشرعي يأتي من قاعدة البيانات حرفياً
    const sourceData = {
      id: selectedSituation.id,
      title: selectedSituation.title,
      source_text_ar: selectedSituation.source_text_ar, // النص الأصلي كما في القاعدة
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
        used_fallback: usedFallback,
        ai_generated: !usedFallback,
      },
      source: sourceData, // يُعرض مباشرة في الواجهة دون المرور بالنموذج
      disclaimer: 'هذه المنصة أداة تعليمية مدعومة بالذكاء الاصطناعي وليست مرجعاً شرعياً.',
    });
  } catch (error) {
    console.error('Wisdom API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع. يُرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}
