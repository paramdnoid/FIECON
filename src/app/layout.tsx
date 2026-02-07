import type { ReactNode } from "react";
import { DM_Sans, Playfair_Display, Noto_Sans_Arabic } from "next/font/google";
import { getLocale } from "next-intl/server";
import "@/app/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  weight: ["400", "500"],
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${playfair.variable} ${dmSans.variable} ${notoArabic.variable}`}
    >
      <body className="bg-surface text-text-primary font-body antialiased">
        {children}
      </body>
    </html>
  );
}
