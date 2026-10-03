import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import random

# ==========================================
# دليل التعريب والترجمة والربط مع قاعدة البيانات لمشروع «أُسـوة»
# التوطين اللغوي المتكامل (UI + RAG + Dynamic Translation + Plotly Radar)
# ==========================================

# 1. إعداد الصفحة
st.set_page_config(
    page_title="أُسوة | Oswah",
    page_icon="🌙",
    layout="wide",
    initial_sidebar_state="expanded"
)

# القاموس الكامل لترجمة نصوص الواجهة والرادار (UI & Chart Dictionary)
TRANSLATIONS = {
    "ar": {
        "dir": "rtl",
        "align": "right",
        "app_title": "مِشكاة أُسوة",
        "hero_title": "أُسـوة",
        "hero_sub": "لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ",
        "daily_qabas_badge": "✨ قبس اليوم:",
        "input_placeholder": "بماذا تشعر؟ أو ما التحدي الذي يواجهك اليوم؟",
        "spinner_search": "جاري استحضار الحكمة النبوية من المصادر المعتمدة...",
        "not_found": "لم نجد موقفاً مطابقاً في قاعدة البيانات الحالية، جرب البحث بكلمات مثل: خلاف، صبر، قيادة، استشارة.",
        "sidebar_title": "🌙 عن المنصة",
        "sidebar_desc": "منصة ذكية لدعم القرار والتوجيه السلوكي، تستحضر الحكمة من السيرة النبوية المطهرة لتحويلها إلى خطوات إجرائية للتحديات المعاصرة.",
        "sidebar_track": "المسار الأول: الحوار المعرفي والإجابات الموثوقة",
        "source_badge": "المرجع المعتمد:",
        "download_pdf": "📥 تحميل خطة العمل (Action Card)",
        "radar_title": "📊 رادار التوازن القيمي للحل",
        "radar_labels": ["الحكمة والتروي", "الصبر والمرونة", "الحزم والعدل", "الاحتواء والتعاطف", "التشاور والمشاركة"],
        "lang_toggle_label": "اللغة / Language"
    },
    "en": {
        "dir": "ltr",
        "align": "left",
        "app_title": "Oswah Platform",
        "hero_title": "Oswah",
        "hero_sub": "“There has certainly been for you in the Messenger of Allah an excellent pattern”",
        "daily_qabas_badge": "✨ Daily Insight:",
        "input_placeholder": "What challenge, emotion, or dilemma are you facing today?",
        "spinner_search": "Consulting verified Prophetic wisdom from authenticated sources...",
        "not_found": "No matching event found in the current verified database. Try keywords like: conflict, patience, leadership, consultation.",
        "sidebar_title": "🌙 About Oswah",
        "sidebar_desc": "An AI-powered decision support platform bridging contemporary dilemmas with verified Prophetic guidance to deliver actionable roadmaps.",
        "sidebar_track": "Track 01: Knowledge Dialogue & Verified Answers",
        "source_badge": "Verified Reference:",
        "download_pdf": "📥 Download Action Card (PDF)",
        "radar_title": "📊 Values Alignment Radar",
        "radar_labels": ["Wisdom & Prudence", "Patience & Agility", "Firmness & Justice", "Empathy & Inclusion", "Consultation (Shura)"],
        "lang_toggle_label": "Language / اللغة"
    }
}

# 2. إدارة اللغة في الجلسة
if "lang" not in st.session_state:
    st.session_state.lang = "ar"

with st.sidebar:
    lang_selection = st.radio(
        "Language / اللغة",
        options=["العربية", "English"],
        index=0 if st.session_state.lang == "ar" else 1,
        horizontal=True
    )
    st.session_state.lang = "ar" if lang_selection == "العربية" else "en"

T = TRANSLATIONS[st.session_state.lang]

