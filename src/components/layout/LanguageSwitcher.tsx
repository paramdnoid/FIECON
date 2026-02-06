"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const switchLocale = () => {
    const nextLocale = locale === "de" ? "en" : "de";
    document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000;SameSite=Lax`;
    window.location.reload();
  };

  return (
    <button
      onClick={switchLocale}
      className="px-3 py-1.5 text-sm font-medium text-bordeaux-900 border border-border rounded-md hover:bg-beige-200/50 transition-colors cursor-pointer"
      aria-label={locale === "de" ? "Switch to English" : "Auf Deutsch wechseln"}
    >
      {locale === "de" ? "EN" : "DE"}
    </button>
  );
}
