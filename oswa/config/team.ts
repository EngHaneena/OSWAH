export interface TeamMember {
  name: { ar: string; en: string };
  role: { ar: string; en: string };
  linkedin?: string;
  github?: string;
}

export const team: TeamMember[] = [
  {
    name: { ar: "حنين هيثم القصير", en: "Haneen Haitham Al-Qassir" },
    role: { ar: "قائدة الفريق — مطوّرة تقنية وذكاء اصطناعي", en: "Team Lead — Tech & AI Developer" },
    linkedin: "https://www.linkedin.com/in/haneen-al-qassir-b68aa4387",
    github: "https://github.com/EngHaneena",
  },
  {
    name: { ar: "غلا محمد الرشيدي", en: "Ghala Mohammed Al-Rashidi" },
    role: { ar: "مطوّرة ذكاء اصطناعي", en: "AI Developer" },
    linkedin: "https://www.linkedin.com/in/ghala-mohammed-6aa374435/",
  },
  {
    name: { ar: "أثير شعيفان الحربي", en: "Atheer Shaifan Al-Harbi" },
    role: { ar: "مطوّرة واجهات وتطبيقات", en: "Frontend & Applications Developer" },
    linkedin: "https://www.linkedin.com/in/%F0%9D%92%9C%F0%9D%93%89%F0%9D%92%BD%F0%9D%91%92%F0%9D%91%92%F0%9D%93%87-%F0%9D%92%9C%F0%9D%93%81-%E2%84%8B%F0%9D%92%B6%F0%9D%93%87%F0%9D%92%B7%F0%9D%92%BE-468030384/",
    github: "https://github.com/engatheer01",
  },
  {
    name: { ar: "نوف تركي التركي", en: "Nouf Turki Al-Turki" },
    role: { ar: "مصمّمة تجربة المستخدم", en: "UX Designer" },
  },
  {
    name: { ar: "الماس المشيقح", en: "Almas Al-Mushayqih" },
    role: { ar: "متخصصة شرعية ومراجِعة علمية", en: "Sharia Specialist & Scholarly Reviewer" },
  },
];

export const projectRepo: string = ""; // يضاف لاحقاً، ولا يُعرض الزر إن كان فارغاً
export const challengeUrl = "https://islamicaich.org/";
