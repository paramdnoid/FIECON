import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://www.fiecon-consulting.eu";

const pages = [
  { path: "", changeFrequency: "monthly" as const, priority: 1 },
  { path: "/impressum", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/datenschutz", changeFrequency: "yearly" as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return pages.flatMap(({ path, changeFrequency, priority }) =>
    routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
  );
}
