"""
اختبارات الخلفية دون إنترنت: python tests/run_tests.py
تستخدم بدائل مبسّطة لـ FastAPI/OpenAI/ChromaDB/httpx (مجلد stubs) وملف الإكسل الحقيقي.
"""
import json, os, sys, tempfile
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path[:0] = [os.path.join(ROOT, "tests", "stubs"), os.path.join(ROOT, "backend")]
os.environ.update(EXCEL_PATH=os.path.join(ROOT, "backend", "data", "asowa_complete_integration_.xlsx"), CHROMA_DIR=tempfile.mkdtemp(),
                  SIMILARITY_THRESHOLD="0.30", BACKEND_SHARED_SECRET="", SITUATION_SOURCE="excel")
import openai as fake_openai, httpx as fake_httpx
import core, main, hadith_check, deps
from fastapi import HTTPException

R = []
def ok(name, cond, detail=""):
    cond = bool(cond); R.append(cond); print(("PASS " if cond else "FAIL ") + name + (f"  ({detail})" if detail else ""))

# ---------- core: الإكسل وبوابة المحتوى ----------
data = core.load_excel(os.environ["EXCEL_PATH"])
sits = data["situations"]
ok("قراءة 18 موقفاً من ورقة «المواقف»", len(sits) == 18, len(sits))
ok("قراءة عمود user_problem من الصف الذي فوق العناوين", all(s.get("user_problem") for s in sits[:10]))
ok("تجاهل صيغ search_text (تُحسب في الخلفية)", all(s.get("search_text") is None for s in sits))
ok("قراءة 3 أدعية من ورقة «الأذكار»", len(data["adhkar"]) == 3)
items = core.build_items(data, "documented")
ok("بوابة المحتوى: 10 مواقف موثقة + 3 أدعية", sum(i["type"] == "situation" for i in items) == 10 and sum(i["type"] == "dua" for i in items) == 3)
ok("بوابة «approved»: لا شيء معتمد بعد", len([i for i in core.build_items(data, "approved") if i["type"] == "situation"]) == 0)
ok("نص الفهرسة لا يحتوي النص الشرعي", all((it.get("source_text_ar") or "@@")[:25] not in it["index_text"] and (it.get("text") or "@@")[:25] not in it["index_text"] for it in items))
cand = [core.candidate_for_model(i) for i in items]
ok("ما يُرسل للنموذج خالٍ من نص الحديث والدعاء", all("source_text_ar" not in c and "text" not in c for c in cand))

