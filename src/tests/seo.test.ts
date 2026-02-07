import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { routing } from "@/i18n/routing";

describe("robots()", () => {
  const result = robots();

  it("allows all user agents", () => {
    expect(result.rules).toEqual(
      expect.objectContaining({ userAgent: "*" }),
    );
  });

  it("allows crawling the root path", () => {
    expect(result.rules).toEqual(
      expect.objectContaining({ allow: "/" }),
    );
  });

  it("points to the sitemap URL", () => {
    expect(result.sitemap).toBe(
      "https://www.fiecon-consulting.eu/sitemap.xml",
    );
  });
});

describe("sitemap()", () => {
  const result = sitemap();
  const localeCount = routing.locales.length;

  it("returns entries for all locales × 3 pages", () => {
    expect(result).toHaveLength(localeCount * 3);
  });

  it("includes homepage for every locale with priority 1", () => {
    const homepages = result.filter((e) => e.priority === 1);
    expect(homepages).toHaveLength(localeCount);
    for (const locale of routing.locales) {
      expect(homepages.find((e) => e.url === `https://www.fiecon-consulting.eu/${locale}`)).toBeDefined();
    }
  });

  it("includes impressum for every locale with low priority", () => {
    const impressumEntries = result.filter((e) =>
      e.url.endsWith("/impressum"),
    );
    expect(impressumEntries).toHaveLength(localeCount);
    expect(impressumEntries[0].priority).toBe(0.3);
    expect(impressumEntries[0].changeFrequency).toBe("yearly");
  });

  it("includes datenschutz for every locale with low priority", () => {
    const datenschutzEntries = result.filter((e) =>
      e.url.endsWith("/datenschutz"),
    );
    expect(datenschutzEntries).toHaveLength(localeCount);
    expect(datenschutzEntries[0].priority).toBe(0.3);
    expect(datenschutzEntries[0].changeFrequency).toBe("yearly");
  });

  it("includes lastModified as Date on all entries", () => {
    for (const entry of result) {
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });
});
