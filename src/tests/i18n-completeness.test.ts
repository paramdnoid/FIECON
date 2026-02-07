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

// ---------------------------------------------------------------------------
// Helper: collect all leaf [keyPath, value] pairs
// ---------------------------------------------------------------------------
function getLeafValues(
  obj: Record<string, unknown>,
  prefix = "",
): [string, string][] {
  const pairs: [string, string][] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      pairs.push(
        ...getLeafValues(value as Record<string, unknown>, path),
      );
    } else if (typeof value === "string") {
      pairs.push([path, value]);
    }
  }
  return pairs;
}

function extractPlaceholders(value: string): string[] {
  return [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
}

const referenceMessages = loadMessages(referenceLocale);
const referenceLeaves = getLeafValues(referenceMessages);

describe("i18n translation quality", () => {
  for (const locale of locales) {
    it(`${locale}.json should have no empty string values`, () => {
      const leaves = getLeafValues(loadMessages(locale));
      const emptyKeys = leaves
        .filter(([, value]) => value === "")
        .map(([key]) => key);

      expect(emptyKeys, `Empty values in ${locale}`).toEqual([]);
    });
  }

  for (const locale of locales) {
    if (locale === referenceLocale) continue;

    it(`${locale}.json should have matching placeholders for all keys`, () => {
      const localeMessages = loadMessages(locale);
      const localeLeaves = getLeafValues(localeMessages);
      const localeMap = new Map(localeLeaves);
      const mismatches: string[] = [];

      for (const [key, refValue] of referenceLeaves) {
        const localeValue = localeMap.get(key);
        if (localeValue === undefined) continue; // missing key caught by other test

        const refPlaceholders = extractPlaceholders(refValue);
        const localePlaceholders = extractPlaceholders(localeValue);

        if (JSON.stringify(refPlaceholders) !== JSON.stringify(localePlaceholders)) {
          mismatches.push(
            `${key}: expected {${refPlaceholders.join(", ")}} but got {${localePlaceholders.join(", ")}}`,
          );
        }
      }

      expect(mismatches, `Placeholder mismatches in ${locale}`).toEqual([]);
    });
  }

  for (const locale of locales) {
    it(`${locale}.json should have no leading/trailing whitespace in values`, () => {
      const leaves = getLeafValues(loadMessages(locale));
      const badKeys = leaves
        .filter(([, value]) => value !== value.trim())
        .map(([key]) => key);

      expect(badKeys, `Untrimmed values in ${locale}`).toEqual([]);
    });
  }
});
