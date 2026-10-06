"""
بديل الدرر السنية عند تعذّر الوصول إليها (مثلاً حين تحجب حماية Cloudflare خوادم الاستضافة):
بحث نصي في قاعدة محلية للكتب السبعة (البخاري، مسلم، السنن الأربع، الموطأ) بأحكام المحدّثين،
مبنية بـ scripts/build_local_hadith.py من github.com/fawazahmed0/hadith-api (ملكية عامة).

النتائج بنفس شكل نتائج الدرر (hadith_text / narrator / scholar / source / reference / grade)،
فتعمل عليها «ابحث عن حديث» و«تحقّق» و«موقف مماثل» دون تغيير.
"""
from __future__ import annotations

import gzip
import json
import logging
import os
import re
import threading

from core import norm

log = logging.getLogger("oswah.local")
PROVIDER = "قاعدة أحاديث الكتب السبعة (نسخة محلية)"
_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "hadith_local.json.gz")
_DIAC = re.compile(r"[ؐ-ًؚ-ٰٟۖ-ۭـ]")
_BOOK_RANK = {"صحيح البخاري": 0, "صحيح مسلم": 1}
_rows: list | None = None
_lock = threading.Lock()


def _load() -> list:
    global _rows
    if _rows is None:
        with _lock:
            if _rows is None:
                try:
                    with gzip.open(_PATH, "rt", encoding="utf-8") as f:
                        raw = json.load(f)["rows"]
                except Exception as e:
                    log.warning("local hadith db unavailable: %s", type(e).__name__)
                    raw = []
                # النص المطبّع (بلا حركات، والهمزات والتاء المربوطة موحّدة) يُحسب مرة واحدة للبحث
                _rows = [(book, num, text, grade, scholar, " " + " ".join(re.findall(r"[ء-ي0-9]+", norm(text))) + " ")
                         for book, num, text, grade, scholar in raw]
    return _rows


def available() -> bool:
    return bool(_load())


# ---------------------------------------------------------------------------
# فصل الإسناد عن المتن: نعرض من آخر حلقة في السند قبل أول ذكر للنبي ﷺ (مثل: «عن أبي هريرة أن رسول الله ﷺ قال: ...»)
# ---------------------------------------------------------------------------
_PROPHET = re.compile(r"صلى الله عليه وسلم|رسول الله|النبي|نبي الله")
_CHAIN = re.compile(r"(?:^|\s)(?:عن|حدثنا|حدثني|أخبرنا|أخبرني|أنبأنا|سمعت)\s")
_NARR_END = re.compile(r"،|,|\sـ|\s(?:رضي الله|رضى الله|أن|أنه|أنها|قال|قالت|يقول|تقول|عن)\s")


def split_matn(text: str) -> tuple[str, str]:
    """يرجع (المتن مع الصحابي الراوي، الراوي). عند الشك يرجع النص كما هو."""
    bare, idx = [], []
    for i, ch in enumerate(text):  # نص بلا حركات + خريطة المواقع إلى النص الأصلي
        if not _DIAC.match(ch):
            bare.append(ch)
            idx.append(i)
    b = "".join(bare)
    p = _PROPHET.search(b)
    if not p:
        return text, ""
    links = list(_CHAIN.finditer(b[:p.start()]))
    # آخر حلقة يتبعها اسم راوٍ (لا «عن النبي» ولا «سمعت رسول الله» مباشرة)
    while links and not _PROPHET.sub("", b[links[-1].end():p.start()]).strip(" ،,:ـ"):
        links.pop()
    if not links:
        return text, ""
    start = links[-1].start() + (b[links[-1].start()] == " ")
    if start == 0:
        return text, ""
    name_from = links[-1].end()
    e = _NARR_END.search(b, name_from)
    narrator = b[name_from:e.start()].strip(" ،,:ـ") if e else ""
    if len(narrator.split()) > 5:
        narrator = ""
    if b[start:].startswith(("حدثنا", "حدثني", "أخبرنا", "أخبرني", "أنبأنا")):  # «حدثنا فلان قال» ← نبدأ بعد اسمه
        start = e.start() + 1 if e and b[e.start()] in "،," else start
    return text[idx[start]:].strip(" ،,"), narrator


def _record(row) -> dict:
    book, num, text, grade, scholar, _ = row
    matn, narrator = split_matn(text)
    return {"hadith_text": matn, "narrator": narrator, "scholar": scholar, "source": book, "reference": num,
            "grade": grade, "takhrij": "", "truncated": False, "extra": {}, "provider": PROVIDER}


def _terms(q: str) -> list[str]:
    stop = {"قال", "عن", "في", "من", "علي", "الي", "ان", "ما", "لا", "او", "ثم", "هل", "صحيح"}
    return [w for w in re.findall(r"[ء-ي0-9]+", norm(q)) if len(w) > 1 and w not in stop]


def search(query: str, limit: int = 15) -> list[dict]:
    """
    بحث بالكلمات مثل محرك الدرر: الأحاديث التي تحتوي كل كلمات العبارة أولاً (والعبارة متصلة قبلها)،
    فإن لم يوجد شيء نقبل ما احتوى ثلثي الكلمات على الأقل. الصحيحان يُقدَّمان عند التساوي.
    """
    rows, terms = _load(), _terms(query)
    if not rows or not terms:
        return []
    phrase = " " + " ".join(terms)
    need = len(terms) if len(terms) <= 2 else max(2, -(-len(terms) * 2 // 3))
    scored = []
    for row in rows:
        t = row[5]
        hits = sum(1 for w in terms if w in t)
        if hits >= need:
            # كلمة كاملة أفضل من جزء كلمة، والعبارة المتصلة أفضل من الكلمات المتفرقة
            whole = sum(1 for w in terms if f" {w} " in t or f" و{w} " in t or f" ف{w} " in t or f" ب{w} " in t)
            scored.append((-(hits * 10 + whole + (25 if phrase in t else 0)), _BOOK_RANK.get(row[0], 2), len(t), row))
    scored.sort(key=lambda x: x[:3])
    return [_record(s[3]) for s in scored[:limit]]
