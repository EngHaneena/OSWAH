"use client";
// بطاقة نتيجة «تحقّق من صحة حديث» + صورة المقارنة (المتداول والصحيح).
// النصوص كلها من رد الخلفية (بيانات الدرر)؛ الصورة تُرسم بـ HTML/CSS ثم تُحوَّل بـ html-to-image،
// فلا يولّد أي نموذج نصاً عربياً داخل صورة.   npm i html-to-image
import { useRef, useState } from "react";
import { toPng } from "html-to-image";

export type HadithCheckResult = {
  status: string;
  status_class: "authentic" | "weak" | "unknown";
  hadith_text: string;
  narrator: string;
  scholar: string;
  source: string;
  reference: string;
  takhrij: string;
  explanation: string;
  wording: "exact" | "partial" | "different" | "unverifiable";
  wording_matches_input: boolean | null;
  truncated: boolean;
  dorar_url: string;
  match_quality: string;
  provider: string;
};

export type HadithCheckResponse =
  | { success: true; input_hadith: string; result: HadithCheckResult; related?: DorarHadith[] }
  | { success: false; input_hadith: string; result: null; message: string; error?: string; related?: DorarHadith[] };

export type DorarHadith = { hadith_text: string; truncated: boolean; grade: string; status_class: "authentic" | "weak" | "unknown"; scholar: string; narrator: string; source: string; reference: string; dorar_url: string };

// حديث ثابت يُطبع أسفل كل صورة (نصه ومصدره من قاعدة أُسوة الموثقة).
const FOOTER_HADITH = {
  text: "نضَّر الله امْرَأً سمِع مقالَتي فوعاها وحفِظها وبلَّغها، فرُبَّ حاملِ فقهٍ إلى من هو أفقهُ منه، ثلاثٌ لا يغلُّ عليهنَّ قلبُ مسلمٍ: إخلاصُ العملِ للهِ، ومناصحةُ أئمَّةِ المسلمينَ، ولزومُ جماعتِهم، فإنَّ الدعوةَ تحيطُ من ورائِهم",
  source: "سنن الترمذي (2658)",
};

const sacred = { fontFamily: "'Amiri', 'Traditional Arabic', serif" } as const;

function Meta({ r }: { r: HadithCheckResult }) {
  const rows: [string, string][] = [["الراوي", r.narrator], ["المحدث", r.scholar], ["المصدر", r.source], ["الصفحة أو الرقم", r.reference], ["التخريج", r.takhrij]];
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
      {rows.filter(([, v]) => v).map(([k, v]) => (
        <div key={k} className="contents"><dt className="opacity-70">{k}:</dt><dd>{v}</dd></div>
      ))}
    </dl>
  );
}

function StatusLine({ r }: { r: HadithCheckResult }) {
  const tone = r.status_class === "authentic" ? "bg-green-50 text-green-800 border-green-300" : r.status_class === "weak" ? "bg-red-50 text-red-800 border-red-300" : "bg-amber-50 text-amber-900 border-amber-300";
  const mark = r.status_class === "authentic" ? "✓" : r.status_class === "weak" ? "⚠" : "•";
  return (
    <div className={`rounded-xl border px-4 py-2 font-bold ${tone}`}>
      {mark} حكم المحدث: {r.status}
      {r.status_class === "weak" && <div className="mt-1 text-sm font-semibold">لا يُنشر منسوباً للنبي ﷺ</div>}
    </div>
  );
}

function Footer() {
  return (
    <div className="mt-4 space-y-3 border-t border-[#E3D6B4] pt-3">
      <div className="rounded-2xl border border-[#D9C08A] bg-[#FBF5E4] px-4 py-3 text-center text-[#3F5233]">
        <p className="leading-loose" style={sacred}>{FOOTER_HADITH.text}</p>
        <p className="mt-1 text-xs text-[#7A6230]">{FOOTER_HADITH.source}</p>
      </div>
      <div className="flex items-end justify-between text-xs text-[#7A6230]">
        <span className="text-3xl font-bold text-[#0D5A43]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>أُسوة</span>
        <span>المصدر: الدرر السنية · تحقّق قبل أن تنشر</span>
      </div>
    </div>
  );
}

