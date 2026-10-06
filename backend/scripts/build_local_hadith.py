"""
يبني قاعدة الأحاديث المحلية backend/data/hadith_local.json.gz (بديل الدرر عند تعذّر الوصول إليها).
المصدر: github.com/fawazahmed0/hadith-api (ملكية عامة)، الطبعات العربية للكتب السبعة مع أحكام المحدّثين.
التشغيل (مرة واحدة، يحتاج إنترنت):  python backend/scripts/build_local_hadith.py
"""
import gzip, json, os, re, sys, urllib.request

BASE = "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/ara-{}.min.json"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "hadith_local.json.gz")
# المفتاح ← (اسم الكتاب، المحدّث المعتمد في الحكم، اسمه بالعربية). البخاري ومسلم: الحكم «صحيح» كما تعرضه الدرر.
BOOKS = {
    "bukhari": ("صحيح البخاري", None, "البخاري"),
    "muslim": ("صحيح مسلم", None, "مسلم"),
    "abudawud": ("سنن أبي داود", "Al-Albani", "الألباني"),
    "tirmidhi": ("سنن الترمذي", "Al-Albani", "الألباني"),
    "nasai": ("سنن النسائي", "Al-Albani", "الألباني"),
    "ibnmajah": ("سنن ابن ماجه", "Al-Albani", "الألباني"),
    "malik": ("موطأ مالك", "Salim al-Hilali", "سليم الهلالي"),
}
WORDS = [("Very Daif", "ضعيف جداً"), ("Agreed Upon", "متفق عليه"), ("Sahih", "صحيح"), ("Hasan", "حسن"), ("Daif", "ضعيف"),
         ("Mawdu", "موضوع"), ("Munkar", "منكر"), ("Shadh", "شاذ"), ("Batil", "باطل"), ("Mauquf", "موقوف"), ("Muquf", "موقوف"),
         ("Maqtu", "مقطوع"), ("Mursal", "مرسل"), ("Mutawatir", "متواتر"), ("Malool", "معلول")]


def grade_ar(g: str) -> str:
    """ترجمة حكم المحدّث إلى العربية بالمصطلح نفسه (صحيح/حسن/ضعيف...)؛ ما لا نعرفه يبقى كما هو."""
    g = re.sub(r"\(.*?\)", " ", g or "").strip(" -")
    if not g:
        return ""
    if re.search(r"Bukhari|Muslim", g) and "Daif" not in g:
        return "صحيح"
    found, rest = [], g
    for en, ar in WORDS:
        m = re.search(rf"\b{en}\b", rest)
        if m:
            found.append((ar in ("موقوف", "مقطوع", "مرسل"), m.start(), ar))  # الحكم أولاً ثم الوصف: «صحيح موقوف»
            rest = rest[:m.start()] + " " * len(en) + rest[m.end():]
    if not found:
        return g
    s = " ".join(dict.fromkeys(ar for _, _, ar in sorted(found)))
    if re.search(r"Isnaad|Sanad", g):
        s = s.replace("ضعيف جداً", "ضعيف") + " الإسناد" + (" جداً" if "جداً" in s else "")
    if "Lighairihi" in g:
        s += " لغيره"
    return s


def main():
    rows = []
    for key, (book, grader, grader_ar) in BOOKS.items():
        print("downloading", key, file=sys.stderr)
        with urllib.request.urlopen(BASE.format(key), timeout=120) as r:
            data = json.load(r)
        for h in data["hadiths"]:
            text = re.sub(r"\s+", " ", h.get("text") or "").strip()
            if len(text) < 15:
                continue
            if grader is None:
                grade = "صحيح"
            else:
                g = next((x["grade"] for x in h.get("grades") or [] if x.get("name") == grader), "")
                grade = grade_ar(g)
            rows.append([book, str(h.get("hadithnumber")), text, grade, grader_ar if grade else ""])
    with gzip.open(OUT, "wt", encoding="utf-8", compresslevel=9) as f:
        json.dump({"source": "fawazahmed0/hadith-api (public domain)", "rows": rows}, f, ensure_ascii=False, separators=(",", ":"))
    print(len(rows), "hadiths ->", OUT, os.path.getsize(OUT) // 1024, "KB", file=sys.stderr)


if __name__ == "__main__":
    main()
