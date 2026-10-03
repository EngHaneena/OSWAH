import { TileData } from './types';

// 1. قاموس نصوص العناصر المركزية وأزرار التحكم
export const UI_TRANSLATIONS = {
  ar: {
    verse: 'لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ',
    enterBtn: 'دخول',
    hideTiles: 'إخفاء البطاقات',
    showTiles: 'إظهار البطاقات',
    detailsBtn: 'عرض التفاصيل',
    badgeHadith: 'نص شرعي',
    badgeSituation: 'موقف نبوي',
    closeModal: 'إغلاق',
    narratorLabel: 'الراوي:',
    sourceLabel: 'المصدر:',
    gradeLabel: 'الدرجة:',
    lessonLabel: '🌿 العبرة المستفادة:',
    methodLabel: '✨ الهدي النبوي:',
  },
  en: {
    verse: '“There has certainly been for you in the Messenger of Allah an excellent pattern”',
    enterBtn: 'Enter',
    hideTiles: 'Hide Floating Tiles',
    showTiles: 'Show Floating Tiles',
    detailsBtn: 'View Details',
    badgeHadith: 'Prophetic Text',
    badgeSituation: 'Historical Context',
    closeModal: 'Close',
    narratorLabel: 'Narrator:',
    sourceLabel: 'Source:',
    gradeLabel: 'Grade:',
    lessonLabel: '🌿 Core Moral & Lesson:',
    methodLabel: '✨ Prophetic Guidance:',
  },
};

