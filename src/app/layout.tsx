import type { ReactNode } from "react";
import { DM_Sans, Playfair_Display, Noto_Sans_Arabic } from "next/font/google";
import { getLocale } from "next-intl/server";
import { LOCALES } from "@/lib/constants";
import "@/app/globals.css";

const RTL_LOCALES: Set<string> = new Set(
  LOCALES.filter((l) => l.dir === "rtl").map((l) => l.code),
);

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
  const dir = RTL_LOCALES.has(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${playfair.variable} ${dmSans.variable} ${notoArabic.variable}`}
    >
      <body
        className="bg-surface text-text-primary font-body antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
