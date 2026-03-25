#!/usr/bin/env node
/**
 * Ein durchgängiger Schritt: Alle Locales (außer de) so füllen, dass keine
 * Strings mehr 1:1 dem Deutschen entsprechen — außer bewusst erhaltene
 * Marken-, Orts- und Abkürzungswerte.
 *
 * Quelle pro String: Wenn en.json für denselben Schlüssel vom Deutschen
 * abweicht, wird aus dem Englischen übersetzt, sonst aus dem Deutschen.
 *
 * nds: Google unterstützt Plattdeutsch nicht zuverlässig. Standard:
 * TRANSLATE_NDS_VIA (Fallback nl) — per Umgebung überschreibbar.
 *
 * Usage:
 *   pnpm i18n:sync-all
 *   PLACEHOLDER_LOCALE=bg pnpm translate:placeholders
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { translate } from "google-translate-api-x";

const require = createRequire(import.meta.url);
const { toLatin } = require("serbian-transliteration");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MESSAGES_DIR = path.join(ROOT, "src/messages");
const ROUTING_FILE = path.join(ROOT, "src/i18n", "routing.ts");

const MIN_DELAY_MS = Number(process.env.TRANSLATE_DELAY_MS ?? 350);
const SINGLE_LOCALE = process.env.PLACEHOLDER_LOCALE?.trim();
const CACHE_FILE = path.join(__dirname, ".translate-placeholder-cache.v2.json");
const LEGACY_CACHE_FILE = path.join(__dirname, ".translate-placeholder-cache.json");
const NDS_GOOGLE_TO = process.env.TRANSLATE_NDS_VIA?.trim() ?? "nl";

/** @type {Record<string, string>} next-intl locale → google-translate "to" code */
const LOCALE_TO_GOOGLE = {
  en: "en",
  fr: "fr",
  it: "it",
  es: "es",
  pt: "pt",
  nl: "nl",
  lb: "lb",
  ca: "ca",
  gl: "gl",
  eu: "eu",
  cy: "cy",
  ga: "ga",
  is: "is",
  sv: "sv",
  no: "no",
  da: "da",
  fi: "fi",
  et: "et",
  lv: "lv",
  lt: "lt",
  pl: "pl",
  cs: "cs",
  sk: "sk",
  hu: "hu",
  ro: "ro",
  sl: "sl",
  hr: "hr",
  bs: "bs",
  "sr-Cyrl": "sr",
  "sr-Latn": "sr",
  mk: "mk",
  sq: "sq",
  mt: "mt",
  el: "el",
  bg: "bg",
  ru: "ru",
  uk: "uk",
  be: "be",
  ka: "ka",
  tr: "tr",
  ar: "ar",
  rom: "rom",
};

const PRESERVE_EXACT = new Set([
  "FIECON Consulting",
  "FIECON",
  "Peter Fiegler",
  "René Marquard",
  "Andre Zimmermann",
  "Hamburg",
  "Texas",
  "USA",
  "Montenegro",
  "Vanuatu",
  "KWG",
  "VAG",
  "EStG",
  "SMTP",
  "NEXT_LOCALE",
  "Wealth Management",
  // Häufig in EU-Sprachen schreibgleich mit DE (Kognaten / Eigennamen)
  "Belgrad",
  "Serbien",
  "Nordamerika",
  "Südosteuropa",
  "Südpazifik",
  "Kontakt",
  "Telefon",
  "Mobil",
  "Homepage",
  "Länder",
  "6. Cookies",
]);

