import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const MESSAGES_DIR = join(__dirname, "../messages");

/** Recursively collect all leaf key paths from a nested object. */
function getKeyPaths(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys.push(...getKeyPaths(value as Record<string, unknown>, path));
    } else {
      keys.push(path);
    }
  }
  return keys.sort();
}

function loadMessages(locale: string): Record<string, unknown> {
  const raw = readFileSync(join(MESSAGES_DIR, `${locale}.json`), "utf-8");
  return JSON.parse(raw);
}

const files = readdirSync(MESSAGES_DIR).filter((f) => f.endsWith(".json"));
const locales = files.map((f) => f.replace(".json", ""));

// Use German (default) as the reference
const referenceLocale = "de";
const referenceKeys = getKeyPaths(loadMessages(referenceLocale));

describe("i18n translation completeness", () => {
  it("should have at least 2 locale files", () => {
    expect(locales.length).toBeGreaterThanOrEqual(2);
  });

  it("reference locale (de) should have keys", () => {
    expect(referenceKeys.length).toBeGreaterThan(0);
  });

  for (const locale of locales) {
    if (locale === referenceLocale) continue;

    it(`${locale}.json should have the same keys as ${referenceLocale}.json`, () => {
      const keys = getKeyPaths(loadMessages(locale));

      const missingKeys = referenceKeys.filter((k) => !keys.includes(k));
      const extraKeys = keys.filter((k) => !referenceKeys.includes(k));

      expect(missingKeys, `Missing keys in ${locale}`).toEqual([]);
      expect(extraKeys, `Extra keys in ${locale}`).toEqual([]);
    });
  }
});
