import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { COMPANY, CONTACT } from "@/lib/constants";
import "@/app/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://www.fiecon-consulting.eu"),
    alternates: {
      canonical: "/",
      languages: {
        de: "/",
        en: "/",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://www.fiecon-consulting.eu",
      siteName: "FIECON",
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-surface text-text-primary font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: COMPANY.fullName,
              url: `https://${COMPANY.website}`,
              email: CONTACT.email,
              telephone: CONTACT.phone,
              address: {
                "@type": "PostalAddress",
                streetAddress: CONTACT.address.street,
                postalCode: CONTACT.address.zip,
                addressLocality: CONTACT.address.city,
                addressCountry: CONTACT.address.country,
              },
            }),
          }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