function parseLocalesFromRouting() {
  const content = fs.readFileSync(ROUTING_FILE, "utf8");
  const match = content.match(/locales:\s*\[([\s\S]*?)\]/);
  if (!match) throw new Error("Could not parse locales from routing.ts");
  return match[1].match(/["']([^"']+)["']/g).map((s) => s.replace(/["']/g, ""));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function shouldPreserveString(value) {
  const v = value.trim();
  if (v.length === 0) return true;
  if (PRESERVE_EXACT.has(v)) return true;
  if (PRESERVE_EXACT.has(value)) return true;
  if (/^(KWG|VAG|EStG|USA|SMTP)$/.test(v)) return true;
  return false;
}

/**
 * Map: deutscher Referenzstring → { source, from } für die Übersetzung.
 * Bei Widerspruch (gleiches Deutsch, unterschiedliche engl. Quelle) → deutsch.
 * @param {unknown} loc
 * @param {unknown} deRef
 * @param {unknown} enRef
 * @param {Map<string, { source: string, from: string }>} acc
 */
function collectTranslationSources(loc, deRef, enRef, acc) {
  if (deRef === null || typeof deRef !== "object" || Array.isArray(deRef)) return;
  if (loc === null || typeof loc !== "object" || Array.isArray(loc)) return;

  for (const key of Object.keys(deRef)) {
    const d = deRef[key];
    const l = loc[key];
    const e = enRef && typeof enRef === "object" && !Array.isArray(enRef) ? enRef[key] : undefined;

    if (typeof d === "string" && typeof l === "string" && d === l && !shouldPreserveString(d)) {
      const useEn = typeof e === "string" && e !== d;
      const source = useEn ? e : d;
      const from = useEn ? "en" : "de";

      if (!acc.has(d)) {
        acc.set(d, { source, from });
      } else {
        const prev = acc.get(d);
        if (prev.source !== source || prev.from !== from) {
          acc.set(d, { source: d, from: "de" });
        }
      }
    } else if (d && typeof d === "object" && !Array.isArray(d)) {
      const enChild =
        e && typeof e === "object" && !Array.isArray(e) ? e : undefined;
      collectTranslationSources(l, d, enChild, acc);
    }
  }
}

/**
 * @param {unknown} loc
 * @param {unknown} deRef
 * @param {Map<string, string>} dict deutsch → zieltext
 */
function applyTranslations(loc, deRef, dict) {
  if (deRef === null || typeof deRef !== "object" || Array.isArray(deRef)) return;
  if (loc === null || typeof loc !== "object" || Array.isArray(loc)) return;

  for (const key of Object.keys(deRef)) {
    const d = deRef[key];
    const l = loc[key];
    if (typeof d === "string" && typeof l === "string" && d === l && !shouldPreserveString(d)) {
      const next = dict.get(d);
      if (next !== undefined) loc[key] = next;
    } else if (d && typeof d === "object" && !Array.isArray(d)) {
      applyTranslations(l, d, dict);
    }
  }
}

/** @type {Map<string, string>} `${googleTo}::${from}::${source}` → roher MT-Text */
const rawTranslateCache = new Map();

function cacheKey(googleTo, fromLang, source) {
  return `${googleTo}::${fromLang}::${source}`;
}

function loadRawCache() {
  try {
    const raw = fs.readFileSync(CACHE_FILE, "utf8");
    const o = JSON.parse(raw);
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "string") rawTranslateCache.set(k, v);
    }
  } catch {
    /* kein v2-Cache */
  }
  try {
    const leg = fs.readFileSync(LEGACY_CACHE_FILE, "utf8");
    const o = JSON.parse(leg);
    for (const [k, v] of Object.entries(o)) {
      if (typeof v !== "string") continue;
      const idx = k.indexOf("::");
      if (idx === -1) continue;
      const googleTo = k.slice(0, idx);
      const german = k.slice(idx + 2);
      const v2k = cacheKey(googleTo, "de", german);
      if (!rawTranslateCache.has(v2k)) rawTranslateCache.set(v2k, v);
    }
  } catch {
    /* kein Legacy-Cache */
  }
}

function persistRawCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(Object.fromEntries(rawTranslateCache), null, 0), "utf8");
}

