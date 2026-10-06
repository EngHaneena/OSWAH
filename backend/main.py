"""
أُسوة (OSWAH) — سيرفر FastAPI
المسار الأول: /api/vector-search  (RAG على ملف الإكسل)
المسار الثاني: /api/hadith-check  (في hadith_check.py: الدرر السنية + OpenAI)

التشغيل:  uvicorn main:app --reload --port 8000
اختبار الاسترجاع وضبط الحد:  python main.py --probe "أخطأ زميلي أمام الجميع"
إعادة بناء الفهرس بعد تعديل الإكسل:  python main.py --reindex
"""
import json
import logging
import sys
import threading
from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from deps import openai_client, require_key, settings  # يحمّل .env أولاً
from core import (build_items, candidate_for_model, classify, clean_values, file_fingerprint, load_excel,
                  public_item, validate_generation, wisdom_system_prompt, wisdom_user_prompt)
from hadith_check import router as hadith_router, situation_from_dorar

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("oswah")  # لا نسجّل نصوص المستخدمين أبداً


# ---------------------------------------------------------------------------
# الفهرس المتجهي (ChromaDB)
# ---------------------------------------------------------------------------
STATE: dict = {"items": {}, "dua_ids": set(), "collection": None, "fingerprint": None, "ready": False}
_index_lock = threading.Lock()


def embed(texts: list[str]) -> list[list[float]]:
    res = openai_client().embeddings.create(model=settings.embed_model, input=texts)
    return [d.embedding for d in res.data]


def build_index(force: bool = False) -> dict:
    """يقرأ الإكسل، يطبّق بوابة المحتوى، ويبني المتجهات. لا يعيد البناء إلا إذا تغيّر الملف أو النموذج."""
    with _index_lock:
        data = load_excel(settings.excel_path)
        items = build_items(data, settings.content_gate)
        fp = file_fingerprint(settings.excel_path, f"{settings.embed_model}|{settings.content_gate}")
        try:
            import chromadb  # يُحمَّل في وضع excel فقط (غير مطلوب لوضع الدرر الافتراضي)
        except ImportError as e:
            raise RuntimeError("وضع SITUATION_SOURCE=excel يحتاج: pip install -r requirements-excel.txt") from e
        client = chromadb.PersistentClient(path=settings.chroma_dir)
        col = client.get_or_create_collection(settings.collection, metadata={"hnsw:space": "cosine", "fingerprint": fp})
        stale = force or (col.metadata or {}).get("fingerprint") != fp or col.count() != len(items)
        if stale:
            client.delete_collection(settings.collection)
            col = client.create_collection(settings.collection, metadata={"hnsw:space": "cosine", "fingerprint": fp})
            if items:
                col.add(ids=[it["id"] for it in items], embeddings=embed([it["index_text"] for it in items]),
                        documents=[it["index_text"] for it in items], metadatas=[{"type": it["type"]} for it in items])
            log.info("index rebuilt: %d items (%s)", len(items), fp)
        STATE.update(items={it["id"]: it for it in items}, dua_ids={it["id"] for it in items if it["type"] == "dua"},
                     collection=col, fingerprint=fp, ready=True)
        return {"items": len(items), "rebuilt": stale, "fingerprint": fp}


def search(text: str, k: int) -> list[tuple[str, float]]:
    col = STATE["collection"]
    n = min(k, col.count())
    if n == 0:
        return []
    res = col.query(query_embeddings=embed([text]), n_results=n)
    return [(i, round(1 - d, 4)) for i, d in zip(res["ids"][0], res["distances"][0])]  # cosine distance → similarity


# ---------------------------------------------------------------------------
# التطبيق
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.situation_source == "excel":  # في وضع الدرر لا حاجة لبناء متجهات الإكسل
        try:
            info = build_index()
            log.info("ready: %s", info)
        except Exception as e:  # السيرفر يعمل حتى لو فشل البناء، ويرجع 503 إلى أن يُصلح
            log.exception("index build failed: %s", e)
    else:
        log.info("situation source: dorar (live)")
    yield


app = FastAPI(title="Oswah Backend", version="1.0", lifespan=lifespan)
# CORS للاختبار المباشر من المتصفح. الطريق الطبيعي: Next.js يستدعي هذا السيرفر من الخادم (server-to-server).
app.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins, allow_methods=["POST", "GET"], allow_headers=["Content-Type", "X-Oswah-Key"])


app.include_router(hadith_router)


class VectorSearchIn(BaseModel):
    problem: str = Field(..., min_length=1, max_length=1500)
    lang: str = "ar"
    level: str = "none"