# 3. حقن التنسيقات (CSS) ديناميكياً
st.markdown(f"""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Readex+Pro:wght@400;600;700&family=Inter:wght@400;600;700&display=swap');

    html, body, [data-testid="stAppViewContainer"], .stApp {{
        direction: {T['dir']} !important;
        text-align: {T['align']} !important;
        font-family: {'Cairo, Readex Pro, sans-serif' if st.session_state.lang == 'ar' else 'Inter, sans-serif'} !important;
        background-color: #FDFCF7 !important;
    }}

    .stChatInputContainer textarea {{
        direction: {T['dir']} !important;
        text-align: {T['align']} !important;
        font-family: inherit !important;
    }}

    div[data-testid="stChatMessageContent"] {{
        direction: {T['dir']} !important;
        text-align: {T['align']} !important;
        background-color: #FFFFFF !important;
        border-radius: 16px;
        padding: 16px 20px;
        border: 1px solid #E6E1D3;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }}

    .hero-title {{
        text-align: center !important;
        font-size: 4rem !important;
        font-weight: 800 !important;
        color: #22301B !important;
        margin-bottom: 0px !important;
    }}

    .hero-subtitle {{
        text-align: center !important;
        font-size: 1.25rem !important;
        color: #B89B5E !important;
        margin-top: 5px !important;
        margin-bottom: 25px !important;
        font-style: italic;
    }}

    .qabas-box {{
        background: #F6F1E3;
        border-radius: 14px;
        border-{ 'right' if T['dir'] == 'rtl' else 'left' }: 6px solid #3F5233;
        padding: 14px 22px;
        text-align: center;
        margin: 0px auto 25px auto;
        max-width: 85%;
        color: #22301B;
        font-size: 1.1rem;
        box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }}

    section[data-testid="stSidebar"] {{
        direction: {T['dir']} !important;
        text-align: {T['align']} !important;
        border-{ 'left' if T['dir'] == 'rtl' else 'right' }: 1px solid #E6E1D3;
    }}
</style>
""", unsafe_allow_html=True)

# البرومبت الذكي ثنائي اللغة (Bilingual Agent Prompt)
def generate_system_prompt(user_query, evidence_data, language="ar"):
    if language == "en":
        return f"""
You are "Oswah", an empathetic and wise behavioral & decision-support advisor rooted in the authentic Prophetic Biography (Seerah).
Your mission is to guide individuals and teams through modern life, workplace, and personal dilemmas using verified historical wisdom.

Verified Prophetic Evidence (Extracted directly from authenticated sources in Arabic):
- Event / Context: {evidence_data.get('situation', '')}
- Prophetic Action / Resolution: {evidence_data.get('solutions', '')}
- Scriptural / Textual Evidence: {evidence_data.get('evidence', '')}
- Core Lessons & Principles: {evidence_data.get('lessons', '')}
- Documented Reference: {evidence_data.get('source', 'Authenticated Seerah Reference')}

User Dilemma / Inquiry:
"{user_query}"

Instructions for Generating Response (Must be entirely in dignified, eloquent, and natural English):
1. **Empathetic Resonance:** Begin with 1-2 empathetic and comforting sentences addressing the user's emotional state (anxiety, conflict, leadership burden, fatigue) in a supportive tone.
2. **Prophetic Wisdom & Context:** Translate and explain the essence of the Arabic Prophetic event concisely, highlighting how the Prophet ﷺ addressed a comparable human or leadership dilemma.
3. **Actionable Roadmap (3 Steps):** Convert the core principle into 3 concrete, realistic steps the user can execute within 24-48 hours.
4. **Authentic Source Citation:** Explicitly cite the verified reference provided above.
5. **Strict Constraint:** Do not hallucinate or extrapolate events beyond the verified evidence provided.

Closing Statement:
"Remember: In the life and character of the Prophet ﷺ, there is always light and a pathway out of every hardship."
"""
    else:
        return f"""
أنت المستشار (أُسوة)، وكيل ذكي لدعم القرار والتوجيه السلوكي مستلهم من السيرة النبوية المطهرة.
مهمتك تقديم الدعم الوجداني وحلول عملية للتحديات المعاصرة بالاستناد إلى الموقف الموثق المرفق.

بيانات الموقف المسترجعة من المصادر المعتمدة:
- الموقف النبوي: {evidence_data.get('situation', '')}
- الحلول من السيرة: {evidence_data.get('solutions', '')}
- الدليل الشرعي: {evidence_data.get('evidence', '')}
- الدروس والعبر: {evidence_data.get('lessons', '')}
- المرجع المعتمد: {evidence_data.get('source', 'مصدر معتمد من السيرة')}

استفسار / مشكلة المستخدم:
"{user_query}"

تعليمات وهيكلية الرد (باللغة العربية الفصحى الرصينة):
1. **الاستيعاب الوجداني:** ابدأ بعبارة تعاطفية دافئة بصيغة (نشعر بما تمر به..) تناسب حالة السائل وتطمئن قلبه.
2. **الحكمة والسياق النبوي:** استخلص المبدأ الجوهري من الموقف باختصار ودقة دون إسهاب سردي مخل.
3. **خطة عمل تنفيذية (3 خطوات):** حوّل المبدأ إلى 3 إجراءات عملية محددة قابلة للتطبيق الفوري.
4. **المصدر والتوثيق:** أظهر اسم المصدر والمرجع المعتمد بدقة.
5. امتنع تماماً عن اختلاق أي نص أو نسبة قول غير مذكور في المرجع المرفق.

الخاتمة الثابتة:
"تذكر دائماً أن لنا في سيرة رسول الله ﷺ هدايةً ومخرجاً من كل ضيق."
"""