// 2. مصفوفة البطاقات الثمانية باللغتين طبقاً لشاشتك
export const FLOATING_TILES_DATA: TileData[] = [
  // 1. أعلى اليسار (Top-Left)
  {
    id: 1,
    position: 'top-left',
    accent_color: 'olive',
    size: 'lg',
    is_sharia_text: true,
    badge: { ar: 'نص شرعي', en: 'Prophetic Text' },
    title: { ar: 'الرفق في كل أمر', en: 'Gentleness in All Matters' },
    content: {
      ar: '«إن الرفق لا يكون في شيء، إلا زانه، ولا يُنزع من شيء إلا شانه»',
      en: '“Gentleness is not in anything except that it adorns it, and it is not removed from anything except that it blemishes it.”',
    },
    source_book: { ar: 'صحيح مسلم', en: 'Sahih Muslim' },
    source_ref: '2594',
    narrator: { ar: 'عائشة رضي الله عنها', en: 'Aisha (may Allah be pleased with her)' },
    grade: { ar: 'صحيح', en: 'Sahih' },
    lesson: {
      ar: 'التعامل باللين والرفق هو الأصل النبوي في سائر شؤون الحياة.',
      en: 'Gentleness and kindness are the foundational prophetic manner across all walks of life.',
    },
    prophetic_method: {
      ar: 'الهدوء واللين في مواجهة الشدة.',
      en: 'Calmness and gentleness when confronting severity.',
    },
    status: 'approved',
    sort_order: 1,
  },
  // 2. وسط اليسار (Middle-Left)
  {
    id: 2,
    position: 'mid-left',
    accent_color: 'gold',
    size: 'md',
    is_sharia_text: false,
    badge: { ar: 'موقف نبوي', en: 'Empathy & Care' },
    title: { ar: 'مواساة القلوب الحزينة', en: 'Comforting Grieving Hearts' },
    content: {
      ar: 'كان النبي ﷺ يتفقد أصحابه حتى صغارهم، وكان يمازح أبا عمير قائلاً: «يا أبا عمير، ما فعل النغير؟» تطييباً لخاطره.',
      en: "The Prophet ﷺ attentively checked on his companions, even the young ones, affectionately asking Abu Umayr: 'O Abu Umayr, what did the little bird do?' to ease his heart.",
    },
    source_book: { ar: 'صحيح البخاري ومسلم', en: 'Sahih Bukhari & Muslim' },
    source_ref: '6203',
    narrator: { ar: 'أنس بن مالك رضي الله عنه', en: 'Anas ibn Malik' },
    grade: { ar: 'متفق عليه', en: 'Muttafaq Alayh' },
    lesson: {
      ar: 'مراعاة مشاعر الآخرين، حتى في التفاصيل البسيطة، من كمال الرحمة.',
      en: 'Caring for the emotions of others, even in subtle details, is a hallmark of profound compassion.',
    },
    prophetic_method: {
      ar: 'الملاطفة والتفقد المستمر للصغير والكبير.',
      en: 'Affectionate care and constant check-ins on both young and old.',
    },
    status: 'approved',
    sort_order: 2,
  },
  // 3. أسفل اليسار العلوي (Lower-Left)
  {
    id: 3,
    position: 'bottom-left-1',
    accent_color: 'sage',
    size: 'sm',
    is_sharia_text: true,
    badge: { ar: 'نص شرعي', en: 'Prophetic Text' },
    title: { ar: 'التفاؤل والكلمة الطيبة', en: 'Optimism & Kind Words' },
    content: {
      ar: '«ويعجبني الفأل: الكلمة الحسنة، الكلمة الطيبة»',
      en: "“I admire good optimism (Al-Fa'l): the kind word, the uplifting word.”",
    },
    source_book: { ar: 'صحيح البخاري', en: 'Sahih Bukhari' },
    source_ref: '5776',
    narrator: { ar: 'أبو هريرة رضي الله عنه', en: 'Abu Hurairah' },
    grade: { ar: 'صحيح', en: 'Sahih' },
    lesson: {
      ar: 'بث الأمل وحسن الظن بالله يمنحان النفس القوة والصبر.',
      en: 'Instilling hope and having good faith in Allah grants the soul resilience and perseverance.',
    },
    prophetic_method: {
      ar: 'اختيار الكلمة الطيبة والبشارة بالخير.',
      en: 'Selecting uplifting words and spreading good tidings.',
    },
    status: 'approved',
    sort_order: 3,
  },
  // 4. أقصى أسفل اليسار (Bottom-Left)
  {
    id: 4,
    position: 'bottom-left-2',
    accent_color: 'sand',
    size: 'md',
    is_sharia_text: true,
    badge: { ar: 'نص شرعي', en: 'Prophetic Text' },
    title: { ar: 'الصبر عند الصدمة الأولى', en: 'Patience at the First Shock' },
    content: {
      ar: '«إنما الصبر عند الصدمة الأولى»',
      en: '“True patience is only at the very first onset of adversity.”',
    },
    source_book: { ar: 'صحيح البخاري', en: 'Sahih Bukhari' },
    source_ref: '1283',
    narrator: { ar: 'أنس بن مالك رضي الله عنه', en: 'Anas ibn Malik' },
    grade: { ar: 'متفق عليه', en: 'Muttafaq Alayh' },
    lesson: {
      ar: 'أعظم درجات الصبر والاحتساب تكون في اللحظات الأولى لوقوع البلاء.',
      en: 'The highest virtue of patience is demonstrated in the initial moments of distress.',
    },
    prophetic_method: {
      ar: 'التذكير الهادئ والتفهم لحالة المصاب دون تعنيف.',
      en: 'Gentle reminder and deep empathy for the grieving person without reproach.',
    },
    status: 'approved',
    sort_order: 4,
  },
  // 5. أعلى اليمين (Top-Right)
  {
    id: 5,
    position: 'top-right',
    accent_color: 'clay',
    size: 'lg',
    is_sharia_text: false,
    badge: { ar: 'موقف نبوي', en: 'Noble Character' },
    title: { ar: 'العفو عند المقدرة', en: 'Forgiveness in Triumph' },
    content: {
      ar: 'حين تمكن النبي ﷺ من أهل مكة بعد سنوات من الأذى والإخراج، قال لهم: «اذهبوا فأنتم الطلقاء».',
      en: "When the Prophet ﷺ gained triumph over Makkah after years of harm and exile, he announced to them magnanimously: 'Go, for you are completely free.'",
    },
    source_book: { ar: 'سيرة ابن هشام', en: "Ibn Hisham's Seerah" },
    source_ref: 'ج 9 ص 118',
    narrator: { ar: 'إطلاق عام', en: 'General Historical Account' },
    grade: { ar: 'حسن بشواهده', en: 'Hasan with corroborating reports' },
    lesson: {
      ar: 'الصفح والتجاوز يعلي من شأن الإنسان ويؤلف القلوب.',
      en: 'Pardoning and rising above hostility elevates human dignity and reconciles hearts.',
    },
    prophetic_method: {
      ar: 'استبدال الانتقام بالعفو والمغفرة ونبذ التشفي.',
      en: 'Replacing vengeance with magnanimous pardon.',
    },
    status: 'approved',
    sort_order: 5,
  },
  // 6. وسط اليمين العلوي (Mid-Right)
  {
    id: 6,
    position: 'mid-right-1',
    accent_color: 'gold',
    size: 'sm',
    is_sharia_text: true,
    badge: { ar: 'نص شرعي', en: 'Prophetic Text' },
    title: { ar: 'الأمر باليسر والتبشير', en: 'Ease & Glad Tidings' },
    content: {
      ar: '«يسروا ولا تعسروا، وبشروا ولا تنفروا»',
      en: '“Facilitate matters and do not make them difficult, bring glad tidings and do not repel people.”',
    },
    source_book: { ar: 'صحيح البخاري ومسلم', en: 'Sahih Bukhari & Muslim' },
    source_ref: '69',
    narrator: { ar: 'أنس بن مالك رضي الله عنه', en: 'Anas ibn Malik' },
    grade: { ar: 'متفق عليه', en: 'Muttafaq Alayh' },
    lesson: {
      ar: 'المنهج النبوي قائم على التيسير والتخفيف ومراعاة طاقات الناس.',
      en: 'The prophetic methodology is anchored in ease, leniency, and mindful awareness of human limits.',
    },
    prophetic_method: {
      ar: 'تقديم البشارة والرجاء على الزجر والتخويف.',
      en: 'Prioritizing glad tidings and hope over harsh rebuke.',
    },
    status: 'approved',
    sort_order: 6,
  },
  // 7. وسط اليمين السفلي (Lower-Mid-Right)
  {
    id: 7,
    position: 'mid-right-2',
    accent_color: 'olive',
    size: 'md',
    is_sharia_text: true,
    badge: { ar: 'نص شرعي', en: 'Prophetic Text' },
    title: { ar: 'قيمة العمل الدائم', en: 'Consistency in Good Deeds' },
    content: {
      ar: '«أحب الأعمال إلى الله أدومها وإن قل»',
      en: '“The deeds most beloved to Allah are those that are most consistent, even if they are small.”',
    },
    source_book: { ar: 'صحيح البخاري', en: 'Sahih Bukhari' },
    source_ref: '6464',
    narrator: { ar: 'عائشة رضي الله عنها', en: 'Aisha (may Allah be pleased with her)' },
    grade: { ar: 'متفق عليه', en: 'Muttafaq Alayh' },
    lesson: {
      ar: 'الاستمرارية في الخير تثمر أثراً ثابتاً في بناء الشخصية.',
      en: 'Consistency in benevolent action yields a lasting positive impact on character building.',
    },
    prophetic_method: {
      ar: 'التدرج وتثبيت العادات الإيجابية اليومية.',
      en: 'Gradual progression and anchoring positive daily habits.',
    },
    status: 'approved',
    sort_order: 7,
  },
  // 8. أسفل اليمين (Bottom-Right)
  {
    id: 8,
    position: 'bottom-right',
    accent_color: 'sage',
    size: 'md',
    is_sharia_text: false,
    badge: { ar: 'موقف نبوي', en: 'Compassion' },
    title: { ar: 'الرحمة بالخلق جميعاً', en: 'Universal Compassion' },
    content: {
      ar: 'دخل النبي ﷺ بستاناً فرأى جملاً يذرف دمعاً، فمسح على ذفراه فسكن، ثم عاتب صاحبه على إتعابه له.',
      en: 'The Prophet ﷺ entered an orchard and saw a camel weeping; he gently caressed it until it calmed, then reprimanded its owner for burdening and starving it.',
    },
    source_book: { ar: 'سنن أبي داود ومسند أحمد', en: 'Sunan Abi Dawud & Musnad Ahmad' },
    source_ref: '2549',
    narrator: { ar: 'عبدالله بن جعفر رضي الله عنه', en: 'Abdullah ibn Ja’far' },
    grade: { ar: 'صحيح', en: 'Sahih' },
    lesson: {
      ar: 'رحمة النبي ﷺ شملت الحيوان والطبيعة والإنسان دون استثناء.',
      en: "The Prophet's ﷺ mercy embraced animals, nature, and humanity without exception.",
    },
    prophetic_method: {
      ar: 'النهي عن الإيذاء وتحمل المسؤولية الأخلاقية.',
      en: 'Forbidding cruelty and upholding moral responsibility.',
    },
    status: 'approved',
    sort_order: 8,
  },
];

