import type { Metadata } from "next";
import { Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LanguageProvider } from "@/lib/i18n";
import TopNav from "@/components/layout/TopNav";
import SiteFooter from "@/components/layout/SiteFooter";
import BackgroundOrnaments from "@/components/ornaments/BackgroundOrnaments";

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
    title: "أسوة — اقتداءً بالنبي ﷺ",
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
      suppressHydrationWarning
      className={`${amiri.variable} ${ibmPlexArabic.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Baloo+Bhaijaan+2:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--color-cream)] text-[var(--color-ink)] font-[--font-ibm-plex-arabic] antialiased min-h-screen flex flex-col relative selection:bg-[var(--color-gold)]/30">
        <ThemeProvider>
          <LanguageProvider>
            <BackgroundOrnaments />
            <TopNav />
            <div className="flex-1 w-full relative z-10">
              {children}
            </div>
            <SiteFooter />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