export default function HadithCheckCard({ data }: { data: HadithCheckResponse }) {
  const ref = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  if (!data.success) {
    return (
      <div dir="rtl" className="space-y-3 rounded-3xl border border-[#D9D0B4] bg-[#FBF8EC] p-5 text-[#1B2230]">
        <p className="font-bold">{data.message}</p>
        <p className="text-sm opacity-70">لا نحكم على النص بأنفسنا.</p>
        {data.related && data.related.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-bold">روايات ذات صلة في الدرر السنية (الحكم كما ذكره المحدث):</p>
            {data.related.map((h, i) => (
              <div key={i} className="rounded-2xl border border-[#D9C08A] bg-white p-3">
                <p className="leading-loose" style={sacred}>{h.hadith_text}</p>
                <p className={`mt-1 text-sm font-bold ${h.status_class === "weak" ? "text-red-800" : h.status_class === "authentic" ? "text-green-800" : "text-amber-900"}`}>حكم المحدث: {h.grade}</p>
                <p className="text-xs opacity-70">{[h.scholar, h.source, h.reference].filter(Boolean).join(" · ")} · <a className="underline" href={h.dorar_url} target="_blank" rel="noopener">النص في الدرر</a></p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const r = data.result;
  const different = r.wording === "different";

  const download = async () => {
    if (!ref.current) return;
    setSaving(true);
    try {
      const url = await toPng(ref.current, { pixelRatio: 2, cacheBust: true, backgroundColor: "#ffffff" });
      const a = document.createElement("a");
      a.href = url;
      a.download = different ? "oswah-hadith-comparison.png" : "oswah-hadith-check.png";
      a.click();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div dir="rtl" className="space-y-3">
      <div ref={ref} className="overflow-hidden rounded-3xl border border-[#D9D0B4] bg-white text-[#1B2230]">
        {different ? (
          <>
            {/* المقارنة: الصحيح يميناً (أول ما يُقرأ) والمتداول يساراً */}
            <div className="grid grid-cols-2">
              <section className="flex flex-col gap-3 bg-[#2E9A50] p-4 text-white">
                <div className="text-center text-2xl">✓</div>
                <p className="rounded-2xl bg-white p-3 text-center text-[#1B2230] leading-loose" style={sacred}>{r.hadith_text}</p>
                <p className="text-center text-sm font-bold">حكم المحدث: {r.status}</p>
                <p className="text-center text-xs opacity-90">{[r.source, r.reference].filter(Boolean).join(" · ")}</p>
                <h3 className="mt-auto text-center text-2xl font-bold">اللفظ الصحيح</h3>
              </section>
              <section className="flex flex-col gap-3 bg-[#DE4A4F] p-4 text-white">
                <div className="text-center text-2xl">✗</div>
                <p className="rounded-2xl bg-white p-3 text-center text-[#5A2A2A] leading-loose" style={sacred}>{data.input_hadith}</p>
                <p className="text-center text-sm font-bold">ليست لفظ الحديث كما في المصدر</p>
                <h3 className="mt-auto text-center text-2xl font-bold">الصيغة المتداولة</h3>
              </section>
            </div>
            <div className="p-4">
              <p className="font-bold">الصيغة المتداولة لا تطابق لفظ الحديث، واللفظ الصحيح كما في {[r.source, r.reference].filter(Boolean).join(" ")}، وحكم المحدث: {r.status}.</p>
              {r.explanation && <p className="mt-1 text-sm opacity-80">{r.explanation}</p>}
              <Footer />
            </div>
          </>
        ) : (
          <div className="space-y-3 p-5">
            <h3 className="text-center text-xl font-bold">تحقق من صحة الحديث</h3>
            <p className="text-sm opacity-70">نص الحديث</p>
            <p className="rounded-2xl border border-[#D9C08A] bg-[#FFFDF6] p-4 text-center text-lg leading-loose" style={sacred}>«{r.hadith_text}»</p>
            {r.wording === "partial" && <p className="text-sm opacity-80">ما كتبته جزء من هذا الحديث.</p>}
            {r.truncated && <p className="text-sm opacity-80">نص الحديث مختصر في نتيجة الدرر؛ <a className="underline" href={r.dorar_url} target="_blank" rel="noopener">اقرأه كاملاً في الدرر السنية</a>.</p>}
            <StatusLine r={r} />
            <Meta r={r} />
            <Footer />
          </div>
        )}
      </div>
      <button type="button" onClick={download} disabled={saving}
        className="w-full rounded-full bg-[#3F5233] px-5 py-3 font-bold text-[#FBF8EC] disabled:opacity-60">
        {saving ? "جارٍ التجهيز…" : different ? "تحميل صورة المقارنة (المغلوط والصحيح)" : "تحميل صورة النتيجة"}
      </button>
    </div>
  );
}