// إحداثيات المواقع الثمانية على الشاشات الكبيرة بحيث تظل الهوامش آمنة ولا تغطي المحتوى المركزي
export const POSITION_SLOTS: Record<
  string,
  { top: string; left?: string; right?: string; rotate: string; duration: string; delay: string }
> = {
  // Left side slots (always pinned to left)
  'top-left': { top: '8%', left: '3%', rotate: '-2deg', duration: '8.5s', delay: '0s' },
  'mid-left': { top: '32%', left: '4%', rotate: '1.5deg', duration: '9.5s', delay: '1.2s' },
  'bottom-left-1': { top: '56%', left: '2%', rotate: '-1deg', duration: '7.8s', delay: '2.0s' },
  'bottom-left-2': { top: '78%', left: '4.5%', rotate: '2deg', duration: '9.0s', delay: '0.8s' },

  // Right side slots (always pinned to right)
  'top-right': { top: '8%', right: '3%', rotate: '1.5deg', duration: '7.5s', delay: '0.5s' },
  'mid-right-1': { top: '32%', right: '4%', rotate: '-1.5deg', duration: '8.8s', delay: '1.8s' },
  'mid-right-2': { top: '56%', right: '2%', rotate: '2deg', duration: '9.2s', delay: '2.6s' },
  'bottom-right': { top: '78%', right: '4.5%', rotate: '-1deg', duration: '8.2s', delay: '1.4s' },
};