MSG = {
    "no_match": "لم نجد في قاعدتنا الموثقة موقفاً قريباً بما يكفي مما وصفت. نفضّل أن نعتذر على أن نقول شيئاً غير موثق. جرّب وصف الموقف بتفصيل أكثر أو بكلمات أخرى.",
    "crisis": "يبدو أنك تمر بوقت صعب جداً، وسلامتك أهم من أي شيء الآن. تواصل الآن مع خدمات الطوارئ، أو مع شخص تثق به ليبقى معك.",
    "ruling": "سؤالك يتعلق بحكم شرعي في حالة شخصية، وهذا يتطلب معرفة تفاصيل الواقعة. أُسوة لا تُصدر فتاوى؛ يُرجع في ذلك إلى جهة إفتاء رسمية أو مختص شرعي مؤهل.",
    "identity": "أُسوة أداة مدعومة بالذكاء الاصطناعي، تختار مواقف من قاعدة بيانات يراجعها مختص شرعي. لا تُصدر فتاوى ولا تغني عن أهل العلم.",
    "fallback": "تعذّرت الصياغة الآلية أو لم تجتز الفحص البرمجي، فعرضنا البيانات كما هي في القاعدة.",
}


@app.get("/api/health")
def health():
    return {"situation_source": settings.situation_source, "ready": STATE["ready"] or settings.situation_source == "dorar",
            "items": len(STATE["items"]), "fingerprint": STATE["fingerprint"]}


@app.post("/api/reindex", dependencies=[Depends(require_key)])
def reindex():
    return build_index(force=True)


@app.post("/api/vector-search", dependencies=[Depends(require_key)])
def vector_search(body: VectorSearchIn):
    if settings.situation_source != "dorar" and not STATE["ready"]:
        raise HTTPException(status_code=503, detail="index_not_ready")
    text = body.problem.strip()
    if len(text) < 5:
        raise HTTPException(status_code=400, detail="problem_too_short")
    lang = "en" if body.lang == "en" else "ar"

    # 1) فحص السلامة قبل أي بحث
    c = classify(text)
    if c["crisis"]:
        return {"success": False, "kind": "crisis", "message": MSG["crisis"], "emergency": settings.emergency}
    if c["identity"]:
        return {"success": False, "kind": "identity", "message": MSG["identity"]}
    if c["ruling"]:
        return {"success": False, "kind": "ruling", "message": MSG["ruling"]}

    # 2أ) البحث في الدرر السنية مباشرة (الافتراضي): الذكاء الاصطناعي يكتب عبارات البحث ويختار ويصوغ
    if settings.situation_source == "dorar":
        return situation_from_dorar(text, lang)

    # 2ب) أو الاسترجاع من قاعدة المتجهات (SITUATION_SOURCE=excel)
    hits = [(i, s) for i, s in search(text, settings.top_k) if s >= settings.similarity_threshold]
    if not hits:
        return {"success": False, "kind": "no_match", "message": MSG["no_match"]}
    items = STATE["items"]
    related = [{"id": i, "title": items[i]["title"], "similarity": s} for i, s in hits]

    # 3) التوليد المقيّد: النموذج يرى حقولاً غير شرعية فقط، ثم يُفحص برمجياً
    cands = [candidate_for_model(items[i]) for i, _ in hits]
    gen, mode, note = None, "fallback", None
    try:
        resp = openai_client().chat.completions.create(
            model=settings.chat_model, temperature=0.3, response_format={"type": "json_object"},
            messages=[{"role": "system", "content": wisdom_system_prompt(lang, body.level)},
                      {"role": "user", "content": wisdom_user_prompt(text, cands)}])
        g = json.loads(resp.choices[0].message.content or "{}")
        ok, reasons = validate_generation(g, [x["id"] for x in cands], STATE["dua_ids"])
        if ok and g["match_id"] is None:
            return {"success": False, "kind": "no_match", "message": MSG["no_match"]}
        if ok:
            gen, mode, chosen = g, "ai", g["match_id"]
        else:
            log.warning("generation rejected: %s", reasons)
            note, chosen = MSG["fallback"], hits[0][0]
    except Exception as e:
        log.warning("openai failed: %s", type(e).__name__)
        note, chosen = MSG["fallback"], hits[0][0]

    generated = None if gen is None else {
        "title": gen["title"], "empathy": gen["empathy"], "lesson": gen["lesson"], "practical_step": gen.get("practical_step", ""),
        "actions": gen.get("actions", []), "plan_values": clean_values(gen.get("plan_values")), "confidence": gen.get("confidence")}
    return {
        "success": True, "kind": "match", "mode": mode, "note": note,
        "item": public_item(items[chosen]),           # النص الشرعي ومصدره كما في القاعدة
        "generated": generated,                        # صياغة الذكاء الاصطناعي (تُعرض بشارة)
        "ai_disclosure": "مُعدّ بمساعدة الذكاء الاصطناعي" if generated else None,
        "related": [r for r in related if r["id"] != chosen],
    }


# ---------------------------------------------------------------------------
# أدوات سطر الأوامر
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    if "--reindex" in sys.argv:
        print(build_index(force=True))
    elif "--probe" in sys.argv:
        q = sys.argv[sys.argv.index("--probe") + 1]
        build_index()
        for i, s in search(q, 8):
            flag = "✓" if s >= settings.similarity_threshold else " "
            print(f"{flag} {s:.3f}  {i}  {STATE['items'][i]['title']}")
        print(f"(الحد الحالي SIMILARITY_THRESHOLD = {settings.similarity_threshold})")
    else:
        import uvicorn
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
