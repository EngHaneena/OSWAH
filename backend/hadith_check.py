"""
أُسوة — خانات «تبيّن وتحقّق» الثلاث عبر الدرر السنية مباشرة:
  POST /api/hadith-check     تحقّق من صحة حديث (أو معلومة عن السيرة)
  POST /api/hadith-find      ابحث عن حديث: الدرر فقط، بلا OpenAI (Next.js → FastAPI → Dorar API → FastAPI → Next.js)
  situation_from_dorar()     «موقف مماثل من السيرة» (يستدعيها /api/vector-search في main.py)

المبدأ: الدرر هي المصدر الوحيد للنص والحكم. OpenAI يكتب عبارات البحث ويختار من النتائج ويصوغ،
ولا يرى الأحكام أصلاً؛ الكود ينسخ الحكم من رد الدرر.
واجهة الدرر الرسمية (dorar.net/article/389):  GET {DORAR_API_URL}?skey=<عبارة البحث>  — بلا مفتاح.
"""
from __future__ import annotations

import json
import logging
import re

from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from core import (HADITH_CHECK_SYSTEM, dorar_search_url, QUERY_SYSTEM, SITUATION_SYSTEM, build_hadith_result, clean_queries, clean_values,
                  grade_class, hadith_check_user_prompt, norm, parse_dorar_payload, public_dorar, results_for_model,
                  validate_situation, wording_overlap)
from deps import openai_client, require_key, settings

log = logging.getLogger("oswah.dorar")
router = APIRouter()
NOT_FOUND = "لم يتم العثور على تطابق موثوق"
DORAR_DOWN = "تعذّر الوصول إلى خدمة الدرر السنية، حاول لاحقاً"


class HadithIn(BaseModel):
    hadith: str = Field(..., min_length=3, max_length=1500)


class FindIn(BaseModel):
    hadith: Optional[str] = Field(default=None, max_length=800)  # الحقل المطلوب
    query: Optional[str] = Field(default=None, max_length=800)   # الاسم السابق، يبقى مقبولاً للتوافق


class DorarUnavailable(Exception):
    pass


# ---------------------------------------------------------------------------
# الاتصال بالدرر
# ---------------------------------------------------------------------------
_DIACRITICS = re.compile(r"[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]")
_MARK = re.compile(r"(?:قال|يقول)\s+(?:رسول الله|النبي|نبي الله)[^:：]{0,30}[:：]|ﷺ\s*[:：]")
_STRIP = re.compile(r"(هل صحيح أن|هل صحيح ان|هل صحيح|صلى الله عليه وسلم|رضي الله عنهما|رضي الله عنها|رضي الله عنه|ﷺ|«|»|\"|“|”)")


def lexical_queries(text: str) -> list[str]:
    """
    عبارات بحث بالإملاء الأصلي (تُحذف الحركات فقط؛ محرك الدرر يبحث بالإملاء فلا نغيّر ة/ى/أ)،
    ونأخذ ما بعد «قال رسول الله ﷺ:» إن وُجد، ثم مقطعين أقصر يُجرَّبان إن لم تأتِ نتائج.
    """
    t = _DIACRITICS.sub("", str(text or ""))
    marks = list(_MARK.finditer(t))
    if marks:
        t = t[marks[-1].end():]
    t = _STRIP.sub(" ", t)
    w = [x for x in re.split(r"[^\u0621-\u064A0-9]+", t) if x]
    while len(w) > 2 and w[0] in ("حديث", "الحديث", "فيه", "عن", "يقول", "معناه", "اللي", "الذي"):  # ليست من نص الحديث
        w.pop(0)
    third = len(w) // 3
    out = []
    for q in (" ".join(w[:8]), " ".join(w[:5]), " ".join(w[third:third + 5])):
        if len(q.split()) >= 2 and q not in out:
            out.append(q)
    return out[:3]


