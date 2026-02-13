import type { ReactNode } from "react";
import { Suspense } from "react";
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
  fr: "fr_FR",
  it: "it_IT",
  es: "es_ES",
  pt: "pt_PT",
  nl: "nl_NL",
  lb: "de_LU",
  ca: "ca_ES",
  gl: "gl_ES",
  eu: "eu_ES",
  cy: "cy_GB",
  ga: "ga_IE",
  is: "is_IS",
  sv: "sv_SE",
  no: "nb_NO",
  da: "da_DK",
  fi: "fi_FI",
  et: "et_EE",
  lv: "lv_LV",
  lt: "lt_LT",
  pl: "pl_PL",
  cs: "cs_CZ",
  sk: "sk_SK",
  hu: "hu_HU",
  ro: "ro_RO",
  sl: "sl_SI",
  hr: "hr_HR",
  bs: "bs_BA",
  "sr-Cyrl": "sr_RS",
  "sr-Latn": "sr_RS",
  mk: "mk_MK",
  sq: "sq_AL",
  mt: "mt_MT",
  el: "el_GR",
  bg: "bg_BG",
  ru: "ru_RU",
  uk: "uk_UA",
  be: "be_BY",
  ka: "ka_GE",
  tr: "tr_TR",
  ar: "ar_SA",
  rom: "de_DE",
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
    languages[l.code] = `/${l.code}`;
  }

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://www.fiecon-consulting.eu"),
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://www.fiecon-consulting.eu",
      siteName: "FIECON",
      locale: OG_LOCALE_MAP[locale] || "de_DE",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "FIECON — Internationale Beratung",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.png"],
    },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
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
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-bordeaux-900 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        {tNav("skip_to_content")}
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: COMPANY.fullName,
            alternateName: COMPANY.name,
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
            contactPoint: {
              "@type": "ContactPoint",
              telephone: CONTACT.phone,
              email: CONTACT.email,
              contactType: "customer service",
              availableLanguage: ["de", "en", "sr"],
            },
          }),
        }}
      />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Header />
        <main id="main">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
        <Footer />
      </NextIntlClientProvider>
    </>
  );
}