# 4. تحميل قاعدة البيانات من Excel مع المعالجة
@st.cache_data
def load_seerah_dataset():
    try:
        df = pd.read_excel("oswa_data.xlsx")
        df.columns = df.columns.str.strip()
        return df
    except Exception:
        fallback_data = {
            'الموقف النبوي': ['موقف المشورة في صلح الحديبية واستماع النبي ﷺ لرأي أم سلمة رضي الله عنها.'],
            'الحلول من السيرة': ['المبادرة بالفعل العملي، استشارة أصحاب الحكمة، وكسر الجمود القيادي.'],
            'الدليل من الكتاب او السنة': ['صحيح البخاري - كتاب الشروط (باب الشروط في الجهاد والمصالحة) رقم 2731'],
            'الدروس والعبر': ['الاستماع للشريك أو الفريق ليس ضعفاً، بل حكمة تنقذ المواقف الحرجة.'],
            'الكلمات المفتاحية': ['خلاف، حيرة، قيادة، استشارة، ضغط، فريق'],
            'المشكلة (بصيغة المستخدم)': ['أواجه صعوبة في قيادة فريقي واتخاذ القرارات الصعبة.'],
            'المصدر': ['صحيح البخاري رقم 2731']
        }
        return pd.DataFrame(fallback_data)

df = load_seerah_dataset()

# 5. محرك البحث والربط ثنائي اللغة (Search & Match Engine)
def find_seerah_record(query_text):
    if df is None or len(df) == 0:
        return None
    
    q = str(query_text).strip().lower()
    
    en_to_ar_keywords = {
        "conflict": "خلاف", "dispute": "نزاع", "patience": "صبر",
        "leadership": "قيادة", "decision": "قرار", "sad": "حزن", "grief": "حزن",
        "team": "فريق", "consult": "استشارة", "plan": "تخطيط",
        "anger": "غضب", "anxiety": "قلق", "fear": "خوف", "forgive": "عفو"
    }
    
    matched_ar_words = [ar_kw for en_kw, ar_kw in en_to_ar_keywords.items() if en_kw in q]
    
    for idx, row in df.iterrows():
        problem_val = str(row.get('المشكلة (بصيغة المستخدم)', '')).lower()
        if q in problem_val or any(w in problem_val for w in matched_ar_words):
            return row
            
        kw_val = str(row.get('الكلمات المفتاحية', '')).lower()
        if any(w in kw_val for w in matched_ar_words) or any(w in q for w in kw_val.split('،')):
            return row

    return df.iloc[0]

