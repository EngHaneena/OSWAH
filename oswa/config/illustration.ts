/**
 * إعدادات رسم الصحابة والتصوير البصري
 * القاعدة: لا يُصوَّر النبي ﷺ بأي شكل بشري.
 * الصحابة: يُرسمون من الخلف فقط في هذه المرحلة.
 */

/**
 * وضع رسم الصحابة — قابل للتبديل بإعداد واحد مستقبلاً.
 * القيمة الحالية: "back_only" (من الخلف فقط، بدون وجوه).
 */
export const COMPANION_RENDER_MODE = "back_only" as const;

export type CompanionRenderMode = typeof COMPANION_RENDER_MODE;

/**
 * رمز النبي ﷺ في الرسوم: نور مشرق فقط.
 * لا يُرسم أي شكل بشري أو ظل أو ملامح.
 */
export const PROPHET_SYMBOL = "radial_glow" as const;
