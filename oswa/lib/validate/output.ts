/**
 * طبقة التحقق من مخرجات النموذج
 * تتحقق برمجياً من القواعد — لا يُكتفى بتعليمات النموذج
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// أنماط محظورة في المخرجات المولَّدة
const FORBIDDEN_PATTERNS = [
  // أرقام أحاديث
  /\d{3,}\s*(هـ|م)?\/\s*\d{1,3}/,
  /رقم\s*:?\s*\d+/i,
  /حديث\s*رقم\s*\d+/i,
  // اقتباسات نصوص شرعية
  /﴿.*?﴾/s,
  /«.*?»/s,
  // ألفاظ حكم شرعي
  /\bحرام\b/,
  /\bحلال\b/,
  /\bيجب شرعاً\b/,
  /\bفتوى\b/,
  /\bفريضة\b/,
  /\bواجب شرعي\b/,
  // أسماء كتب حديث محددة
  /\bصحيح البخاري\b/,
  /\bصحيح مسلم\b/,
  /\bسنن أبي داود\b/,
  /\bسنن الترمذي\b/,
];

const MAX_LENGTHS = {
  empathy_intro: 400,
  lesson_rephrase: 600,
  practical_step: 400,
};

export function validateGeneratedOutput(
  output: {
    selected_id: string | null;
    empathy_intro: string;
    lesson_rephrase: string;
    practical_step: string;
  },
  allowedIds: string[]
): ValidationResult {
  const errors: string[] = [];

  // التحقق من selected_id
  if (output.selected_id !== null && !allowedIds.includes(output.selected_id)) {
    errors.push(`selected_id "${output.selected_id}" غير موجود في المرجعين المسموحين`);
  }

  // التحقق من الأنماط المحظورة
  const textFields = [
    output.empathy_intro,
    output.lesson_rephrase,
    output.practical_step,
  ];

  for (const text of textFields) {
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(text)) {
        errors.push(`النص يحتوي نمطاً محظوراً: ${pattern}`);
      }
    }
  }

  // التحقق من الحدود الطولية
  if (output.empathy_intro.length > MAX_LENGTHS.empathy_intro) {
    errors.push(`empathy_intro أطول من ${MAX_LENGTHS.empathy_intro} حرف`);
  }
  if (output.lesson_rephrase.length > MAX_LENGTHS.lesson_rephrase) {
    errors.push(`lesson_rephrase أطول من ${MAX_LENGTHS.lesson_rephrase} حرف`);
  }
  if (output.practical_step.length > MAX_LENGTHS.practical_step) {
    errors.push(`practical_step أطول من ${MAX_LENGTHS.practical_step} حرف`);
  }

  return { valid: errors.length === 0, errors };
}
