// GET /api/health — للتأكد أن الواجهة متصلة بخادم البايثون (وتستخدمه المنصة لتفعيل «وضع الخادم»)
import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/server/oswahBackend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 5_000);
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, { cache: "no-store", signal: ctl.signal });
    const backend = await res.json();
    return NextResponse.json({ frontend: "ok", backend_url: BACKEND_URL, backend }, { status: res.ok ? 200 : 502 });
  } catch {
    return NextResponse.json({ frontend: "ok", backend_url: BACKEND_URL, backend: null, error: "backend_unreachable" }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
