/**
 * مصنّف سلامة المدخلات
 * يصنّف المدخل قبل أي بحث أو توليد
 */

export type SafetyCategory =
  | 'crisis'          // أزمة نفسية / إيذاء النفس
  | 'personal_ruling' // طلب فتوى أو حكم شرعي شخصي
  | 'hostile'         // نبرة عدائية
  | 'safe';           // آمن للمعالجة

export interface SafetyResult {
  category: SafetyCategory;
  confidence: number;
  reason?: string;
}

// كلمات مفتاحية لكل فئة — تُراجع وتُوسَّع قبل الإطلاق
const CRISIS_KEYWORDS = [
  'انتحار', 'أنتحر', 'أقتل نفسي', 'إيذاء النفس', 'أذية نفسي',
  'لا أريد العيش', 'لا أريد الحياة', 'أريد الموت', 'suicide',
  'self harm', 'kill myself', 'hurt myself',
  'نهاية حياتي', 'أنهي حياتي'
];

const PERSONAL_RULING_KEYWORDS = [
  'طلاق', 'خلع', 'ميراث', 'إرث', 'عقد زواج',
  'نزاع أسري', 'فتوى', 'حلال', 'حرام', 'يجوز',
  'نفقة', 'حضانة', 'مهر', 'زواج عرفي', 'شرعي من',
  'هل يجوز لي', 'ما حكم', 'ما حكم الشرع'
];

const HOSTILE_PATTERNS = [
  /أنتم كذابون/i, /دين باطل/i, /محمد كذاب/i,
  /إسلام إرهاب/i, /الله غير موجود/i,
];

export function classifyInput(text: string): SafetyResult {
  const normalized = text.trim().toLowerCase();

  // فحص أزمة نفسية
  for (const kw of CRISIS_KEYWORDS) {
    if (normalized.includes(kw.toLowerCase())) {
      return { category: 'crisis', confidence: 0.95, reason: kw };
    }
  }

  // فحص طلب حكم شرعي شخصي
  let rulingCount = 0;
  for (const kw of PERSONAL_RULING_KEYWORDS) {
    if (normalized.includes(kw.toLowerCase())) rulingCount++;
  }
  if (rulingCount >= 2) {
    return { category: 'personal_ruling', confidence: 0.85, reason: 'multiple_ruling_keywords' };
  }

  // فحص نبرة عدائية
  for (const pattern of HOSTILE_PATTERNS) {
    if (pattern.test(text)) {
      return { category: 'hostile', confidence: 0.9 };
    }
  }

  return { category: 'safe', confidence: 1.0 };
}
