import type { ReactNode } from "react";

export const metadata = { title: "أُسوة | مواقف من السيرة لتحديات حياتك" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