# ---------- المسار الأول: /api/vector-search ----------
info = main.build_index()
ok("بناء الفهرس المتجهي", info["items"] == 13, info)
ok("عدم إعادة البناء دون تغيير", main.build_index()["rebuilt"] is False)
vs = lambda t, **kw: main.vector_search(main.VectorSearchIn(problem=t, **kw))
hits = sum(1 for s in sits[:10] if (r := vs(s["user_problem"])).get("success") and r["item"]["id"] == s["id"])
ok("كل «مشكلة بصيغة المستخدم» تسترجع موقفها", hits == 10, f"{hits}/10")
r = vs(sits[2]["user_problem"])
ok("الاستجابة: النص الشرعي من القاعدة حرفياً + صياغة بشارة", r["item"]["source_text_ar"] == sits[2]["source_text_ar"] and r["mode"] == "ai" and r["ai_disclosure"])
ok("خطة 24 ساعة: 3 خطوات وقيم مجموعها 100", len(r["generated"]["actions"]) == 3 and sum(v["weight"] for v in r["generated"]["plan_values"]) in (99, 100, 101))
r = vs("أشعر بالحزن والضيق")  # التضمينات البديلة هنا لفظية؛ التضمينات الحقيقية تفهم المعنى (اضبطوا الحد بـ --probe)
ok("الشعور ← دعاء من ورقة الأذكار، بلا خطة", r.get("success") and r["item"]["type"] == "dua" and r["generated"]["actions"] == [], r.get("item", {}).get("id"))
ok("نص الدعاء يُعاد حرفياً من القاعدة", r["item"]["text"] == data["adhkar"][0]["text"])
ok("أزمة نفسية: إيقاف المسار وأرقام الطوارئ", vs("لا أريد أن أعيش وأفكر بإيذاء نفسي")["kind"] == "crisis")
ok("فتوى شخصية: إحالة", vs("أنا في دولة كذا، هل يجوز لي فعل كذا في زواجي؟")["kind"] == "ruling")
ok("الشفافية: هل أنت شيخ؟", vs("هل أنت شيخ أو إنسان؟")["kind"] == "identity")
ok("مقاومة الهلوسة: مشكلة تقنية ← لا تطابق", vs("السيرفر عندي يعطي خطأ في قاعدة البيانات بعد التحديث")["kind"] == "no_match")
fake_openai.MODE["wisdom"] = "banned"; r = vs(sits[2]["user_problem"])
ok("مخرجات مخالفة (رقم حديث/«رواه») ← تُرفض ونعرض البيانات الخام", r["mode"] == "fallback" and r["generated"] is None and r["note"])
fake_openai.MODE["wisdom"] = "none"; r = vs(sits[2]["user_problem"])
ok("النموذج يقول «لا يناسب» ← اعتذار لا تخمين", r["kind"] == "no_match")
fake_openai.MODE["wisdom"] = "good"; fake_openai.MODE["fail"] = True
r = vs(sits[2]["user_problem"])
ok("انقطاع OpenAI أثناء الصياغة ← نعرض بيانات القاعدة", r["success"] and r["mode"] == "fallback" and r["item"]["id"] == sits[2]["id"])
fake_openai.MODE["fail"] = False
try: vs("قصير"); ok("رفض النص القصير", False)
except HTTPException as e: ok("رفض النص القصير (400)", e.status_code == 400)

# ---------- الدرر السنية: شكل الرد الحقيقي ----------
real = core.parse_dorar_payload(open(os.path.join(ROOT, "tests", "fixtures", "dorar_real_sample.json"), "rb").read())
ok("تحليل رد حقيقي من الدرر (3 نتائج بكل الحقول)", len(real) == 3 and real[0]["scholar"] == "الألباني" and real[0]["reference"] == "433" and real[0]["grade"] == "إسناده صحيح")
ok("رد حقيقي: اكتشاف النص المختصر وحذف « .» الزائدة", real[0]["truncated"] and not real[1]["truncated"] and not real[1]["hadith_text"].endswith("."))
ok("رد حقيقي: «-» في الراوي = لا راوي، وتصنيف «فيه انقطاع» ضعيفاً", real[1]["narrator"] == "" and core.grade_class(real[1]["grade"]) == "weak")
ok("رد حقيقي: الحكم المحاط بأقواس كلياً يُنظَّف، والجزئي يبقى حرفياً", real[2]["grade"] == "له طريقان في الأول غير ثقة وفي الثاني ليس بشيء" and core._clean("[فيه] ابن أرطأة: ضعيف ولكن تابعه عمرو بن عامر") == "[فيه] ابن أرطأة: ضعيف ولكن تابعه عمرو بن عامر")

