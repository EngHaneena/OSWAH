'use client';
import { useState } from 'react';
import { IslamicDivider } from '@/components/ornaments/IslamicPattern';
import { EMERGENCY_CONTACTS, CRISIS_MESSAGE } from '@/config/emergency';

interface WisdomResultProps {
  data: any;
  problem: string;
}

export default function WisdomResult({ data, problem }: WisdomResultProps) {
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);
  const [reportConsent, setReportConsent] = useState(false);

  // حالة الأزمة النفسية
  if (data.type === 'crisis') {
    return (
      <div role="alert" className="bg-[#1a2f4a] text-white rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">💙</div>
        <p className="text-lg mb-4 leading-relaxed">{CRISIS_MESSAGE}</p>
        <div className="space-y-2">
          {EMERGENCY_CONTACTS.map(c => (
            <a
              key={c.name}
              href={`tel:${c.number}`}
              className="block bg-white/10 hover:bg-white/20 rounded-xl py-2 px-4 transition-colors"
            >
              <span className="font-medium">{c.name}</span>
              <span className="block text-sky-300" dir="ltr">{c.number}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // حالة طلب حكم شرعي
  if (data.type === 'personal_ruling') {
    return (
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6">
        <p className="text-amber-800 mb-2">{data.message}</p>
        <p className="text-amber-700 text-sm">{data.referral}</p>
      </div>
    );
  }

  // حالة عدم التطابق
  if (data.type === 'no_match') {
    return (
      <div className="bg-white/60 border border-[#B89B5E]/30 rounded-2xl p-6 text-center">
        <p className="text-[#4A6038] mb-2">{data.message}</p>
        <p className="text-xs text-[#B89B5E]">يمكنك إعادة صياغة سؤالك بصورة مختلفة.</p>
      </div>
    );
  }

  // حالة النجاح
  if (data.type !== 'success') return null;

  const { generated, source } = data;

  async function handleReport() {
    if (!reportConsent) return;
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        situation_id: source?.id,
        description: 'مستخدم أبلغ عن خطأ',
        user_consented: true,
        problem_text: problem,
      }),
    });
    setReported(true);
    setShowReport(false);
  }

  function handleDownload() {
    const url = `/api/card?lesson=${encodeURIComponent(generated?.lesson_rephrase || '')}&book=${encodeURIComponent(source?.source_book || '')}&grade=${encodeURIComponent(source?.grade || '')}&format=png`;
    window.open(url, '_blank');
  }

  return (
    <article className="space-y-5 animate-fade-in-up" aria-label="نتيجة البحث">
      {/* 1. مقدمة التعاطف */}
      {generated?.empathy_intro && !generated?.used_fallback && (
        <div className="bg-[#3F5233]/10 border-r-4 border-[#3F5233] rounded-2xl p-5">
          <p className="text-[#22301B] leading-relaxed">{generated.empathy_intro}</p>
        </div>
      )}

      <IslamicDivider />

      {/* 2. من السيرة — النص الأصلي من قاعدة البيانات */}
      <section
        className="bg-white/70 border border-[#B89B5E]/40 rounded-2xl p-5"
        aria-label="من السيرة النبوية"
      >
        <h2 className="text-sm font-medium text-[#B89B5E] mb-3 flex items-center gap-2">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <polygon points="8,1 15,4.5 15,11.5 8,15 1,11.5 1,4.5" stroke="#B89B5E" strokeWidth="1" />
          </svg>
          من السيرة النبوية
        </h2>
        <h3 className="text-[#22301B] font-semibold mb-2">{source?.title}</h3>
        {source?.source_text_ar && (
          <blockquote
            className="font-quran text-lg leading-[2.2] text-[#22301B] bg-[#F6F1E3] rounded-xl p-4 border-r-2 border-[#B89B5E]"
            dir="rtl"
          >
            {source.source_text_ar}
          </blockquote>
        )}
      </section>

      {/* 3. العبرة والخطوة العملية (مع شارة الذكاء الاصطناعي) */}
      <section className="bg-[#22301B]/5 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-medium text-[#3F5233]">العبرة والخطوة العملية</h2>
          {generated?.ai_generated && (
            <span className="ai-badge" aria-label="معدّ بمساعدة الذكاء الاصطناعي">
              ✦ مُعدّ بمساعدة الذكاء الاصطناعي
            </span>
          )}
        </div>

        {generated?.lesson_rephrase && (
          <div>
            <h3 className="text-xs text-[#B89B5E] mb-1">العبرة</h3>
            <p className="text-[#22301B] leading-relaxed">{generated.lesson_rephrase}</p>
          </div>
        )}

        {generated?.practical_step && (
          <div>
            <h3 className="text-xs text-[#B89B5E] mb-1">خطوة عملية</h3>
            <p className="text-[#22301B] leading-relaxed">{generated.practical_step}</p>
          </div>
        )}

        {generated?.used_fallback && (
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2">
            ⚠️ تم عرض الموقف مباشرة من قاعدة البيانات دون صياغة ذكاء اصطناعي.
          </p>
        )}
      </section>

      {/* 4. صندوق التوثيق */}
      <section
        className="bg-white/50 rounded-2xl p-4 text-sm text-[#4A6038] space-y-1 border border-[#B89B5E]/20"
        aria-label="معلومات المصدر"
      >
        <h2 className="font-medium text-[#22301B] mb-2">المصدر والتوثيق</h2>
        {source?.source_book && <p><span className="text-[#B89B5E]">الكتاب:</span> {source.source_book}</p>}
        {source?.source_ref && <p><span className="text-[#B89B5E]">الرقم:</span> {source.source_ref}</p>}
        {source?.narrator && <p><span className="text-[#B89B5E]">الراوي:</span> {source.narrator}</p>}
        {source?.grade && <p><span className="text-[#B89B5E]">الدرجة:</span> {source.grade}</p>}
        {source?.source_url && (
          <a href={source.source_url} target="_blank" rel="noopener noreferrer"
            className="text-[#3F5233] underline text-xs block mt-1">
            رابط المصدر ↗
          </a>
        )}
        {source?.status === 'demo' && (
          <p className="text-amber-600 text-xs mt-2">
            ⚠️ [سجل تجريبي — يُستبدل بموقف موثق قبل الإطلاق]
          </p>
        )}
        {source?.is_sensitive && (
          <p className="text-amber-700 text-xs mt-1">
            📌 هذا الموقف ينطوي على مسألة فيها خلاف — يُراجع مختص قبل التطبيق.
          </p>
        )}
      </section>

      {/* أزرار التفاعل */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          onClick={handleDownload}
          className="flex-1 min-w-[140px] bg-[#3F5233] text-white rounded-xl py-2 px-4 text-sm hover:bg-[#22301B] transition-colors focus-visible:ring-2 focus-visible:ring-[#B89B5E]"
          aria-label="تحميل بطاقة"
        >
          ⬇️ حمّل بطاقة
        </button>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'أسوة', text: generated?.lesson_rephrase || '', url: window.location.href });
            }
          }}
          className="flex-1 min-w-[140px] border border-[#3F5233] text-[#3F5233] rounded-xl py-2 px-4 text-sm hover:bg-[#3F5233]/10 transition-colors"
        >
          🔗 مشاركة
        </button>

        <button
          onClick={() => setShowReport(!showReport)}
          className="text-xs text-[#B89B5E] underline py-2 px-2"
        >
          أبلغ عن خطأ
        </button>
      </div>

      {/* نموذج البلاغ */}
      {showReport && !reported && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <label className="flex items-start gap-2 text-sm text-amber-800 cursor-pointer">
            <input
              type="checkbox"
              checked={reportConsent}
              onChange={e => setReportConsent(e.target.checked)}
              className="mt-0.5"
            />
            <span>أوافق على حفظ نص المشكلة مع البلاغ لأغراض مراجعة الجودة فقط.</span>
          </label>
          <button
            onClick={handleReport}
            disabled={!reportConsent}
            className="mt-3 bg-amber-700 text-white rounded-lg py-1.5 px-4 text-sm disabled:opacity-40"
          >
            إرسال البلاغ
          </button>
        </div>
      )}
      {reported && (
        <p className="text-green-700 text-sm">✓ تم إرسال البلاغ. شكراً لك.</p>
      )}

      <p className="text-xs text-[#4A6038] text-center">{data.disclaimer}</p>
    </article>
  );
}
