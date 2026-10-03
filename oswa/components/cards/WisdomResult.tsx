'use client';

import { useState } from 'react';
import { IslamicDivider } from '@/components/ornaments/IslamicPattern';
import { EMERGENCY_CONTACTS, CRISIS_MESSAGE } from '@/config/emergency';
import { useTranslation } from '@/lib/i18n';
import ValuesRadarChart from '@/components/charts/ValuesRadarChart';

interface WisdomResultProps {
  data: any;
  problem: string;
}

export default function WisdomResult({ data, problem }: WisdomResultProps) {
  const { t, isArabic, locale } = useTranslation();
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);
  const [reportConsent, setReportConsent] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  // حالة الأزمة النفسية
  if (data.type === 'crisis') {
    return (
      <div role="alert" className="bg-[#1a2f4a] text-white rounded-2xl p-6 text-center shadow-lg border border-sky-400/30">
        <div className="text-4xl mb-3">💙</div>
        <p className="text-lg mb-4 leading-relaxed font-medium">{data.message || CRISIS_MESSAGE}</p>
        <div className="space-y-2 max-w-md mx-auto">
          {EMERGENCY_CONTACTS.map((c) => (
            <a
              key={c.name}
              href={`tel:${c.number}`}
              className="flex justify-between items-center bg-white/10 hover:bg-white/20 rounded-xl py-2.5 px-4 transition-colors"
            >
              <span className="font-semibold">{c.name}</span>
              <span className="font-mono text-sky-300 font-bold" dir="ltr">{c.number}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // حالة طلب حكم شرعي
  if (data.type === 'personal_ruling') {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-300 font-bold">
          <span>⚠️</span>
          <span>{isArabic ? 'تنبيه استشاري' : 'Advisory Note'}</span>
        </div>
        <p className="text-amber-900 dark:text-amber-200 mb-2 leading-relaxed">{data.message}</p>
        <p className="text-amber-700 dark:text-amber-400 text-sm font-medium">{data.referral}</p>
      </div>
    );
  }

  // حالة عدم التطابق
  if (data.type === 'no_match') {
    return (
      <div className="bg-white/80 dark:bg-black/30 border border-[#B89B5E]/30 rounded-2xl p-6 text-center shadow-sm">
        <p className="text-[#4A6038] dark:text-[#a0b890] mb-2 font-medium">{data.message}</p>
        <p className="text-xs text-[#B89B5E]">
          {isArabic ? 'يمكنك إعادة صياغة سؤالك بكلمات مثل: صبر، قيادة، استشارة، غضب، دين.' : 'Try keywords such as: patience, leadership, consultation, anger, debt.'}
        </p>
      </div>
    );
  }

  // حالة النجاح
  if (data.type !== 'success') return null;

  const { generated, source } = data;

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  async function handleReport() {
    if (!reportConsent) return;
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation_id: source?.id,
          description: 'مستخدم أبلغ عن ملاحظة',
          user_consented: true,
          problem_text: problem,
        }),
      });
      setReported(true);
      setShowReport(false);
    } catch {
      setReported(true);
    }
  }

  function handleDownloadActionPlan() {
    const stepsText = Array.isArray(generated?.actionable_steps)
      ? generated.actionable_steps.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n\n')
      : generated?.practical_step || '';

    const content = `=====================================================
✨ ${isArabic ? 'منصة أسـوة | بطاقة العمل التنفيذية من السيرة النبوية' : 'Oswah Platform | Executive Prophetic Action Card'}
=====================================================

${isArabic ? 'المشكلة / الاستفسار:' : 'User Dilemma / Inquiry:'}
"${problem}"

-----------------------------------------------------
🌿 ${isArabic ? 'الاستيعاب الوجداني:' : 'Empathetic Guidance:'}
${generated?.empathy_intro || ''}

-----------------------------------------------------
📖 ${isArabic ? 'من السيرة النبوية (المصدر المعتمد):' : 'Prophetic Context & Authentic Source:'}
${source?.title || ''}
${source?.source_text_ar ? `\n[النص الشرعي العربي الأصيل]:\n${source.source_text_ar}\n` : ''}
${source?.source_book ? `${isArabic ? 'الكتاب:' : 'Book:'} ${source.source_book}` : ''} | ${source?.source_ref ? `${isArabic ? 'المرجع:' : 'Ref:'} ${source.source_ref}` : ''} | ${source?.grade ? `${isArabic ? 'الدرجة:' : 'Grade:'} ${source.grade}` : ''}

-----------------------------------------------------
💡 ${isArabic ? 'الحكمة والمبدأ الجوهري:' : 'Core Principle & Lesson:'}
${generated?.lesson_rephrase || generated?.prophetic_context || ''}

-----------------------------------------------------
🎯 ${isArabic ? 'خطة العمل التنفيذية (خلال 24-48 ساعة):' : 'Immediate Actionable Roadmap (24-48 Hours):'}
${stepsText}

-----------------------------------------------------
✨ ${generated?.closing_statement || (isArabic ? 'تذكر دائماً أن لنا في سيرة رسول الله ﷺ هدايةً ومخرجاً من كل ضيق.' : 'Remember: In the life and character of the Prophet ﷺ, there is always light and a pathway out of every hardship.')}

=====================================================
${t('wisdom.disclaimer')}
https://islamicaich.org/
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Oswah_Action_Card_${locale}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleShare() {
    const textToShare = `${isArabic ? 'من هدي السيرة النبوية عبر منصة أسوة:' : 'Prophetic wisdom from Oswah Platform:'}\n\n${generated?.lesson_rephrase || ''}\n\n${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: isArabic ? 'أسوة | بصيرة نبوية' : 'Oswah | Prophetic Guidance',
        text: textToShare,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  const steps: string[] = Array.isArray(generated?.actionable_steps) && generated.actionable_steps.length > 0
    ? generated.actionable_steps
    : [
        generated?.practical_step || (isArabic ? 'التروي وضبط النفس قبل اتخاذ القرار.' : 'Pause and reflect calmly.'),
        isArabic ? 'التشاور مع أصحاب الحكمة والمبادرة بالفعل الإيجابي.' : 'Seek counsel and take positive initiative.',
        isArabic ? 'المتابعة بالمعروف وحفظ الحقوق والروابط.' : 'Sustain action with grace and integrity.'
      ];

  return (
    <article className="space-y-6 animate-fade-in-up" aria-label={t('wisdom.fromSeerah')}>
      {/* 1. مقدمة الاستيعاب الوجداني (Empathetic Resonance) */}
      {generated?.empathy_intro && (
        <div className="bg-[#3F5233]/10 dark:bg-[#F5F2EB] border-s-4 border-[#3F5233] dark:border-amber-600/60 rounded-2xl p-5 shadow-sm border dark:border-amber-500/20">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[#3F5233] dark:text-[#8B6914]">
            <span>🌿</span>
            <span>{isArabic ? 'الاستيعاب الوجداني' : 'Empathetic Resonance'}</span>
          </div>
          <p className="text-[#22301B] dark:text-[#1E293B] leading-relaxed text-base font-medium">
            {generated.empathy_intro}
          </p>
        </div>
      )}

      <IslamicDivider className="opacity-40" />

      {/* 2. من السيرة النبوية — النص الأصلي محفوظ بالعربية دائماً */}
      <section
        className="bg-white/80 dark:bg-[#F5F2EB] border border-[#B89B5E]/40 dark:border-amber-500/20 rounded-2xl p-6 shadow-sm relative overflow-hidden"
        aria-label={t('wisdom.fromSeerah')}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-bold text-[#B89B5E] dark:text-[#8B6914] flex items-center gap-2">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polygon points="8,1 15,4.5 15,11.5 8,15 1,11.5 1,4.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {t('wisdom.fromSeerah')}
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#B89B5E]/15 dark:bg-amber-100 text-[#8B6914] dark:text-amber-900 font-medium">
            {source?.source_book || 'مصدر معتمد'}
          </span>
        </div>

        <h3 className="text-[#22301B] dark:text-[#1E293B] text-xl font-bold mb-3 font-[--font-brand]">
          {source?.title}
        </h3>

        {/* النص الشرعي بالعربية حصراً وبخط المصحف/أميري */}
        {source?.source_text_ar && (
          <blockquote
            className="font-quran text-lg md:text-xl leading-[2.3] text-[#22301B] dark:text-[#1E293B] bg-[#F6F1E3]/80 dark:bg-[#EFECE4] rounded-xl p-5 border-s-4 border-[#B89B5E] dark:border-amber-600 my-3 shadow-inner"
            dir="rtl"
            lang="ar"
          >
            {source.source_text_ar}
          </blockquote>
        )}
      </section>

      {/* 3. الحكمة والمبدأ المستخلص */}
      <section className="bg-white/60 dark:bg-[#F5F2EB] rounded-2xl p-5 border border-[#B89B5E]/20 dark:border-amber-500/20 space-y-2 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-bold text-[#B89B5E] dark:text-[#8B6914] uppercase tracking-wider">
            {t('wisdom.coreLesson')}
          </h3>
          {generated?.ai_generated && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#3F5233]/10 dark:bg-emerald-100/80 text-[#3F5233] dark:text-emerald-900 border border-[#3F5233]/20 dark:border-emerald-300">
              ✦ {t('wisdom.aiBadge')}
            </span>
          )}
        </div>
        <p className="text-[#22301B] dark:text-[#1E293B] leading-relaxed text-base font-medium">
          {generated?.lesson_rephrase || generated?.prophetic_context}
        </p>
      </section>

      {/* 4. خطة العمل التنفيذية (Immediate Actionable Roadmap) */}
      <section className="bg-[#22301B]/5 dark:bg-[#F5F2EB] rounded-2xl p-6 border border-[#3F5233]/20 dark:border-amber-500/20 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🎯</span>
          <h3 className="text-base font-bold text-[#22301B] dark:text-[#1E293B]">
            {t('wisdom.actionPlanTitle')}
          </h3>
        </div>

        <div className="space-y-3">
          {steps.map((stepText, idx) => {
            const isDone = !!completedSteps[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isDone
                    ? 'bg-[#3F5233]/15 dark:bg-amber-100/70 border-[#3F5233]/40 dark:border-amber-400 text-[#22301B]/60 dark:text-[#1E293B]/50 line-through'
                    : 'bg-white/80 dark:bg-[#EFECE4] border-[#B89B5E]/25 dark:border-amber-500/20 hover:border-[#3F5233]/50 text-[#22301B] dark:text-[#1E293B] shadow-sm'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                  isDone ? 'bg-[#3F5233] text-white' : 'bg-[#B89B5E]/20 text-[#8B6914] dark:bg-amber-200 dark:text-amber-900'
                }`}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <div className="text-sm md:text-base leading-relaxed font-medium">
                  {stepText}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. رادار التوازن القيمي النبوي (Values Alignment Radar Chart) */}
      <section className="my-6">
        <ValuesRadarChart values={generated?.values_balance || [88, 92, 78, 86, 84]} />
      </section>

      {/* 6. صندوق التوثيق والمصدر المعتمد */}
      <section
        className="bg-white/50 dark:bg-[#F5F2EB] rounded-2xl p-5 text-sm text-[#4A6038] dark:text-[#1E293B] space-y-1.5 border border-[#B89B5E]/20 dark:border-amber-500/20 shadow-sm"
        aria-label={t('wisdom.sourceTitle')}
      >
        <h4 className="font-bold text-[#22301B] dark:text-[#1E293B] mb-2 flex items-center gap-2 text-base">
          <span>📜</span>
          <span>{t('wisdom.sourceTitle')}</span>
        </h4>
        {source?.source_book && (
          <p><span className="text-[#B89B5E] dark:text-[#8B6914] font-medium">{t('wisdom.sourceBook')}:</span> {source.source_book}</p>
        )}
        {source?.source_ref && (
          <p><span className="text-[#B89B5E] dark:text-[#8B6914] font-medium">{t('wisdom.sourceRef')}:</span> {source.source_ref}</p>
        )}
        {source?.narrator && (
          <p><span className="text-[#B89B5E] dark:text-[#8B6914] font-medium">{t('wisdom.sourceNarrator')}:</span> {source.narrator}</p>
        )}
        {source?.grade && (
          <p><span className="text-[#B89B5E] dark:text-[#8B6914] font-medium">{t('wisdom.sourceGrade')}:</span> {source.grade}</p>
        )}
        {source?.source_url && (
          <a
            href={source.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3F5233] dark:text-[#8B6914] hover:underline text-xs inline-block mt-2 font-medium"
          >
            {t('wisdom.sourceLink')}
          </a>
        )}
      </section>

      {/* 7. الخاتمة النبوية */}
      <div className="text-center p-4 rounded-2xl bg-[#F6F1E3]/50 dark:bg-[#F5F2EB] border border-[#B89B5E]/20 dark:border-amber-500/20 shadow-sm">
        <p className="text-sm font-semibold text-[#3F5233] dark:text-[#1E293B] italic">
          "{generated?.closing_statement || (isArabic
            ? 'تذكر دائماً أن لنا في سيرة رسول الله ﷺ هدايةً ومخرجاً من كل ضيق.'
            : 'Remember: In the life and character of the Prophet ﷺ, there is always light and a pathway out of every hardship.')}"
        </p>
      </div>

      {/* 8. أزرار التفاعل وبطاقة العمل (Action Card) */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleDownloadActionPlan}
          className="flex-1 min-w-[200px] bg-[#3F5233] hover:bg-[#22301B] text-white font-bold rounded-xl py-3 px-5 text-sm transition-all duration-200 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#B89B5E] flex items-center justify-center gap-2"
        >
          <span>📥</span>
          <span>{t('wisdom.downloadCard')}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex-1 min-w-[140px] border-2 border-[#3F5233] text-[#3F5233] dark:text-[#9bc282] dark:border-[#9bc282] hover:bg-[#3F5233]/10 font-bold rounded-xl py-3 px-4 text-sm transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>🔗</span>
          <span>{copied ? t('wisdom.copiedSuccess') : t('wisdom.share')}</span>
        </button>

        <button
          onClick={() => setShowReport(!showReport)}
          className="text-xs text-[#B89B5E] hover:underline py-2 px-3 transition-colors"
        >
          {t('wisdom.report')}
        </button>
      </div>

      {/* نموذج الإبلاغ عن خطأ */}
      {showReport && !reported && (
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800/40 animate-fade-in-up">
          <label className="flex items-start gap-2 text-xs md:text-sm text-amber-900 dark:text-amber-200 cursor-pointer">
            <input
              type="checkbox"
              checked={reportConsent}
              onChange={(e) => setReportConsent(e.target.checked)}
              className="mt-0.5 rounded border-amber-400"
            />
            <span>{t('wisdom.reportConsent')}</span>
          </label>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleReport}
              disabled={!reportConsent}
              className="bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg py-1.5 px-4 text-xs transition-colors disabled:opacity-40"
            >
              {t('wisdom.sendReport')}
            </button>
            <button
              onClick={() => setShowReport(false)}
              className="border border-amber-400 text-amber-800 dark:text-amber-300 rounded-lg py-1.5 px-3 text-xs"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {reported && (
        <p className="text-green-700 dark:text-green-400 text-sm font-semibold text-center">
          ✓ {t('wisdom.reportSuccess')}
        </p>
      )}

      <p className="text-[11px] text-[#4A6038] dark:text-[#8ea781] text-center pt-2 leading-relaxed">
        {t('wisdom.disclaimer')}
      </p>
    </article>
  );
}
