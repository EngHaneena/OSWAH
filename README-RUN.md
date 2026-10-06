# تشغيل أُسوة على Windows ورفعها للتحكيم

## بنية المشروع

```
oswah-project/
├─ backend/                 خادم Python (FastAPI)
│  ├─ main.py               التطبيق + /api/health + /api/vector-search («موقف مماثل»)
│  ├─ hadith_check.py       /api/hadith-check («تحقّق») و /api/hadith-find («ابحث عن حديث»)
│  ├─ core.py  deps.py      المنطق المشترك والإعدادات
│  ├─ requirements.txt      الحزم الأساسية
│  ├─ requirements-excel.txt اختياري (وضع الإكسل فقط)
│  ├─ .env.example          ← تُنسخ إلى .env
│  └─ data/asowa_complete_integration_.xlsx
├─ frontend/                Next.js 14 (App Router)
│  ├─ public/index.html     واجهة المنصة كاملة (كل الصفحات والبراعم والاستوديو)
│  ├─ app/api/health        فحص الاتصال بالخادم
│  ├─ app/api/wisdom        ← FastAPI /api/vector-search
│  ├─ app/api/hadith-check  ← FastAPI /api/hadith-check
│  ├─ app/api/hadith-find   ← FastAPI /api/hadith-find
│  ├─ lib/server/oswahBackend.ts  حد الطلبات والاتصال بالخادم
│  ├─ package.json  next.config.mjs  tsconfig.json
│  └─ .env.local.example    ← تُنسخ إلى .env.local
├─ run-backend.bat  run-frontend.bat   تشغيل بنقرة مزدوجة
├─ render.yaml              رفع الخادم على Render
└─ tests/run_tests.py       اختبارات الخلفية (تعمل دون إنترنت)
```

**مسار الطلب:**
المتصفح ← Next.js (`/api/...` على المنفذ 3000) ← FastAPI (المنفذ 8000) ← الدرر السنية + OpenAI.
الواجهة تكتشف الخادم وحدها عبر `/api/health`. إن وجدته استخدمته، وإن لم تجده عملت بوضع المتصفح.

---

## ١. البرامج المطلوبة

| البرنامج | الإصدار | لماذا |
|---|---|---|
| Python | **3.11** (يعمل 3.10 إلى 3.12) | الخادم. الكود يحتاج 3.10 على الأقل |
| Node.js | **20 LTS** (الحد الأدنى 18.18) | Next.js 14 |
| Git | أي إصدار حديث | **غير مطلوب للتشغيل المحلي**، ومطلوب فقط لرفع المشروع إلى GitHub ثم Render وVercel. ويمكن بدلاً منه استخدام GitHub Desktop |
| مفتاح OpenAI | — | تحتاجه خانتا «موقف مماثل» و«تحقّق». أما «ابحث عن حديث» فيعمل بدونه |

**تثبيت Python 3.11:** من python.org. في أول شاشة ضعوا ✔ على **Add python.exe to PATH**.
تأكدوا من التثبيت في PowerShell:

```powershell
py -3.11 --version
node --version
npm --version
```

---

## ٢. التشغيل المحلي (أسرع طريقة)

فكّوا الضغط مثلاً في `C:\oswah-project`، ثم:

1. انقروا مرتين على **`run-backend.bat`**.
   - أول مرة: ينشئ `.venv` ويثبّت الحزم وينشئ `backend\.env` ويفتحه في Notepad.
   - ضعوا قيمة `OPENAI_API_KEY`، واحفظوا، ثم شغّلوا الملف مرة ثانية.
2. انقروا مرتين على **`run-frontend.bat`**. أول مرة يثبّت الحزم (`npm install`)، وقد يستغرق ذلك دقائق.
3. افتحوا **http://localhost:3000**

---

## ٣. التشغيل المحلي بالأوامر (نفس ما تفعله الملفات أعلاه)

### الخادم (نافذة PowerShell أولى)

```powershell
cd C:\oswah-project\backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
notepad .env
uvicorn main:app --reload --port 8000
```

- إن ظهرت رسالة «running scripts is disabled» عند `Activate.ps1`، نفّذوا هذا مرة واحدة ثم أعيدوا التفعيل:
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
- في موجه الأوامر cmd يكون التفعيل: `.venv\Scripts\activate.bat`

### الواجهة (نافذة ثانية، والخادم ما زال يعمل)

```powershell
cd C:\oswah-project\frontend
copy .env.local.example .env.local
npm install
npm run dev
```

---

## ٤. ملفات البيئة

### `backend\.env`

| المتغير | مطلوب؟ | القيمة |
|---|---|---|
| `OPENAI_API_KEY` | نعم («موقف مماثل» و«تحقّق») | مفتاحكم من OpenAI |
| `OPENAI_CHAT_MODEL` | نعم | `gpt-4o-mini`. تأكدوا أنه متاح في حسابكم |
| `SITUATION_SOURCE` | نعم | `dorar` (البحث في الدرر). أو `excel` (يحتاج `pip install -r requirements-excel.txt` و`OPENAI_EMBED_MODEL`) |
| `BACKEND_SHARED_SECRET` | يُنصح به | **أحرف إنجليزية فقط**، ونفس القيمة في `frontend\.env.local` |
| `DORAR_API_URL` | موجود افتراضياً | `https://dorar.net/dorar_api.json` |
| `DORAR_TIMEOUT` | اختياري | `12` |
| `ALLOWED_ORIGINS` | اختياري | `http://localhost:3000` |
| `EMERGENCY_NUMBERS` | اختياري | أرقام الطوارئ (تُراجع قبل الإطلاق) |
| `EXCEL_PATH`، `CHROMA_DIR`، `CONTENT_GATE`، `SIMILARITY_THRESHOLD`، `TOP_K`، `OPENAI_EMBED_MODEL` | لوضع `excel` فقط | القيم في `.env.example` |