def search_dorar(queries: list[str], limit: int = 15, stop_on_first: bool = False) -> list[dict]:
    seen, results = set(), []
    try:
        with httpx.Client(timeout=settings.dorar_timeout, headers={"User-Agent": "Oswah/1.0 (AI Challenge prototype)"}) as cx:
            for q in queries:
                r = cx.get(settings.dorar_api_url, params={"skey": q})
                r.raise_for_status()
                for rec in parse_dorar_payload(r.content):
                    key = (rec["hadith_text"][:80], rec.get("source"), rec.get("reference"))
                    if key not in seen:
                        seen.add(key)
                        results.append(rec)
                if results and stop_on_first:  # للاقتباسات: أول عبارة أعطت نتائج تكفي
                    break
                if len(results) >= limit:
                    break
    except Exception as e:
        log.warning("dorar failed: %s", type(e).__name__)
        raise DorarUnavailable() from e
    return results[:limit]


def ask_json(system: str, user: str, temperature: float = 0) -> dict:
    resp = openai_client().chat.completions.create(
        model=settings.chat_model, temperature=temperature, response_format={"type": "json_object"},
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}])
    return json.loads(resp.choices[0].message.content or "{}")


def ai_queries(text: str) -> list[str]:
    try:
        return clean_queries(ask_json(QUERY_SYSTEM, f'PERSON\'S TEXT\n"""{text[:1200]}"""'))
    except Exception as e:
        log.warning("query generation failed: %s", type(e).__name__)
        return []


# ---------------------------------------------------------------------------
# 1) تحقّق من صحة حديث
# ---------------------------------------------------------------------------
@router.post("/api/hadith-check", dependencies=[Depends(require_key)])
def hadith_check(body: HadithIn):
    text = body.hadith.strip()
    try:
        results = search_dorar(lexical_queries(text), stop_on_first=True)
        if len(results) < 3:  # معلومة عن السيرة أو صيغة بعيدة: نضيف عبارات يكتبها الذكاء الاصطناعي
            results += [r for r in search_dorar(ai_queries(text)) if r not in results]
    except DorarUnavailable:
        return JSONResponse(status_code=502, content={"success": False, "input_hadith": text, "result": None, "message": DORAR_DOWN, "error": "dorar_unavailable"})
    if not results:
        return {"success": False, "input_hadith": text, "result": None, "message": NOT_FOUND, "related": []}

    try:
        g = ask_json(HADITH_CHECK_SYSTEM, hadith_check_user_prompt(text, results))
    except Exception as e:
        log.warning("openai failed, lexical fallback: %s", type(e).__name__)
        best = min(range(len(results)), key=lambda i: wording_overlap(text, results[i]["hadith_text"])["extra"])
        ok = wording_overlap(text, results[best]["hadith_text"])["wording"] in ("exact", "partial")
        g = {"match_index": best if ok else None, "match_quality": "exact" if ok else "none", "explanation": "", "related": []}

    rel_idx = [i for i in (g.get("related") or []) if isinstance(i, int) and 0 <= i < len(results) and i != g.get("match_index")][:3]
    related = [public_dorar(results[i]) for i in rel_idx]
    result = build_hadith_result(text, results, g)
    if result is None:
        # لا تطابق موثوق؛ إن كان النص معلومة عن السيرة نعرض الروايات ذات الصلة بأحكامها كما في الدرر
        return {"success": False, "input_hadith": text, "result": None, "message": NOT_FOUND, "related": related}
    return {"success": True, "input_hadith": text, "result": result, "related": related}


# ---------------------------------------------------------------------------
# 2) ابحث عن حديث
# ---------------------------------------------------------------------------
def dorar_record(r: dict) -> dict:
    """نتيجة الدرر كما حلّلها المحلل المشترك، دون أي إضافة أو تصنيف من عندنا."""
    out = {k: r.get(k, "") for k in ("hadith_text", "narrator", "scholar", "source", "reference", "grade", "takhrij")}
    out["truncated"] = bool(r.get("truncated"))     # الدرر نفسها اختصرت النص بـ «...»
    out["extra"] = r.get("extra") or {}               # أي حقول أخرى ظهرت في رد الدرر بتسمياتها الأصلية
    out["dorar_url"] = dorar_search_url(r["hadith_text"])  # رابط صفحة البحث في الدرر لقراءة النص كاملاً
    return out


