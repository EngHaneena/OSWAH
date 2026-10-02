/**
 * أرقام وجهات الطوارئ والدعم النفسي
 * يتحقق الفريق من الأرقام قبل الإطلاق.
 */
export const EMERGENCY_CONTACTS = [
  {
    name: "خط مساندة للصحة النفسية",
    number: "920033360",
    country: "SA",
    available: "24/7",
  },
  {
    name: "الهاتف الوطني للطوارئ",
    number: "911",
    country: "SA",
    available: "24/7",
  },
  {
    name: "مركز الأمان للدعم النفسي — الكويت",
    number: "94005050",
    country: "KW",
    available: "24/7",
  },
  {
    name: "خط نجدة — الإمارات",
    number: "800HOPE",
    country: "AE",
    available: "24/7",
  },
] as const;

export const CRISIS_MESSAGE = `
نحن معك. ما تمر به صعب، وطلبك للمساعدة شجاعة.
يُرجى التواصل فوراً مع أحد المختصين الذين يمكنهم مساعدتك.
`;
