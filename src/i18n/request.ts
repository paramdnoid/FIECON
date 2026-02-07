import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { routing } from "./routing";

type Locale = (typeof routing.locales)[number];

function isValidLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

/** Map Accept-Language codes to supported locales */
const ACCEPT_LANG_MAP: Record<string, Locale> = {
  de: "de",
  en: "en",
  tr: "tr",
  ar: "ar",
  pl: "pl",
  ru: "ru",
  sr: "sr-Latn",
  hu: "hu",
  bs: "bs",
  hr: "hr",
  es: "es",
};

function detectFromAcceptLanguage(header: string): Locale | undefined {
  const parts = header.split(",");
  const candidates: { locale: Locale; quality: number }[] = [];

  for (const part of parts) {
    const [langTag, qPart] = part.trim().split(";");
    const quality = qPart ? parseFloat(qPart.replace("q=", "")) : 1;
    const code = langTag.trim().split("-")[0].toLowerCase();

    const mapped = ACCEPT_LANG_MAP[code];
    if (mapped) {
      candidates.push({ locale: mapped, quality });
    }
  }

  candidates.sort((a, b) => b.quality - a.quality);
  return candidates[0]?.locale;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // 1. Try requestLocale from middleware
  let locale = await requestLocale;

  // 2. If not set, read from NEXT_LOCALE cookie
  if (!locale || !isValidLocale(locale)) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    if (cookieLocale && isValidLocale(cookieLocale)) {
      locale = cookieLocale;
    }
  }

  // 3. If still not set, detect from Accept-Language header
  if (!locale || !isValidLocale(locale)) {
    const headerStore = await headers();
    const acceptLang = headerStore.get("accept-language") || "";
    const detected = detectFromAcceptLanguage(acceptLang);
    if (detected) {
      locale = detected;
    }
  }

  // 4. Final fallback
  if (!locale || !isValidLocale(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
