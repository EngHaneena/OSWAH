// «تحقّق من صحة حديث» ← سيرفر البايثون /api/hadith-check (الدرر السنية + OpenAI للمطابقة فقط)
import { NextResponse } from "next/server";
import { callBackend, clientKey, errorResponseBody, rateLimit } from "@/lib/server/oswahBackend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel: مهلة أطول لطلبات الذكاء الاصطناعي والدرر

export async function POST(req: Request) {
  let body: { hadith?: unknown };
  try {
    body = (await req.json()) ?? {};
  } catch {
    return NextResponse.json({ success: false, error: "invalid_json", message: "صيغة الطلب غير صحيحة." }, { status: 400 });
  }

  const hadith = typeof body.hadith === "string" ? body.hadith.trim() : "";
  if (hadith.length < 3)
    return NextResponse.json({ success: false, input_hadith: hadith, result: null, error: "empty", message: "الصق نص الحديث أولاً." }, { status: 400 });
  if (hadith.length > 1500)
    return NextResponse.json({ success: false, input_hadith: hadith, result: null, error: "too_long", message: "النص أطول من المسموح (1500 حرف)." }, { status: 400 });

  const rl = rateLimit(clientKey(req, "hadith"), { cooldownMs: 5_000, perHour: 30 });
  if (!rl.ok)
    return NextResponse.json(
      { success: false, input_hadith: hadith, result: null, error: "rate_limited", message: `مهلاً، حاول بعد ${rl.retryAfter} ثانية.`, retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );

  try {
    const { status, data } = await callBackend("/api/hadith-check", { hadith }, 35_000);
    return NextResponse.json(data, { status });
  } catch (e) {
    const { body: errBody, status } = errorResponseBody(e);
    return NextResponse.json({ ...errBody, input_hadith: hadith, result: null }, { status });
  }
}
