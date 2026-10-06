// يُستورد من ملفات route.ts فقط (على الخادم). لا مفاتيح OpenAI هنا أبداً؛
// المتغيرات أدناه بلا NEXT_PUBLIC_ فلا تصل إلى المتصفح.
export const BACKEND_URL = process.env.PY_BACKEND_URL ?? "http://localhost:8000";
const SHARED_SECRET = process.env.BACKEND_SHARED_SECRET ?? "";

export class BackendError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// ---------- حد الطلبات (في الذاكرة؛ في الإنتاج متعدد الخوادم استخدموا Redis/Upstash) ----------
type Limits = { cooldownMs: number; perHour: number };
const HOUR = 3_600_000;
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limits: Limits = { cooldownMs: 8_000, perHour: 15 }): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < HOUR);
  const last = arr.length ? arr[arr.length - 1] : 0;
  if (now - last < limits.cooldownMs) return { ok: false, retryAfter: Math.ceil((limits.cooldownMs - (now - last)) / 1000) };
  if (arr.length >= limits.perHour) return { ok: false, retryAfter: Math.ceil((HOUR - (now - arr[0])) / 1000) };
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5_000) for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > HOUR) hits.delete(k);
  return { ok: true };
}

export function clientKey(req: Request, scope: string): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = (fwd ? fwd.split(",")[0].trim() : "") || req.headers.get("x-real-ip") || "local";
  return `${scope}:${ip}`;
}

// ---------- الاتصال بسيرفر البايثون ----------
export async function callBackend<T = unknown>(path: string, body: unknown, timeoutMs = 30_000): Promise<{ status: number; data: T }> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (SHARED_SECRET) headers["X-Oswah-Key"] = SHARED_SECRET;
    const res = await fetch(`${BACKEND_URL}${path}`, { method: "POST", headers, body: JSON.stringify(body), signal: ctl.signal, cache: "no-store" });
    let data: unknown = null;
    try { data = await res.json(); } catch { /* الرد ليس JSON */ }
    if (res.ok) return { status: res.status, data: data as T };
    if (res.status === 400 || res.status === 422) throw new BackendError(400, "invalid_input", "النص المرسل غير صالح.");
    if (res.status === 401) throw new BackendError(502, "backend_auth", "إعداد الاتصال بالخادم غير صحيح.");
    if (res.status === 503) throw new BackendError(503, "backend_not_ready", "الخدمة قيد التجهيز، حاول بعد قليل.");
    if (res.status === 502 && data && typeof data === "object") return { status: 502, data: data as T }; // مثل: تعذّر الوصول للدرر
    throw new BackendError(502, "backend_error", "تعذّر إكمال الطلب الآن، حاول لاحقاً.");
  } catch (e) {
    if (e instanceof BackendError) throw e;
    if (e instanceof Error && e.name === "AbortError") throw new BackendError(504, "backend_timeout", "استغرق الطلب وقتاً أطول من المتوقع، حاول مرة أخرى.");
    throw new BackendError(502, "backend_unreachable", "تعذّر الاتصال بخدمة أُسوة الآن، حاول لاحقاً.");
  } finally {
    clearTimeout(timer);
  }
}

export function errorResponseBody(e: unknown): { body: { success: false; error: string; message: string }; status: number } {
  if (e instanceof BackendError) return { body: { success: false, error: e.code, message: e.message }, status: e.status };
  console.error("oswah route: unexpected error", e instanceof Error ? e.name : typeof e); // لا نطبع نص المستخدم
  return { body: { success: false, error: "internal", message: "حدث خطأ غير متوقع." }, status: 500 };
}
