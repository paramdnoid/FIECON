# UI Improvement Plan — FIECON Services Section
*Erstellt: Maerz 2026 | Basis: UI/UX Trend-Analyse (Dribbble, Godly, Awwwards, BCG, Roland Berger)*
*Letztes Review: Maerz 2026*

---

## Kontext & Ziel

Die bestehende Services-Sektion hat eine solide Grundlage (Bordeaux-Palette, Playfair Display, Hover-Interaktionen), wirkt aber strukturell wie ein generisches SaaS-Feature-Grid. Ziel ist es, das Erscheinungsbild einer **Boutique Consulting Firma** zu staerken: editorial, praezise, luftig — nicht templatehaft.

Alle Prioritaeten sind nach Aufwand und visuellem Impact geordnet.

---

## DONE — Abgeschlossene Punkte

### Prioritaet 4 (Teilweise) — Typografie: Karten-Titel
- Karten-Titel auf `text-lg sm:text-xl` angehoben (plan empfahl `text-lg` / `text-[17px]`)

### Prioritaet 6 (Teilweise) — Gradient-Text Hero
- `gradient-text-hero` wurde subtiler gemacht: `from-bordeaux-900 to-bordeaux-700` (Option B aus Plan)
- Vorher: stark kontrastierender Verlauf ueber 4 Farbstufen; jetzt: dezenter Bordeaux-Verlauf

---

## OFFEN — Verbleibende Punkte

### Prioritaet 1 — Asymmetrisches Grid-Layout

**Status:** Grid ist weiterhin `md:grid-cols-3` ohne `col-span-2` fuer die Finance-Karte.

**Empfohlene Variante — 2+1 Layout:**
```
[ Finance Card (2/3 Breite) ] [ Consulting Card (1/3 Breite) ]
[ Private Health Insurance Card (volle Breite oder 1/3 + 2/3) ]
```

**Technische Umsetzung:**
- Grid auf `md:grid-cols-3` belassen, aber `col-span-2` fuer die Finance-Karte einsetzen
- Private Krankenversicherungs-Karte: `col-span-1` oder eigene Zeile mit `col-span-3`

**Dateien:** `src/components/sections/Services.tsx` — `allCards`-Array und Grid-Container (Zeile ~232)

---

### Prioritaet 2 — Service-Karten Icon-Ueberarbeitung

**Status:** Icons verwenden weiterhin kreisfoermige Hintergruende (`w-10 h-10 rounded-full bg-bordeaux-900/5`). Wurden sogar leicht vergroessert (vorher `w-8 h-8`).

**Empfohlene Optionen:**

**Option A (Empfohlen): Icon entfernen, Akzent-Typografie verwenden**
- Icon-Div vollstaendig entfernen
- Stattdessen eine kleine, getracked uppercase Kategorie-Zeile ueber dem Titel

**Option C: Kompromiss — kleineres Icon, kein Hintergrund**
- `w-6 h-6` statt `w-10 h-10`, `bg-transparent`, `text-bordeaux-900/30`

**Dateien:** `src/components/sections/Services.tsx` — `ServiceCardContent` Komponente, `SERVICE_ICONS` Record

---

### Prioritaet 3 — Badge/Pill Redesign

**Status:** Badge verwendet weiterhin `rounded-full` mit `bg-beige-100` Fuell-Stil (pill-Optik).

**Empfohlene Optionen:**

**Option A (Empfohlen): Komma-getrennte Textzeile**
```tsx
<p className="text-[11px] tracking-wide uppercase text-bordeaux-900/50 mt-auto pt-4">
  {items.join(' · ')}
</p>
```

**Option B: Thin-Border Tags statt filled Pills**
- Klassen aendern zu `border border-bordeaux-900/20 text-bordeaux-900/60 bg-transparent rounded-sm`

**Dateien:**
- `src/components/ui/Badge.tsx` — Badge-Komponente
- `src/components/sections/Services.tsx` — `ServiceCardContent` Komponente, Zeile ~118-122

---

### Prioritaet 4 (Rest) — Typografie: Beschreibungstext

**Status:** Body-Text ist `text-sm` (14px). Plan empfiehlt `text-[12px]` oder `text-xs` fuer staerkeren Kontrast zum Titel (Faktor 1.5).

**Dateien:** `src/components/sections/Services.tsx` — `ServiceCardContent`, Zeile ~113

---

### Prioritaet 5 — Finance-Karte Hover-Akzent

**Status:** HoverCard hat kein `accentPosition` Prop. Finance-Karte verwendet identischen Hover-Akzent wie andere Karten (obere Linie), der mit dem Tab-Switcher konkurriert.

**Empfohlene Optionen:**

**Option A: Linker Akzent statt oberer fuer Finance-Karte**
- `HoverCard` Props um `accentPosition?: "top" | "left"` erweitern
- `FinanceCard` uebergibt `accentPosition="left"`

**Option B (einfacher): Akzentlinie fuer Finance-Karte deaktivieren**
- `accentBarClassName="hidden"` auf der `FinanceCard`

**Dateien:**
- `src/components/ui/HoverCard.tsx` — Props und Akzentbar-Logik
- `src/components/sections/Services.tsx` — `FinanceCard` Komponente, Zeile ~143

---

### Prioritaet 6 (Rest) — Gradient-Text: Finale Entscheidung

**Status:** Gradient wurde bereits subtiler gemacht (Option B). Offene Frage: Soll der Gradient komplett entfernt werden (Option A: solid Bordeaux)?

**Entscheidung nach Review mit Client vertagen.**

---

## Umsetzungsreihenfolge (aktualisiert)

| # | Punkt | Aufwand | Impact | Status |
|---|---|---|---|---|
| 1 | Body-Text verkleinern (P4 Rest) | 5 min | Sofort sichtbar | OFFEN |
| 2 | Badge/Pill Redesign (P3) | 20 min | Hoch | OFFEN |
| 3 | Icon-Ueberarbeitung (P2) | 30 min | Hoch | OFFEN |
| 4 | Finance Hover-Akzent (P5) | 20 min | Mittel | OFFEN |
| 5 | Grid-Layout (P1) | 60-90 min | Transformativ | OFFEN |
| 6 | Gradient-Text Entscheidung (P6 Rest) | 10 min | Kontrovers | OFFEN (Client) |

---

## Design-Prinzipien (Leitfaden fuer alle Aenderungen)

1. **Restraint over decoration** — Jedes dekorative Element muss einen Grund haben
2. **Type carries weight** — Typografie-Hierarchie ist wichtiger als Icons/Badges
3. **Air is not wasted space** — Grosszuegiges Padding und Whitespace signalisieren Premiumqualitaet
4. **Consistent rhythm** — Gleiche Abstaende, gleiche Ausrichtung ueber alle Karten
5. **Motion is the last layer** — Animationen ergaenzen, sie ersetzen keine strukturellen Entscheidungen
