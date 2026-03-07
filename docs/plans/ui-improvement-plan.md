# UI Improvement Plan — FIECON Services Section
*Erstellt: März 2026 | Basis: UI/UX Trend-Analyse (Dribbble, Godly, Awwwards, BCG, Roland Berger)*

---

## Kontext & Ziel

Die bestehende Services-Sektion hat eine solide Grundlage (Bordeaux-Palette, Playfair Display, Hover-Interaktionen), wirkt aber strukturell wie ein generisches SaaS-Feature-Grid. Ziel ist es, das Erscheinungsbild einer **Boutique Consulting Firma** zu stärken: editorial, präzise, luftig — nicht templatehaft.

Alle Prioritäten sind nach Aufwand und visuellem Impact geordnet.

---

## Priorität 1 — Asymmetrisches Grid-Layout (Hoch / Mittel-Hoch Aufwand)

### Problem
Das gleichmäßige `md:grid-cols-3`-Layout mit drei identisch breiten Karten wirkt generisch. Premium-Consulting-Sites (Roland Berger, BCG) verwenden bewusst asymmetrische Layouts, die Inhalte nach Relevanz gewichten.

### Lösung
Umstellung auf ein gemischtes Grid mit variierenden Kartenbreiten.

**Empfohlene Variante — 2+1 Layout:**
```
[ Finance Card (2/3 Breite) ] [ Consulting Card (1/3 Breite) ]
[ Private Health Insurance Card (volle Breite oder 1/3 + 2/3) ]
```

**Technische Umsetzung:**
- Grid auf `md:grid-cols-3` belassen, aber `col-span-2` für die Finance-Karte einsetzen
- Private Krankenversicherungs-Karte: `col-span-1` oder eigene Zeile mit `col-span-3`
- Alternativ: Zweizeiliges Layout `grid-cols-3` Zeile 1 + `grid-cols-2` Zeile 2 mittels `subgrid` oder separatem `div`

**Dateien:**
- `src/components/sections/Services.tsx` — `allCards`-Array und Grid-Container

**Zu beachten:**
- Die Finance-Karte hat den schwebenden Tab-Switcher — bei `col-span-2` bleibt die Tab-Positionierung `left-1/2 -translate-x-1/2` korrekt
- Mobile bleibt 1-spaltig (`grid-cols-1`), kein Änderungsbedarf

---

## Priorität 2 — Service-Karten Icon-Überarbeitung (Mittel / Niedrig Aufwand)

### Problem
Die kreisförmigen Bordeaux-Icon-Buttons (`w-8 h-8 rounded-full bg-bordeaux-900`) in jeder Karte wirken dekorativ-austauschbar. Premium-Consulting-Sites verzichten auf Icon-Badges in Karten oder setzen Icons subtil ein (inline, outlined, kleiner).

### Lösungsoptionen

**Option A (Empfohlen): Icon entfernen, Akzent-Typografie verwenden**
- Icon-Div vollständig entfernen
- Stattdessen eine kleine, getracked uppercase Kategorie-Zeile über dem Titel: `GESELLSCHAFTSRECHT` in `text-[10px] tracking-[0.25em] text-accent/60`
- Sauberere Typografie-Hierarchie, editorial

**Option B: Inline-Icon, outline-Stil**
- Icon-Kreis ersetzen durch ein `20x20` Icon direkt neben dem Titel (`inline-flex`)
- Kein Hintergrund, nur `text-bordeaux-900/40` — subtil
- `stroke-width="1"` für einen leichteren Look

**Option C: Kompromiss — kleineres Icon, kein Hintergrund**
- `w-6 h-6` statt `w-8 h-8`, `bg-transparent`, `text-bordeaux-900/30`
- Minimaler Eingriff, sofort umsetzbar

**Dateien:**
- `src/components/sections/Services.tsx` — `ServiceCardContent` Komponente, Zeile ~109
- `SERVICE_ICONS` Record bleibt für Option B/C erhalten, für Option A entfernbar

---

## Priorität 3 — Badge/Pill Redesign (Niedrig-Mittel Aufwand)

### Problem
Die gestapelten Pill-Badges am unteren Kartenrand (`GESELLSCHAFTSRECHT`, `INTERNATIONALE FIRMENGRÜNDUNGEN` etc.) erzeugen visuelle Unruhe und wirken wie ein Tag-Cloud aus 2020. Premium-Sites lösen Sub-Themen typografisch, nicht durch Pill-Stapelung.

### Lösung

**Option A (Empfohlen): Komma-getrennte Textzeile**
```tsx
<p className="text-[11px] tracking-wide uppercase text-bordeaux-900/50 mt-auto pt-4">
  {items.join(' · ')}
</p>
```
Ergebnis: `GESELLSCHAFTSRECHT · INTERNATIONALE FIRMENGRÜNDUNGEN`
Flacher, editorial, weniger Rauschen.

**Option B: Thin-Border Tags statt filled Pills**
- Klassen ändern von `bg-beige-50 text-bordeaux-900` zu `border border-bordeaux-900/20 text-bordeaux-900/60 bg-transparent`
- `rounded-sm` statt `rounded-full` (bereits teilweise adressiert)
- Wirkt raffinierter, behält aber die Badge-Struktur

**Option C: Horizontale Liste mit Trennlinie**
- Badges horizontal mit `·` als Trenner, kein Hintergrund, kein Border
- Einheitliche Zeile am Kartenende

**Dateien:**
- `src/components/sections/Services.tsx` — `ServiceCardContent` Komponente, Zeile ~122–134
- `ITEMS_PER_SERVICE` Record bleibt unverändert

---

