# بديل لـ OpenAI: تضمينات «كيس كلمات» حتمية، ونموذج دردشة يحاكي السلوك ويمكن جعله يخالف القواعد للاختبار.
import hashlib, json, math, re, sys
sys.path.insert(0, __file__.rsplit('/tests/', 1)[0] + '/backend')
from core import norm, wording_overlap
MODE = {"wisdom": "good", "hadith": "good", "fail": False, "calls": 0}
def _vec(t, dim=512):
    v = [0.0]*dim
    for w in re.split(r"[^\u0621-\u064Aa-z0-9]+", norm(t)):
        if len(w) < 2: continue
        w = re.sub(r"^(وال|بال|ال|و)", "", w) if len(w) > 4 else w
        v[int(hashlib.md5(w.encode()).hexdigest(), 16) % dim] += 1
    n = math.sqrt(sum(x*x for x in v)) or 1
    return [x/n for x in v]
class _Obj:
    def __init__(self, **kw): self.__dict__.update(kw)
class _Emb:
    def create(self, model, input): return _Obj(data=[_Obj(embedding=_vec(t)) for t in input])
class _Chat:
    def create(self, model, messages, **kw):
        MODE["calls"] += 1
        if MODE["fail"]: raise RuntimeError("simulated outage")
        system, user = messages[0]["content"], messages[1]["content"]
        if "You write SEARCH QUERIES" in system:
            person = user.split('"""')[1]; n = norm(person)
            if re.search(r"(غضب|معصب|عصبي)", n): qs = ["لا تغضب"]
            elif "العنكبوت" in n: qs = ["العنكبوت الغار"]
            elif "حامل فقه" in n or "نضر" in n: qs = ["حامل فقه"]
            else: qs = [" ".join([w for w in re.split(r"[^\u0621-\u064A]+", n) if len(w) > 2][:3])]
            if MODE.get("queries") == "none": qs = []
            return _Obj(choices=[_Obj(message=_Obj(content=json.dumps({"queries": qs}, ensure_ascii=False)))])
        if "which shows a person a hadith from the Dorar.net encyclopedia" in system:
            results = json.loads(user.split("RESULTS\n", 1)[1])
            out = {"match_index": 0 if results else None, "confidence": 0.8, "title": "هدوء قبل الرد", "empathy": "من الطبيعي أن تتضايق حين يتكرر الخطأ.",
                   "lesson": "ضبط النفس عند الغضب قوة حقيقية.", "practical_step": "توقف قليلاً قبل أن ترد.",
                   "actions": ["خذ نفساً عميقاً قبل الرد", "اكتب ما تريد قوله ثم راجعه", "تحدث بهدوء على انفراد"], "plan_values": [{"value": "الحلم", "weight": 60}, {"value": "الرفق", "weight": 40}]}
            if MODE["wisdom"] == "banned": out["lesson"] = "رواه البخاري برقم 6116"
            return _Obj(choices=[_Obj(message=_Obj(content=json.dumps(out, ensure_ascii=False)))])
        if "half-remembers a hadith" in system:
            person = user.split('"""')[1]; results = json.loads(user.split("RESULTS\n", 1)[1])
            ranked = sorted(results, key=lambda r: wording_overlap(person, r["text"])["extra"])
            out = {"matches": [{"index": r["index"], "reason": "كلمات مشتركة"} for r in ranked[:1] if wording_overlap(person, r["text"])["extra"] < 0.8]}
            return _Obj(choices=[_Obj(message=_Obj(content=json.dumps(out, ensure_ascii=False)))])
        if "Dorar.net hadith encyclopedia" in system:
            person = user.split('"""')[1]; results = json.loads(user.split("RESULTS\n", 1)[1])
            best = min(results, key=lambda r: wording_overlap(person, r["text"])["extra"]) if results else None
            ov = wording_overlap(person, best["text"]) if best else {"extra": 1, "wording": "different"}
            prec = 1 - ov["extra"]
            out = {"match_index": best["index"] if best and prec >= 0.5 else None,
                   "match_quality": "exact" if ov["wording"] == "exact" else ("close" if prec >= 0.5 else "none"),
                   "explanation": "اختلفت بعض الكلمات عن لفظ المصدر." if ov["wording"] == "different" else "اللفظ موافق للمصدر."}
            out["related"] = [r["index"] for r in results if r is not best and "العنكبوت" in norm(person) and "العنكبوت" in r["text"]][:3]
            if "العنكبوت" in norm(person): out["match_index"] = None; out["related"] = [r["index"] for r in results if "العنكبوت" in r["text"]][:3]
            if MODE["hadith"] == "grade_in_text": out["explanation"] = "هذا حديث صحيح ثابت."
            if MODE["hadith"] == "bad_index": out["match_index"] = 99
        else:
            cands = json.loads(user.split("CANDIDATES\n", 1)[1]); c = cands[0]
            if c["type"] == "dua":
                out = {"match_id": c["id"], "confidence": 0.9, "title": "سكينة في الضيق", "empathy": "نسأل الله أن يخفف عنك.", "lesson": "كان النبي صلى الله عليه وسلم يدعو بهذا الدعاء في مثل هذا الحال.", "practical_step": "", "actions": [], "plan_values": []}
            else:
                out = {"match_id": c["id"], "confidence": 0.85, "title": "هدوء يصنع الفرق", "empathy": "من الطبيعي أن تتضايق في موقف كهذا.", "lesson": "الرفق يصلح ما لا يصلحه العنف.", "practical_step": "توقف قليلاً قبل أن ترد.",
                       "actions": ["اكتب ما تريد قوله ثم راجعه", "تحدث بهدوء على انفراد", "اشكر الطرف الآخر على تقبله"], "plan_values": [{"value": "الرفق", "weight": 50}, {"value": "الحلم", "weight": 30}, {"value": "التعليم", "weight": 20}]}
            if MODE["wisdom"] == "banned": out["lesson"] = "رواه البخاري برقم 6114"
            if MODE["wisdom"] == "none": out = {"match_id": None}
        return _Obj(choices=[_Obj(message=_Obj(content=json.dumps(out, ensure_ascii=False)))])
class OpenAI:
    def __init__(self, *a, **kw): self.embeddings = _Emb(); self.chat = _Obj(completions=_Chat())