async function translateWithRetry(text, fromLang, googleTo) {
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const { text: out } = await translate(text, {
        from: fromLang,
        to: googleTo,
        forceBatch: false,
      });
      return out;
    } catch (e) {
      lastErr = e;
      const wait = 2000 * 2 ** attempt;
      console.warn(`  retry ${attempt + 1} after error: ${e.message}`);
      await sleep(wait);
    }
  }
  throw lastErr;
}

async function fillLocale(deData, enData, locale) {
  if (locale === "de") return { skipped: true, reason: "source" };

  let googleTo = LOCALE_TO_GOOGLE[locale];
  if (locale === "nds") {
    googleTo = NDS_GOOGLE_TO;
  } else if (!googleTo) {
    return { skipped: true, reason: "no-google-mapping" };
  }

  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  const locData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  /** @type {Map<string, { source: string, from: string }>} */
  const byGerman = new Map();
  collectTranslationSources(locData, deData, enData, byGerman);

  if (byGerman.size === 0) {
    return { locale, translated: 0, unique: 0 };
  }

  /** deutsch → zielsprache */
  const dict = new Map();
  let apiCalls = 0;

  for (const [german, { source, from }] of byGerman) {
    let raw;
    if (googleTo === from) {
      raw = source;
    } else {
      const key = cacheKey(googleTo, from, source);
      raw = rawTranslateCache.get(key);
      if (raw === undefined) {
        raw = await translateWithRetry(source, from, googleTo);
        rawTranslateCache.set(key, raw);
        persistRawCache();
        apiCalls++;
        await sleep(MIN_DELAY_MS);
      }
    }
    const finalText = locale === "sr-Latn" ? toLatin(raw) : raw;
    dict.set(german, finalText);
  }

  applyTranslations(locData, deData, dict);

  fs.writeFileSync(filePath, `${JSON.stringify(locData, null, 2)}\n`, "utf8");
  return { locale, translated: apiCalls, unique: byGerman.size };
}

function auditRemaining(deData, enData) {
  const locales = parseLocalesFromRouting().filter((l) => l !== "de");
  let total = 0;
  for (const locale of locales) {
    const p = path.join(MESSAGES_DIR, `${locale}.json`);
    const locData = JSON.parse(fs.readFileSync(p, "utf8"));
    const byGerman = new Map();
    collectTranslationSources(locData, deData, enData, byGerman);
    if (byGerman.size > 0) {
      console.warn(`  noch offen: ${locale} → ${byGerman.size} Strings (identisch zu DE, nicht preserve)`);
      total += byGerman.size;
    }
  }
  if (total === 0) {
    console.log("\nAudit: Keine übersetzbaren DE-Platzhalter mehr (außer bewusst erhalten).");
  } else {
    console.warn(`\nAudit: Summe noch offener DE-Platzhalter: ${total}`);
  }
}

async function main() {
  loadRawCache();
  const locales = parseLocalesFromRouting();
  const deData = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, "de.json"), "utf8"));
  const enData = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, "en.json"), "utf8"));

  const targets = SINGLE_LOCALE ? [SINGLE_LOCALE] : locales.filter((l) => l !== "de");

  console.log("── i18n: ein Schritt (alle Locales) ──");
  console.log(`Locales: ${targets.length}${SINGLE_LOCALE ? ` (nur ${SINGLE_LOCALE})` : ""}`);
  console.log(`nds-Ziel (Google): ${NDS_GOOGLE_TO} (TRANSLATE_NDS_VIA)`);
  console.log(`Cache: ${path.basename(CACHE_FILE)}\n`);

  for (const locale of targets) {
    process.stdout.write(`→ ${locale} … `);
    try {
      const r = await fillLocale(deData, enData, locale);
      if (r.skipped) {
        console.log(`skipped (${r.reason})`);
      } else {
        console.log(`fertig (${r.translated} API-Aufrufe, ${r.unique} DE-Strings)`);
      }
    } catch (e) {
      console.log(`FEHLER: ${e.message}`);
      process.exitCode = 1;
      break;
    }
  }

  if (!process.exitCode && !SINGLE_LOCALE) {
    auditRemaining(deData, enData);
  }
}

main();
