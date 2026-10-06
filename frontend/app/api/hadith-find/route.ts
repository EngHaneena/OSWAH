// «ابحث عن حديث» ← سيرفر البايثون /api/hadith-find ← Dorar API (بلا OpenAI)، والنتائج تُعاد كما هي.
import { NextResponse } from "next/server";
import { callBackend, clientKey, errorResponseBody, rateLimit } from "@/lib/server/oswahBackend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel: مهلة أطول لطلبات الذكاء الاصطناعي والدرر

export async function POST(req: Request) {
  let body: { hadith?: unknown; query?: unknown };
  try {
    body = (await req.json()) ?? {};
  } catch {
    return NextResponse.json({ success: false, error: "invalid_json", message: "صيغة الطلب غير صحيحة." }, { status: 400 });
  }
  // الحقل المعتمد hadith، ويُقبل query أيضاً من الواجهات القديمة
  const raw = typeof body.hadith === "string" ? body.hadith : typeof body.query === "string" ? body.query : "";
  const hadith = raw.trim();
  if (hadith.length < 3)
    return NextResponse.json({ success: false, hadith, results: [], error: "empty", message: "اكتب نص الحديث أو جزءاً منه أولاً." }, { status: 400 });
  if (hadith.length > 800)
    return NextResponse.json({ success: false, hadith, results: [], error: "too_long", message: "النص أطول من المسموح (800 حرف)." }, { status: 400 });

  const rl = rateLimit(clientKey(req, "find"), { cooldownMs: 5_000, perHour: 30 });
  if (!rl.ok)
    return NextResponse.json(
      { success: false, hadith, results: [], error: "rate_limited", message: `مهلاً، حاول بعد ${rl.retryAfter} ثانية.`, retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  try {
    const { status, data } = await callBackend("/api/hadith-find", { hadith }, 25_000);
    return NextResponse.json(data, { status }); // رد الخلفية (بيانات الدرر) يُمرَّر كما هو
  } catch (e) {
    const { body: errBody, status } = errorResponseBody(e);
    return NextResponse.json({ ...errBody, hadith, results: [] }, { status });
  }
}
