import type { Metadata } from "next";
import { Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

// خطوط المشروع — next/font
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "أسوة — اقتداءً بالنبي ﷺ",
  description:
    "منصة تعرض مواقف من السيرة النبوية الشريفة تناسب ما تمر به، من قاعدة بيانات موثقة ومراجعة شرعية.",
  keywords: ["سيرة نبوية", "إسلام", "تعاطف", "عظة", "أسوة"],
  openGraph: {
    title: "أسوة",
    description: "اقتداءً بالنبي ﷺ في كل أحوالنا",
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${ibmPlexArabic.variable}`}
    >
      <head>
        {/* Aref Ruqaa for brand name — loaded via link for now */}
        <link
          href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Baloo+Bhaijaan+2:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F6F1E3] text-[#22301B] font-[--font-ibm-plex-arabic] antialiased">
        {children}
      </body>
    </html>
  );
}
