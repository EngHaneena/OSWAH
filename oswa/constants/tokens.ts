/**
 * Design tokens for Oswa platform
 * الثيم الإسلامي الهادئ لمنصة «أسوة»
 */
export const COLORS = {
  olive: "#3F5233",        // زيتوني عميق
  cream: "#F6F1E3",        // كريمي دافئ
  gold: "#B89B5E",         // ذهبي خافت
  ink: "#22301B",          // حبر داكن
  inkLight: "#4A6038",     // حبر فاتح
  goldLight: "#D4B97A",    // ذهبي فاتح
  creamDark: "#EDE5CF",    // كريمي غامق
  surface: "#FDFAF2",      // سطح أبيض دافئ
  // Kids palette
  apricot: "#F4A261",
  sky: "#48CAE4",
  mint: "#52B788",
} as const;

export const FONTS = {
  brand: "var(--font-aref-ruqaa)",       // Aref Ruqaa — اسم المشروع
  quran: "var(--font-amiri)",            // Amiri — الآيات والنصوص الشرعية
  ui: "var(--font-ibm-plex-arabic)",     // IBM Plex Sans Arabic — الواجهة
  kids: "var(--font-baloo)",             // Baloo Bhaijaan 2 — ركن الأطفال
} as const;