### `frontend\.env.local`

| المتغير | القيمة محلياً | القيمة بعد الرفع |
|---|---|---|
| `PY_BACKEND_URL` | `http://localhost:8000` | رابط Render، مثل `https://oswah-backend.onrender.com` |
| `BACKEND_SHARED_SECRET` | نفس قيمة الخادم | نفس قيمة الخادم |

**لا يوجد أي مفتاح OpenAI في الواجهة.** متغيرات الواجهة بلا بادئة `NEXT_PUBLIC_`، فلا تصل إلى المتصفح.

---

## ٥. التأكد أن الواجهة متصلة بالخادم

1. **الخادم وحده:** افتحوا http://localhost:8000/api/health، ويجب أن يظهر:
   `{"situation_source":"dorar","ready":true,...}`
   وفي http://localhost:8000/docs تجدون صفحة تجربة المسارات.
2. **الواجهة مع الخادم:** افتحوا http://localhost:3000/api/health، ويجب أن يظهر:
   `{"frontend":"ok","backend_url":"http://localhost:8000","backend":{"situation_source":"dorar","ready":true,...}}`
   إن ظهر `"backend": null` و`"error":"backend_unreachable"`، فالخادم غير مشغّل أو `PY_BACKEND_URL` خطأ.
3. **داخل المنصة:** افتحوا «تبيّن وتحقّق» ثم أي خانة. تحت مربع الكتابة يجب أن تظهر شارة **«متصل بخادم أُسوة»**، وإن ظهر «وضع البيانات فقط» فالخادم غير متصل.
4. **تجربة فعلية:** في «ابحث عن حديث» اكتبوا `لا تغضب`، فتظهر «نتائج الدرر السنية».

---

## ٦. الرفع للتحكيم (رابط يعمل لأي شخص)

### الطريقة الموصى بها: الخادم على Render، والواجهة على Vercel (من مستودع GitHub واحد)

**أ) رفع المشروع إلى GitHub:** ملف `.gitignore` يمنع رفع المفاتيح.

```powershell
cd C:\oswah-project
git init
git add .
git commit -m "Oswah"
git branch -M main
git remote add origin https://github.com/<اسم-الحساب>/oswah.git
git push -u origin main
```

**ب) الخادم على Render:**
1. ادخلوا render.com، ثم New، ثم **Blueprint**، واختاروا المستودع. سيقرأ `render.yaml` تلقائياً.
2. أدخلوا `OPENAI_API_KEY` و`BACKEND_SHARED_SECRET`، ثم Deploy.
3. افتحوا `https://<اسم-الخدمة>.onrender.com/api/health` وتأكدوا أن فيه `"ready": true`.

**ج) الواجهة على Vercel:**
1. ادخلوا vercel.com، ثم Add New، ثم Project، واختاروا المستودع.
2. في **Root Directory** اختاروا `frontend`. الإطار Next.js يُكتشف تلقائياً.
3. في Environment Variables أضيفوا:
   - `PY_BACKEND_URL` = رابط Render
   - `BACKEND_SHARED_SECRET` = نفس القيمة
4. اضغطوا Deploy، ثم افتحوا `https://<المشروع>.vercel.app/api/health` للتأكد، وأرسلوا رابط `vercel.app` للجنة.

**تنبيهات للتحكيم:**
- خطة Render المجانية **تُطفئ الخادم بعد 15 دقيقة بلا استخدام**، فيتأخر أول طلب بعدها قرابة دقيقة. افتحوا رابط `/api/health` قبل العرض بخمس دقائق، أو اختاروا الخطة المدفوعة الصغرى يوم التحكيم.
- جعلت مهلة مسارات Next.js على Vercel 60 ثانية (`maxDuration`) لطلبات الذكاء الاصطناعي.

### طريقة احتياطية يوم التحكيم: تشغيل محلي مع رابط عام مؤقت

شغّلوا المشروع محلياً (القسم ٢)، ثم في نافذة ثالثة:

```powershell
winget install --id Cloudflare.cloudflared
cloudflared tunnel --url http://localhost:3000
```

يظهر رابط مثل `https://xxxx.trycloudflare.com` يعمل لأي شخص ما دام جهازكم مشغّلاً.

---

## ٧. الاختبارات

```powershell
cd C:\oswah-project
backend\.venv\Scripts\python.exe tests\run_tests.py
```

يجب أن تظهر النتيجة `58/58 passed`.

## ٨. ملاحظات

- **الوضع الافتراضي:** «موقف مماثل» يبحث في الدرر (`SITUATION_SOURCE=dorar`)، ولا يحتاج `chromadb`.
- **ملفات إضافية اختيارية:** `extras/nextjs-components/HadithCheckCard.tsx` بطاقة React منفصلة. الواجهة الحالية لا تحتاجها، فهي ترسم النتائج وصور المشاركة بنفسها.
- **الدرر السنية:** راسلوا الدرر لإبلاغهم بالاستخدام قبل الإطلاق العلني.
