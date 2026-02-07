import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { COMPANY, CONTACT, LOCALES } from "@/lib/constants";
import { routing } from "@/i18n/routing";

const OG_LOCALE_MAP: Record<string, string> = {
  de: "de_DE",
  en: "en_US",
  nds: "de_DE",
  tr: "tr_TR",
  ar: "ar_SA",
  pl: "pl_PL",
  ru: "ru_RU",
  "sr-Cyrl": "sr_RS",
  "sr-Latn": "sr_RS",
  hu: "hu_HU",
  bs: "bs_BA",
  hr: "hr_HR",
  rom: "de_DE",
  es: "es_ES",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l.code] = "/";
  }

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://www.fiecon-consulting.eu"),
    alternates: {
      canonical: "/",
      languages,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://www.fiecon-consulting.eu",
      siteName: "FIECON",
      locale: OG_LOCALE_MAP[locale] || "de_DE",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <>
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
    </>
  );
}