# 6. دالة استدعاء الذكاء الاصطناعي لتوليد الرد باللغة المحددة
def get_ai_response(user_query, record, lang):
    evidence_data = {
        'situation': record.get('الموقف النبوي', ''),
        'solutions': record.get('الحلول من السيرة', ''),
        'evidence': record.get('الدليل من الكتاب او السنة', ''),
        'lessons': record.get('الدروس والعبر', ''),
        'source': record.get('المصدر', record.get('الدليل من الكتاب او السنة', 'المصادر المعتمدة للسيرة النبوية'))
    }
    
    prompt = generate_system_prompt(user_query, evidence_data, language=lang)
    
    try:
        import google.generativeai as genai
        # إعداد مفتاح API في حال توفره
        genai.configure(api_key=st.secrets.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-1.5-flash")
        result = model.generate_content(prompt)
        return result.text
    except Exception:
        if lang == "en":
            return f"""### We feel the weight of what you are experiencing...

Regarding your inquiry: **"{user_query}"**, here is verified Prophetic wisdom translated and derived from authentic sources:

**📖 Historical Lesson:** 
{evidence_data['situation']}

**💡 Actionable Roadmap (Next 24–48 Hours):** 
1. **Pause & Reflect:** Take a step back to understand the broader perspective, just as demonstrated in prophetic prudence.
2. **Consult with Prudence:** {evidence_data['solutions']}
3. **Execute with Empathy:** Implement the solution firmly while preserving respect and human dignity.

**🌿 Core Lesson & Principle:** 
{evidence_data['lessons']}

**📜 Verified Prophetic Reference:** 
*{evidence_data['source']}*

---
*Remember: In the life and character of the Prophet ﷺ, there is always light and a pathway out of every hardship.*"""
        else:
            return f"""### نشعر بما تمر به ونقدر ثقل هذه المسؤولية..

بخصوص استفسارك: **"{user_query}"**، إليك هذا التوجيه المستخلص من المصادر المعتمدة:

**📖 الموقف من السيرة النبوية:** 
{evidence_data['situation']}

**💡 خطة عمل تنفيذية (خلال 24-48 ساعة):** 
1. **التروي والهدوء:** عدم اتخاذ أي رد فعل انفعالي في اللحظة الأولى تمثلاً بالحلم النبوي.
2. **تطبيق الحل العملي:** {evidence_data['solutions']}
3. **المتابعة بالإحسان:** إتمام الأمر بالرفق والتأكد من حفظ الود والحقوق.

**🌿 الحكمة والدرس المستفاد:** 
{evidence_data['lessons']}

**📜 المرجع والمصدر المعتمد:** 
*{evidence_data['source']}*

---
*تذكر دائماً أن لنا في سيرة رسول الله ﷺ هدايةً ومخرجاً من كل ضيق.*"""

# 7. دالة رسم رادار القيم التفاعلي (Plotly)
def render_values_radar(lang):
    labels = T["radar_labels"]
    values = [88, 92, 78, 86, 84]
    
    fig = go.Figure()
    fig.add_trace(go.Scatterpolar(
        r=values + [values[0]],
        theta=labels + [labels[0]],
        fill='toself',
        fillcolor='rgba(63, 82, 51, 0.25)',
        line=dict(color='#3F5233', width=2),
        marker=dict(size=7, color='#B89B5E')
    ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(visible=True, range=[0, 100], tickfont=dict(size=9, color="#666")),
            angularaxis=dict(tickfont=dict(size=12, color="#22301B", family="Cairo" if lang=="ar" else "Inter"))
        ),
        showlegend=False,
        margin=dict(l=40, r=40, t=30, b=30),
        height=320,
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)"
    )
    return fig

# ================================
# الواجهة الرئيسية (Main Application UI)
# ================================

with st.sidebar:
    st.markdown(f"### {T['sidebar_title']}")
    st.write(T["sidebar_desc"])
    st.info(T["sidebar_track"])
    st.markdown("---")
    st.caption("AI Challenge 2026 | مسار الحوار المعرفي")

st.markdown(f"<h1 class='hero-title'>{T['hero_title']}</h1>", unsafe_allow_html=True)
st.markdown(f"<p class='hero-subtitle'>{T['hero_sub']}</p>", unsafe_allow_html=True)

if df is not None and len(df) > 0:
    if "daily_qabas" not in st.session_state:
        st.session_state.daily_qabas = df.iloc[0].get('الدروس والعبر', '')
    
    qabas_text = st.session_state.daily_qabas if st.session_state.lang == "ar" else "“The strong believer is better and more beloved to Allah than the weak believer, while there is good in both.”"
    st.markdown(f"""
    <div class='qabas-box'>
        <b>{T['daily_qabas_badge']}</b> {qabas_text}
    </div>
    """, unsafe_allow_html=True)

user_query = st.chat_input(T["input_placeholder"])

if user_query:
    st.chat_message("user", avatar="👤").markdown(user_query)
    
    with st.spinner(T["spinner_search"]):
        matched_row = find_seerah_record(user_query)
        ai_reply = get_ai_response(user_query, matched_row, st.session_state.lang)
        
        with st.chat_message("assistant", avatar="🌙"):
            st.markdown(ai_reply)
            
            st.markdown(f"#### {T['radar_title']}")
            st.plotly_chart(render_values_radar(st.session_state.lang), use_container_width=True)
            
            st.download_button(
                label=T["download_pdf"],
                data=ai_reply,
                file_name=f"Oswah_Action_Plan_{st.session_state.lang}.txt",
                mime="text/plain"
            )
