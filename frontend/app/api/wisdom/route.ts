// «أعطني موقفاً مماثلاً من السيرة» ← سيرفر البايثون /api/vector-search (RAG)
import { NextResponse } from "next/server";
import { callBackend, clientKey, errorResponseBody, rateLimit } from "@/lib/server/oswahBackend";

export const runtime = "nodejs"; // حد الطلبات في الذاكرة يحتاج Node لا Edge
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel: مهلة أطول لطلبات الذكاء الاصطناعي والدرر

const MIN_LEN = 5;
const MAX_LEN = 1500;

export async function POST(req: Request) {
  let body: { problem?: unknown; lang?: unknown; level?: unknown };
  try {
    body = (await req.json()) ?? {};
  } catch {
    return NextResponse.json({ success: false, error: "invalid_json", message: "صيغة الطلب غير صحيحة." }, { status: 400 });
  }

  const userInput = typeof body.problem === "string" ? body.problem.trim() : "";
  if (userInput.length < MIN_LEN)
    return NextResponse.json({ success: false, error: "empty", message: "اكتب وصفاً للموقف أولاً (5 أحرف على الأقل)." }, { status: 400 });
  if (userInput.length > MAX_LEN)
    return NextResponse.json({ success: false, error: "too_long", message: "النص أطول من المسموح (1500 حرف)." }, { status: 400 });

  const rl = rateLimit(clientKey(req, "wisdom"), { cooldownMs: 8_000, perHour: 15 });
  if (!rl.ok)
    return NextResponse.json(
      { success: false, error: "rate_limited", message: `مهلاً، حاول بعد ${rl.retryAfter} ثانية.`, retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );

  try {
    const { status, data } = await callBackend("/api/vector-search", {
      problem: userInput,
      lang: body.lang === "en" ? "en" : "ar",
      level: typeof body.level === "string" ? body.level : "none",
    });
    return NextResponse.json(data, { status });
  } catch (e) {
    const { body: errBody, status } = errorResponseBody(e);
    return NextResponse.json(errBody, { status });
  }
}