## Priorität 4 — Typografie-Hierarchie schärfen (Niedrig Aufwand)

### Problem
Nach der letzten Änderung (Titel: `text-base` = 16px, Body: `text-[13px]`) ist der Größensprung zwischen Titel und Fließtext zu klein (nur 3px Differenz). Premium-Editorial-Design verlangt einen deutlichen Kontrast — typischerweise Faktor 1.4–1.6 zwischen Überschrift und Absatz.

### Lösung

**Empfohlene Werte:**
| Element | Aktuell | Neu |
|---|---|---|
| Karten-Titel (`h3`) | `text-base` (16px) | `text-lg` (18px) oder `text-[17px]` |
| Beschreibungstext (`p`) | `text-[13px]` | `text-[12px]` oder `text-xs` (12px) |
| Badge-Labels | `text-[10px]` | `text-[10px]` (belassen) |
| Kategorie-Label (neu, über Titel) | — | `text-[9px] tracking-[0.3em]` |

**Ergebnis:** 18px Titel → 12px Body = Faktor 1.5 (editorial Standard)

**Dateien:**
- `src/components/sections/Services.tsx` — `ServiceCardContent` Komponente

---

## Priorität 5 — Finance-Karte Hover-Akzent (Niedrig Aufwand)

### Problem
Die Bordeaux-Akzentlinie oben (`scale-x-0 → scale-x-100` bei Hover) konkurriert visuell mit dem schwebenden Tab-Switcher bei der Finance-Karte. Der obere Bereich der Karte ist bereits durch die Tabs besetzt.

### Lösung

**Option A (Empfohlen): Linker Akzent statt oberer für Finance-Karte**
Für `FinanceCard` einen alternativen Hover-Indikator verwenden:
- `border-l-2 border-l-transparent group-hover:border-l-bordeaux-900/40` auf dem Card-Element
- Statt der Top-Akzentlinie eine diskrete linke Border-Animation

**Technische Umsetzung:**
- `HoverCard` Props um `accentPosition?: "top" | "left"` erweitern
- Bei `"left"`: vertikale Linie links statt horizontale oben
- `FinanceCard` übergibt `accentPosition="left"`

**Option B: Akzentlinie für Finance-Karte komplett deaktivieren**
- `accentBarClassName="hidden"` auf der `FinanceCard`
- Tab-Switcher und `hover:border-beige-400/50` reichen als Hover-Feedback

**Dateien:**
- `src/components/ui/HoverCard.tsx` — Props und Akzentbar-Logik
- `src/components/sections/Services.tsx` — `FinanceCard` Komponente, Zeile ~154

---

## Priorität 6 — Gradient-Text Hero überprüfen (Niedrig Aufwand / Entscheidung)

### Problem
Gradient-Text auf großen Display-Headings (`gradient-text-hero`) war 2022–2024 ein weit verbreiteter Trend und ist jetzt stark überrepräsentiert auf Mid-Tier-Sites. Premium-Consulting-Sites (Roland Berger, BCG) verwenden **keinen** Gradient-Text.

### Optionen

**Option A: Gradient entfernen, solid Bordeaux**
- `gradient-text-hero` ersetzen durch `text-bordeaux-900`
- Klarer, zeitloser, definitiv premium
- Verliert etwas visuelle Energie

**Option B: Gradient subtiler**
- Gradient von Bordeaux → leicht aufgehelltes Bordeaux (statt stark kontrastierende Farben)
- `from-bordeaux-900 to-bordeaux-700` statt aktuellem Verlauf
- Weniger offensichtlich, behält leichte Tiefenwirkung

**Option C: Belassen**
- Im Kontext der restlichen Seite ist es gut eingebettet
- Entscheidung vertagen bis nach anderen Änderungen

**Dateien:**
- `src/app/globals.css` — `.gradient-text-hero` Definition
- `src/components/sections/Services.tsx` — `headlineClassName` Zeile ~240

---

## Umsetzungsreihenfolge (Empfehlung)

| # | Priorität | Aufwand | Impact | Empfehlung |
|---|---|---|---|---|
| 1 | Typografie-Hierarchie (P4) | 15 min | Sofort sichtbar | Zuerst |
| 2 | Badge/Pill Redesign (P3) | 20 min | Hoch | Direkt danach |
| 3 | Icon-Überarbeitung (P2) | 30 min | Hoch | Option C als Schnellfix, Option A als Ziel |
| 4 | Finance Hover-Akzent (P5) | 20 min | Mittel | Option B zum Start |
| 5 | Grid-Layout (P1) | 60–90 min | Transformativ | Nach kleineren Fixes |
| 6 | Gradient-Text (P6) | 10 min | Kontrovers | Nach Review mit Client |

---

## Betroffene Dateien (Übersicht)

```
src/
├── components/
│   ├── sections/
│   │   └── Services.tsx          — Hauptdatei: Grid, Karten, Icons, Badges, Titel
│   └── ui/
│       └── HoverCard.tsx         — Akzentlinie-Logik (P5)
└── app/
    └── globals.css               — Gradient-Text Definition (P6)
```

---

## Design-Prinzipien (Leitfaden für alle Änderungen)

1. **Restraint over decoration** — Jedes dekorative Element muss einen Grund haben
2. **Type carries weight** — Typografie-Hierarchie ist wichtiger als Icons/Badges
3. **Air is not wasted space** — Großzügiges Padding und Whitespace signalisieren Premiumqualität
4. **Consistent rhythm** — Gleiche Abstände, gleiche Ausrichtung über alle Karten
5. **Motion is the last layer** — Animationen ergänzen, sie ersetzen keine strukturellen Entscheidungen
