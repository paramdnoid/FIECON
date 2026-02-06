import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // 1. Try requestLocale from middleware
  let locale = await requestLocale;

  // 2. If not set, read from NEXT_LOCALE cookie
  if (!locale || !routing.locales.includes(locale as "de" | "en")) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    if (cookieLocale && routing.locales.includes(cookieLocale as "de" | "en")) {
      locale = cookieLocale;
    }
  }

  // 3. If still not set, detect from Accept-Language header
  if (!locale || !routing.locales.includes(locale as "de" | "en")) {
    const headerStore = await headers();
    const acceptLang = headerStore.get("accept-language") || "";
    locale = acceptLang.toLowerCase().includes("en") ? "en" : "de";
  }

  // 4. Final fallback
  if (!routing.locales.includes(locale as "de" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
