# بديل لـ httpx يحاكي واجهة الدرر الرسمية بنفس شكل الرد الحقيقي (انظر tests/fixtures/dorar_real_sample.json):
# {"ahadith": {"result": "<head>…</head><div class=\"hadith\">N -  النص  .</div><div class=\"hadith-info\">…"}}
import json, sys, re
sys.path.insert(0, __file__.rsplit('/tests/', 1)[0] + '/backend')
from core import norm
FAIL = {"on": False}
QUERIES = []
# بيانات اختبار: الأولى والثانية والرابعة من قاعدة أسوة الموثقة؛ الباقي نصوص تجريبية مُعلَّمة بوضوح.
CORPUS = [
 ("أن رجلا قال للنبي صلى الله عليه وسلم: أوصني، قال: لا تغضب. فردد مرارا، قال: لا تغضب", "أبو هريرة", "البخاري", "صحيح البخاري", "6116", "[صحيح]"),
 ("نضر الله امرأ سمع مقالتي فوعاها وحفظها وبلغها، فرب حامل فقه إلى من هو أفقه منه، ثلاث لا يغل عليهن قلب مسلم: إخلاص العمل لله، ومناصحة أئمة المسلمين، ولزوم جماعتهم، فإن الدعوة تحيط من ورائهم", "عبد الله بن مسعود", "ابن حجر العسقلاني", "موافقة الخبر الخبر", "1/364", "صحيح"),
 ("ليس الشديد بالصرعة، إنما الشديد الذي يملك نفسه عند الغضب", "أبو هريرة", "البخاري", "صحيح البخاري", "6114", "[صحيح]"),
 ("[نص تجريبي للاختبار فقط] من غضب فليتوضأ ويقرأ كذا مائة مرة", "-", "-", "-", "-", "[نص تجريبي] ضعيف جدا"),
 ("خدمت رسول الله صلى الله عليه وسلم عشر سنين، فما قال لي أف قط، وما قال لي لشيء صنعته ...", "أنس بن مالك", "مسلم", "صحيح مسلم", "2309", "[صحيح]"),
 ("[نص تجريبي للاختبار فقط] أن العنكبوت نسجت على باب الغار", "-", "-", "-", "-", "[نص تجريبي] إسناده ضعيف"),
 ("[نص تجريبي للاختبار فقط] من صدق في عمله بارك الله له في رزقه", "-", "-", "-", "-", "[نص تجريبي] صحيح"),
]
def _html(rows):
    out = ['<head>\n    <link rel="canonical" href="https://dorar.net/dorar_api.json">\n</head>\n']
    for n, (t, rawi, mohd, book, ref, grade) in enumerate(rows, 1):
        out.append(f'<div class="hadith" style="text-align:justify;">{n} -  {t}  .</div>\n\n<div class="hadith-info">\n'
                   f'    <span class="info-subtitle">الراوي:</span> {rawi}</span>\n    <span class="info-subtitle">المحدث:</span> {mohd}\n'
                   f'    <span class="info-subtitle">المصدر:</span>  {book}\n    <span class="info-subtitle">الصفحة أو الرقم:</span>  {ref}\n'
                   f'    <span class="info-subtitle">خلاصة حكم المحدث:</span>  <span >{grade}</span>\n</div>\n--------------\n<br/>\n')
    out.append('<br/><br/>\n<a href="https://dorar.net/hadith/search?q=*:*">المزيد</a>\n')
    return "".join(out)
def _words(s): return [w for w in re.split(r"[^\u0621-\u064A]+", norm(s)) if len(w) > 2]
class _Resp:
    def __init__(self, body): self.content = body.encode(); self.status_code = 200
    def raise_for_status(self): pass
class Client:
    def __init__(self, **kw): pass
    def __enter__(self): return self
    def __exit__(self, *a): pass
    def get(self, url, params=None):
        if FAIL["on"]: raise ConnectionError("simulated")
        q = params["skey"]; QUERIES.append(q); qw = _words(q)
        rows = [r for r in CORPUS if qw and sum(w in _words(r[0]) for w in qw) >= max(1, len(qw) // 2)]
        return _Resp(json.dumps({"ahadith": {"result": _html(rows)}}, ensure_ascii=False))
