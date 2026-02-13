#!/usr/bin/env node

/**
 * check-translations.js
 *
 * Validates that all locale JSON files in src/messages/ are complete and
 * consistent with the reference locale (de.json).
 *
 * Checks performed:
 *  1. Every locale defined in src/i18n/routing.ts has a matching JSON file
 *  2. Every JSON file has the same key structure as de.json (no missing / extra keys)
 *  3. No empty string values
 *  4. No untranslated German text left in non-DE locales
 *
 * Exit code 0 = all checks passed, 1 = issues found.
 */

const fs = require("fs");
const path = require("path");

const MESSAGES_DIR = path.resolve(__dirname, "..", "src", "messages");
const ROUTING_FILE = path.resolve(__dirname, "..", "src", "i18n", "routing.ts");

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Recursively collect all leaf-key paths from a nested object. */
function getKeys(obj, prefix = "") {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      // Treat objects with only numeric keys (e.g. items: {"0": …, "1": …}) as leaves
      const subKeys = Object.keys(v);
      if (subKeys.length > 0 && subKeys.every((s) => /^\d+$/.test(s))) {
        keys.push(key);
      } else {
        keys.push(...getKeys(v, key));
      }
    } else {
      keys.push(key);
    }
  }
  return keys;
}

/** Recursively collect all string values with their key paths. */
function getStringValues(obj, prefix = "") {
  const result = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") {
      result.push({ key, value: v });
    } else if (v && typeof v === "object" && !Array.isArray(v)) {
      result.push(...getStringValues(v, key));
    }
  }
  return result;
}

/** Extract the locales array from routing.ts without importing it. */
function parseLocalesFromRouting() {
  const content = fs.readFileSync(ROUTING_FILE, "utf8");
  const match = content.match(/locales:\s*\[([\s\S]*?)\]/);
  if (!match) {
    console.error("ERROR: Could not parse locales from routing.ts");
    process.exit(2);
  }
  return match[1].match(/["']([^"']+)["']/g).map((s) => s.replace(/["']/g, ""));
}

// ── Proper nouns / international terms that are legitimately identical to DE ─

const ALLOWED_IDENTICAL = [
  "Fiegler Consulting",
  "Hamburg",
  "Texas",
  "USA",
  "Peter Fiegler",
  "Navigation",
  "Name",
  "Homepage",
  "FIECON",
  "Germany",
  "E-Mail",
  "SMTP",
  "NEXT_LOCALE",
  "Cookies",
  "6. Cookies",
];

/** German phrases that should never appear in non-DE translations. */
const GERMAN_INDICATORS = [
  "Springe zum",
  "Zum Inhalt springen",
  "Menü öffnen",
  "Menü schließen",
  "Unsere Leistungen",
  "Kontakt aufnehmen",
  "Über uns",
  "Erneut versuchen",
  "Wird gesendet",
  "Nachricht senden",
  "Pflichtfeld",
  "Ungültige E-Mail",
  "Alle Rechte vorbehalten",
  "Bitte versuchen Sie",
  "Angaben gemäß",
  "Haftungsausschluss",
  "Verantwortlich für den Inhalt",
  "Haftung für Inhalte",
  "Haftung für Links",
  "Urheberrecht",
  "Die Inhalte unserer Seiten",
  "Wir nehmen den Schutz",
];

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const locales = parseLocalesFromRouting();
  const files = fs
    .readdirSync(MESSAGES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));

  const de = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, "de.json"), "utf8"));
  const refKeys = getKeys(de).sort();
  const deStringMap = Object.fromEntries(
    getStringValues(de).map(({ key, value }) => [key, value])
  );

  let hasErrors = false;

  // ── Check 1: Missing / extra locale files ──────────────────────────────

  const missingFiles = locales.filter((l) => !files.includes(l));
  const extraFiles = files.filter((f) => !locales.includes(f));

  if (missingFiles.length) {
    hasErrors = true;
    console.error(`\n❌ Missing translation files for locales: ${missingFiles.join(", ")}`);
  }
  if (extraFiles.length) {
    console.warn(`\n⚠️  Extra translation files (not in routing): ${extraFiles.join(", ")}`);
  }

  // ── Check 2–4: Per-locale validation ───────────────────────────────────

  for (const locale of locales) {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    if (!fs.existsSync(filePath)) continue;

    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      hasErrors = true;
      console.error(`\n❌ ${locale}.json: Invalid JSON — ${e.message}`);
      continue;
    }

    const keys = getKeys(data).sort();

    // Check 2: Key structure
    const missing = refKeys.filter((k) => !keys.includes(k));
    const extra = keys.filter((k) => !refKeys.includes(k));

    if (missing.length) {
      hasErrors = true;
      console.error(`\n❌ ${locale}.json: ${missing.length} missing key(s):`);
      missing.forEach((k) => console.error(`   - ${k}`));
    }
    if (extra.length) {
      console.warn(`\n⚠️  ${locale}.json: ${extra.length} extra key(s):`);
      extra.forEach((k) => console.warn(`   - ${k}`));
    }

    // Check 3: Empty strings
    const emptyKeys = [];
    const strings = getStringValues(data);
    for (const { key, value } of strings) {
      if (value.trim() === "") emptyKeys.push(key);
    }
    if (emptyKeys.length) {
      hasErrors = true;
      console.error(`\n❌ ${locale}.json: ${emptyKeys.length} empty value(s):`);
      emptyKeys.forEach((k) => console.error(`   - ${k}`));
    }

    // Check 4: Untranslated German text (skip DE itself and Niederdeutsch nds)
    if (locale !== "de" && locale !== "nds") {
      const untranslated = [];
      for (const { key, value } of strings) {
        // Check for known German phrases
        for (const phrase of GERMAN_INDICATORS) {
          if (value.includes(phrase)) {
            untranslated.push({ key, reason: `contains German phrase "${phrase}"` });
            break;
          }
        }
      }
      if (untranslated.length) {
        hasErrors = true;
        console.error(
          `\n❌ ${locale}.json: ${untranslated.length} potentially untranslated string(s):`
        );
        untranslated.forEach(({ key, reason }) => console.error(`   - ${key}: ${reason}`));
      }
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────

  console.log("\n" + "─".repeat(60));
  console.log(
    `  Locales: ${locales.length} | Reference keys: ${refKeys.length} | Files: ${files.length}`
  );

  if (hasErrors) {
    console.error("  Result: FAIL — issues found (see above)\n");
    process.exit(1);
  } else {
    console.log("  Result: PASS — all translations complete and consistent\n");
    process.exit(0);
  }
}

main();