# ---------- 1) تحقّق من صحة حديث (الدرر مباشرة) ----------
hc = lambda t: hadith_check.hadith_check(hadith_check.HadithIn(hadith=t))
r = hc("قال رسول الله ﷺ: أوصني، قال: لا تغضب، فردد مرارا، قال: لا تغضب")
ok("حديث موجود: الحكم منسوخ من الدرر + رابط النص الكامل", r["success"] and r["result"]["status"] == "صحيح" and r["result"]["source"] == "صحيح البخاري" and r["result"]["dorar_url"].startswith("https://dorar.net/hadith/search?q="), r.get("result", {}).get("status"))
r = hc("لا تغضب")
ok("مقطع صحيح ← wording = partial (ليس «مغلوطاً»)", r["success"] and r["result"]["wording"] == "partial")
nadr = "نضر الله امرأ سمع مقالتي فوعاها وحفظها وبلغها، فرب حامل فقه إلى من هو أفقه منه، ثلاث لا يغل عليهن قلب مسلم: إخلاص العمل لله، ومناصحة أئمة المسلمين، ولزوم جماعتهم، فإن الدعوة تحيط من ورائهم"
ok("لفظ مطابق ← exact", (r := hc(nadr))["success"] and r["result"]["wording"] == "exact")
r = hc("نضر الله امرأ سمع حديثي فنشره بين الناس، فرب حامل فقه إلى من هو أفقه منه")
ok("صيغة محرّفة ← different (صورة المقارنة)", r["success"] and r["result"]["wording"] == "different" and r["result"]["wording_matches_input"] is False)
r = hc("خدمت رسول الله صلى الله عليه وسلم عشر سنين، فما قال لي أف قط، وما قال لي لشيء صنعته لم صنعته، ولا لشيء تركته لم تركته")
ok("نص الدرر مختصر ← لا نحكم بأن الصيغة مغلوطة (unverifiable)", r["success"] and r["result"]["truncated"] and r["result"]["wording"] == "unverifiable" and r["result"]["wording_matches_input"] is None)
r = hc("هل صحيح أن العنكبوت نسج خيطاً على باب الغار؟")
ok("معلومة عن السيرة: لا تطابق، لكن تُعرض الروايات ذات الصلة بحكمها من الدرر حرفياً", r["success"] is False and r["related"] and r["related"][0]["grade"] == "[نص تجريبي] إسناده ضعيف" and r["related"][0]["status_class"] == "weak")
fake_openai.MODE["hadith"] = "grade_in_text"; r = hc("لا تغضب")
ok("النموذج كتب حكماً في الشرح ← يُحذف", r["success"] and r["result"]["explanation"] == "")
fake_openai.MODE["hadith"] = "bad_index"; r = hc("لا تغضب")
ok("النموذج اختار نتيجة غير موجودة ← لا تطابق موثوق", r["success"] is False)
fake_openai.MODE["hadith"] = "good"; fake_openai.MODE["fail"] = True; r = hc(nadr)
ok("انقطاع OpenAI ← مطابقة لفظية صارمة", r["success"] and r["result"]["wording"] == "exact")
ok("انقطاع OpenAI + صيغة محرّفة ← لا نخمّن", hc("نضر الله امرأ سمع حديثي فنشره بين الناس")["success"] is False)
fake_openai.MODE["fail"] = False; fake_httpx.FAIL["on"] = True; r = hc("لا تغضب")
ok("تعذّر الوصول للدرر ← 502 برسالة واضحة", getattr(r, "status_code", 0) == 502 and r.content["error"] == "dorar_unavailable")
fake_httpx.FAIL["on"] = False

# ---------- 2) ابحث عن حديث: الدرر فقط، بلا OpenAI ----------
hf = lambda **kw: hadith_check.hadith_find(hadith_check.FindIn(**kw))
calls_before = fake_openai.MODE["calls"]; fake_httpx.QUERIES.clear()
r = hf(hadith="رب حامل فقه إلى من هو أفقه منه")
ok("البحث يعمل بالحقل hadith ويرجع نتيجة الدرر", r["success"] and r["results"][0]["hadith_text"].startswith("نضر الله"))
ok("لا استدعاء لـ OpenAI إطلاقاً في «ابحث عن حديث»", fake_openai.MODE["calls"] == calls_before, f"calls={fake_openai.MODE['calls'] - calls_before}")
ok("النص يُرسل إلى الدرر مباشرة (عبارة واحدة كفت)", fake_httpx.QUERIES == ["رب حامل فقه إلى من هو أفقه منه"], fake_httpx.QUERIES)
x = r["results"][0]
ok("الحكم والمحدث والمصدر والرقم كما أرجعتها الدرر", x["grade"] == "صحيح" and x["scholar"] == "ابن حجر العسقلاني" and x["source"] == "موافقة الخبر الخبر" and x["reference"] == "1/364")
ok("لا حقول من عندنا: لا status_class ولا reason ولا اختيار", "status_class" not in x and "reason" not in x and r["count"] == len(r["results"]))
fake_openai.MODE["fail"] = True; r = hf(hadith="لا تغضب")
ok("يعمل حتى لو كان OpenAI متوقفاً تماماً", r["success"] and "تغضب" in r["results"][0]["hadith_text"])
fake_openai.MODE["fail"] = False
ok("الحقل القديم query ما زال مقبولاً", hf(query="لا تغضب")["success"])
fake_httpx.QUERIES.clear(); order = [rr["hadith_text"][:12] for rr in hf(hadith="الغضب")["results"]]
ok("كلمة واحدة تُرسل إلى الدرر كما هي", fake_httpx.QUERIES == ["الغضب"], fake_httpx.QUERIES)
ok("ترتيب النتائج كما أرجعتها الدرر (دون إعادة ترتيب)", order == [c[0][:12] for c in fake_httpx.CORPUS if "الغضب" in c[0]], order)
r = hf(hadith="كوكب المريخ والصواريخ الفضائية")
ok("لا نتائج ← success=false ورسالة واضحة", r["success"] is False and r["results"] == [] and r["count"] == 0)
fake_httpx.FAIL["on"] = True; r = hf(hadith="لا تغضب")
ok("الدرر متوقفة ← 502", getattr(r, "status_code", 0) == 502 and r.content["error"] == "dorar_unavailable")
fake_httpx.FAIL["on"] = False
try: hf(hadith="  "); ok("نص فارغ ← 400", False)
except HTTPException as e: ok("نص فارغ ← 400", e.status_code == 400)