@router.post("/api/hadith-find", dependencies=[Depends(require_key)])
def hadith_find(body: FindIn):
    """
    «ابحث عن حديث» — بلا OpenAI إطلاقاً:
    النص ← عبارات بحث ثابتة القواعد (حذف الحركات وعبارة «قال رسول الله ﷺ») ← Dorar API ← النتائج كما هي وبترتيب الدرر.
    """
    text = (body.hadith or body.query or "").strip()
    if len(text) < 3:
        raise HTTPException(status_code=400, detail="hadith_too_short")
    try:
        # أول عبارة تُرجع نتائج تكفي؛ العبارتان الأقصر تُجرَّبان فقط إن لم تُرجع الأولى شيئاً
        # كلمة واحدة (مثل «الغضب») تُرسل كما هي بعد حذف الحركات، لأن مولّد العبارات المشترك يتطلب كلمتين
        queries = lexical_queries(text) or [_DIACRITICS.sub("", text)]
        results = search_dorar(queries, stop_on_first=True)
    except DorarUnavailable:
        return JSONResponse(status_code=502, content={"success": False, "hadith": text, "results": [], "message": DORAR_DOWN, "error": "dorar_unavailable"})
    if not results:
        return {"success": False, "hadith": text, "results": [], "count": 0, "provider": "الدرر السنية",
                "message": "لم تُرجع الدرر السنية نتائج لهذا البحث"}
    return {"success": True, "hadith": text, "count": len(results), "provider": "الدرر السنية",
            "results": [dorar_record(r) for r in results]}


# ---------------------------------------------------------------------------
# 3) موقف مماثل من السيرة (يُستدعى من /api/vector-search)
# ---------------------------------------------------------------------------
def situation_from_dorar(text: str, lang: str) -> dict:
    queries = ai_queries(text)
    if not queries:
        return {"success": False, "kind": "ai_unavailable", "message": "تعذّر تحليل الموقف الآن، حاول بعد قليل."}
    try:
        results = search_dorar(queries)
    except DorarUnavailable:
        return {"success": False, "kind": "dorar_unavailable", "message": DORAR_DOWN}
    authentic = [r for r in results if grade_class(r.get("grade", "")) == "authentic"]  # للتوجيه: الثابت فقط
    if not authentic:
        return {"success": False, "kind": "no_match", "message": "لم نجد في الدرر السنية رواية ثابتة قريبة مما وصفت. جرّب وصف الموقف بكلمات أخرى."}
    try:
        g = ask_json(SITUATION_SYSTEM.replace("{lang}", "Arabic (Modern Standard, simple)" if lang == "ar" else "English"),
                     f'PERSON\'S TEXT\n"""{text[:1500]}"""\n\nRESULTS\n{results_for_model(authentic)}', temperature=0.3)
    except Exception as e:
        log.warning("openai failed: %s", type(e).__name__)
        return {"success": False, "kind": "ai_unavailable", "message": "تعذّر تحليل الموقف الآن، حاول بعد قليل."}
    ok, reasons = validate_situation(g, len(authentic))
    if not ok:
        log.warning("situation wording rejected: %s", reasons)
        return {"success": False, "kind": "no_match", "message": "لم نتمكن من صياغة توجيه موثوق لهذا الموقف. جرّب وصفه بكلمات أخرى."}
    if g.get("match_index") is None:
        return {"success": False, "kind": "no_match", "message": "لم نجد في الدرر السنية رواية ثابتة قريبة مما وصفت. جرّب وصف الموقف بكلمات أخرى."}
    chosen = authentic[g["match_index"]]
    return {
        "success": True, "kind": "match", "mode": "ai", "source": "dorar",
        "item": public_dorar(chosen),  # النص والحكم والمصدر من الدرر كما هي
        "generated": {"title": g["title"], "empathy": g["empathy"], "lesson": g["lesson"], "practical_step": g.get("practical_step", ""),
                      "actions": g.get("actions", []), "plan_values": clean_values(g.get("plan_values")), "confidence": g.get("confidence")},
        "ai_disclosure": "مُعدّ بمساعدة الذكاء الاصطناعي",
        "related": [public_dorar(r) for r in authentic if r is not chosen][:2],
        "queries": queries,
    }
