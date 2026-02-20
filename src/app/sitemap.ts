import type { MetadataRoute } from "next";
import { BASE_URL, TEAM_MEMBERS } from "@/lib/constants";
import { routing } from "@/i18n/routing";

type Page = {
  path: string;
  changeFrequency: "monthly" | "yearly";
  priority: number;
  lastModified?: Date;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const legalDate = new Date("2026-02-06");

  const pages: Page[] = [
    { path: "", changeFrequency: "monthly", priority: 1 },
    ...TEAM_MEMBERS.map((m) => ({
      path: `/team/${m.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { path: "/impressum", changeFrequency: "yearly", priority: 0.3, lastModified: legalDate },
    { path: "/datenschutz", changeFrequency: "yearly", priority: 0.3, lastModified: legalDate },
  ];

  return pages.flatMap(({ path, changeFrequency, priority, lastModified }) =>
    routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: lastModified ?? now,
      changeFrequency,
      priority,
    })),
  );
}