# ---------- 3) موقف مماثل من السيرة (الدرر مباشرة) ----------
deps.settings.situation_source = "dorar"; fake_httpx.QUERIES.clear()
r = vs("زميلي يخطئ دائماً وأنا معصب جداً ولا أريد أن أجرحه")
ok("الموقف ← الذكاء الاصطناعي يكتب عبارة البحث ويبحث في الدرر", fake_httpx.QUERIES == ["لا تغضب"], fake_httpx.QUERIES)
ok("الموقف ← حديث ثابت من الدرر بنصه وحكمه + صياغة بشارة", r["success"] and r["source"] == "dorar" and r["item"]["grade"] == "صحيح" and r["item"]["hadith_text"].startswith("أن رجلا") and r["generated"]["actions"] and r["ai_disclosure"])
ok("الموقف لا يعرض إلا الثابت (الروايات الضعيفة مستبعدة)", all(x["status_class"] == "authentic" for x in [r["item"]] + r["related"]))
fake_openai.MODE["wisdom"] = "banned"; r = vs("زميلي يخطئ دائماً وأنا معصب جداً")
ok("صياغة مخالفة ← لا نعرضها", r["success"] is False and r["kind"] == "no_match")
fake_openai.MODE["wisdom"] = "good"; fake_httpx.FAIL["on"] = True; r = vs("زميلي يخطئ دائماً وأنا معصب جداً")
ok("الدرر متوقفة ← رسالة واضحة (لا نرجع للإكسل)", r["kind"] == "dorar_unavailable")
fake_httpx.FAIL["on"] = False
ok("فحص السلامة يسبق البحث في الدرر", vs("لا أريد أن أعيش")["kind"] == "crisis")

# ---------- تحليل شكل JSON بديل ----------
alt = core.parse_dorar_payload({"data": [{"hadith": "إنما الأعمال بالنيات", "rawi": "عمر", "mohdith": "البخاري", "book": "صحيح البخاري", "numberOrPage": "1", "grade": "صحيح"}]})
ok("يدعم واجهة JSON منظمة أيضاً", alt and alt[0]["reference"] == "1" and alt[0]["scholar"] == "البخاري")
jsonp = core.parse_dorar_payload('cb({"ahadith":{"result":"<div class=\\"hadith\\">1 - نص</div><div class=\\"hadith-info\\"><span class=\\"info-subtitle\\">خلاصة حكم المحدث:</span> <span>صحيح</span></div>"}})')
ok("يدعم ردّ JSONP", jsonp and jsonp[0]["grade"] == "صحيح")

print(f"\n{sum(R)}/{len(R)} passed")
sys.exit(0 if all(R) else 1)
