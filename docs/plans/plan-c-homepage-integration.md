# Plan C: Integration in die Homepage + expandable/modale Profile

## 1. Übersicht

Es wird **keine** Team-Subpage angelegt. Stattdessen kommt eine neue **Team-Section** auf der **Homepage** (zwischen About und Services). Die Teammitglieder werden als **Profil-Karten** dargestellt; ein Klick öffnet entweder einen **expandierten Inline-Bereich** (Accordion/Expand) oder einen **Dialog/Modal** mit dem vollständigen Profil (Biografie, Kompetenzfelder, Zitat, CTA). Es gibt keine eigenen URLs pro Person; alles bleibt auf der Startseite.

---

## 2. Routing & Dateien

### Erstellte/geänderte Dateien

| Aktion | Pfad |
|--------|------|
| **Neu** | `src/components/sections/Team.tsx` (Section für Homepage) |
| **Neu** | `src/components/sections/team/TeamCard.tsx` (kompakte Karte: Bild, Name, Rolle, „Mehr“-Trigger) |
| **Neu** | `src/components/sections/team/TeamProfileContent.tsx` (Wiederverwendbarer Inhalt: Bio, Kompetenzen, Quote, CTA) |
| **Neu** | `src/components/sections/team/TeamProfileModal.tsx` (Dialog mit TeamProfileContent) **oder** |
| **Neu** | `src/components/sections/team/TeamCardExpanded.tsx` (Expandierter Inline-Block unter der Karte) |
| **Angepasst** | `src/app/[locale]/page.tsx` (Team zwischen About und Services einfügen, SectionDivider) |
| **Angepasst** | `src/lib/constants.ts` (`TEAM_MEMBERS`) |
| **Angepasst** | `src/components/sections/About.tsx` (optional: Link/Scroll zu Team-Section `#team`) |
| **Angepasst** | `src/messages/de.json` (und alle 44 Locales) |

**Hinweis**: Entweder **Modal** oder **Expandierbar** umsetzen; beides zu dokumentieren, die Implementierung wählt eine Variante (oder optional beides mit Feature-Flag).

### Verzeichnisbaum (relevant)

```
src/
├── app/[locale]/
│   └── page.tsx                     # Team-Section einfügen
├── components/sections/
│   ├── Team.tsx                     # Hauptsection
│   └── team/
│       ├── TeamCard.tsx             # Karte (kompakt)
│       ├── TeamProfileContent.tsx    # Bio + Kompetenzen + Quote + CTA
│       ├── TeamProfileModal.tsx      # Modal-Variante
│       └── TeamCardExpanded.tsx      # Expand-Variante (optional statt Modal)
├── lib/
│   └── constants.ts
└── messages/
    └── de.json
```

---

## 3. Neue Komponenten

### `Team` (Section)

Hauptsection für die Homepage: SectionHeading + Grid aus TeamCards. Id `team` für Scroll-Anker.

```ts
// src/components/sections/Team.tsx

"use client";

import type { ReactNode } from "react";

export interface TeamSectionProps {
  badge: string;
  headline: string;
  subtitle?: string;
  children?: ReactNode;
}
```

Rendering: `section id="team"`, Container, SectionHeading, Grid von TeamCard (Daten aus constants + Übersetzung).

### `TeamCard`

Kompakte Karte: Portrait, Name, Rolle, Button/Link „Profil ansehen“ oder „Mehr“. Bei Klick: Modal öffnen oder Inline expandieren.

```ts
// src/components/sections/team/TeamCard.tsx

export interface TeamCardProps {
  slug: string;
  name: string;
  role: string;
  imagePath: string;
  imageAlt: string;
  onOpenProfile: (slug: string) => void;
}
```

Styling: wie bestehende Cards (`rounded-2xl border border-beige-200/60`, Hover), Fokus sichtbar.

### `TeamProfileContent`

Wiederverwendbarer Block: Biografie (asymmetrisches Grid), Kompetenzfelder (Cards), Zitat, CTA. Wird sowohl im Modal als auch in der Expand-Variante genutzt.

```ts
// src/components/sections/team/TeamProfileContent.tsx

export interface CompetencyItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
}

export interface TeamProfileContentProps {
  slug: string;
  /** Übersetzungen werden intern per useTranslations("team_<slug>") geladen */
  paragraphs: string[];
  competencies: CompetencyItem[];
  quote: string;
  quoteAttribution: string;
  imageSrc: string;
  imageAlt: string;
  ctaLabel: string;
  onCtaClick?: () => void;
}
```

Optional: Statt vieler Props nur `slug` übergeben und alle Texte per `useTranslations(\`team_${slug}\`)` laden; dann braucht die Parent-Komponente keine Daten durchzureichen.

### `TeamProfileModal`

Dialog (role="dialog", aria-modal, Fokusfalle) der TeamProfileContent anzeigt. Schließen per Overlay-Klick, Escape, Schließen-Button. Anlehnung an ContactDialog (useFocusTrap, AnimatePresence, motion).

```ts
// src/components/sections/team/TeamProfileModal.tsx

export interface TeamProfileModalProps {
  open: boolean;
  slug: string | null;
  onClose: () => void;
}
```

Bei `open && slug`: Content für `slug` laden und TeamProfileContent rendern; Schließen-Button und Overlay setzen `onClose()`.

### `TeamCardExpanded` (Alternative zur Modal-Variante)

Inline unter der ausgewählten Karte: erweiterter Bereich mit TeamProfileContent, „Einklappen“-Button. Nur ein Profil gleichzeitig expanded (bei Öffnung eines anderen wird das vorherige eingeklappt).

```ts
// src/components/sections/team/TeamCardExpanded.tsx

export interface TeamCardExpandedProps {
  slug: string;
  onClose: () => void;
}
```

Animation: z. B. `motion.div` mit `animate={{ height: "auto", opacity: 1 }}` / `initial={{ height: 0, opacity: 0 }}` und `useReducedMotion`.

---

## 4. Bestehende Komponenten

| Komponente | Verwendung |
|------------|------------|
| `Container` | Team-Section (size `lg`). |
| `SectionHeading` | Team (badge, headline, subtitle). |
| `SectionDivider` | Zwischen About und Team (variant `line`), zwischen Team und Services. |
| `FadeIn` / `SlideReveal` | Team-Headline, Cards gestaffelt; Inhalt im Modal/Expanded. |
| `Button` | „Profil ansehen“ auf Karte, CTA im Profil (z. B. Kontakt). |
| `CloseButton` | Im Modal (wie ContactDialog). |
| `useFocusTrap` | Im Modal für Barrierefreiheit (wie ContactDialog). |

**Anpassungen:**

- **page.tsx**: Nach About und SectionDivider `<Team />` einfügen, danach SectionDivider, dann Services.
- **About.tsx**: Optional Link/Button „Team ansehen“ mit Scroll zu `#team` (scrollToSection oder Link `/#team`).
- **NAV_LINKS**: Optional `{ id: "team", href: "team" }` ergänzen, damit Header „Team“ anzeigt und zu `#team` scrollt (wie andere Sektionen).

---

## 5. Translations

### Beispiel `de.json` (Struktur)

```json
{
  "team": {
    "badge": "Unser Team",
    "headline": "Die Menschen hinter FIECON",
    "subtitle": "Persönliche Beratung mit Weitblick.",
    "card_cta": "Profil ansehen",
    "expand_close": "Einklappen",
    "modal_close": "Schließen",
    "cta_headline": "Lassen Sie uns sprechen",
    "cta_subline": "Wir freuen uns auf Ihre Anfrage.",
    "cta_button": "Kontakt aufnehmen",
    "competencies_headline": "Kompetenzfelder"
  },
  "team_peter_fiegler": {
    "card_name": "Peter Fiegler",
    "card_role": "Gründer",
    "hero_tagline": "Gesellschaftsrecht und internationale Firmengründungen",
    "bio_1": "…",
    "bio_2": "…",
    "quote": "Wir beraten, als ginge es um unser eigenes Unternehmen.",
    "quote_attribution": "Peter Fiegler, Gründer",
    "competency_1_title": "Gesellschaftsrecht",
    "competency_1_description": "…",
    "competency_2_title": "Internationale Firmengründungen",
    "competency_2_description": "…"
  },
  "team_second_member": {
    "card_name": "…",
    "card_role": "…",
    "hero_tagline": "…",
    "bio_1": "…",
    "quote": "…",
    "quote_attribution": "…",
    "competency_1_title": "…",
    "competency_1_description": "…"
  }
}
```

- Keine eigenen Meta-Titles/Descriptions nötig (keine eigenen Seiten).
- Alle 44 Locales um die gleichen Keys ergänzen.

---

## 6. Navigation

- **Header**: Optional neuer Punkt „Team“ mit href `/#team` (scrollToSection wie bei About/Services). Dafür in `NAV_LINKS` z. B. `{ id: "team", href: "team" }` und in `scrollToSection`/useActiveSection die Section `team` berücksichtigen.
- **Footer**: Optional Link „Team“ zu `/#team` (Anker).
- **About**: Optional „Team ansehen“ → Scroll zu `#team`.
- **Intern**: Keine Subpages; State nur clientseitig (welches Modal offen / welche Karte expanded).

---

## 7. SEO & Structured Data

- **Keine eigenen Seiten**: Keine zusätzlichen Metadata oder canonical URLs für Profile.
- **Homepage-Metadata**: Unverändert; Team-Inhalte sind Teil der gleichen Seite.
- **JSON-LD**: Optional auf der Homepage das bestehende Organization/LocalBusiness-Schema um `employee` (Person) erweitern:
  - `employee: [ { "@type": "Person", name: "...", jobTitle: "..." } ]`
- **Open Graph**: Kein separates OG pro Profil (keine sharebaren Profil-URLs). Bei Bedarf kann die Startseite ein allgemeines OG-Bild behalten.

---

## 8. Animations

- **Section**: SectionHeading mit FadeIn; Cards mit FadeIn und gestaffeltem delay.
- **Modal**: Öffnen/Schließen mit AnimatePresence + motion (opacity, scale oder height), wie ContactDialog; Dauer und Easing an bestehende Dialoge anpassen.
- **Expand-Variante**: Height/Opacity mit motion, `useReducedMotion` beachten (z. B. keine Animation oder sofort ein-/ausblenden).
- CTA und Zitat im Profil: FadeIn mit kurzem delay.

---

## 9. Assets

- Wie Plan A/B: Portrait pro Person (z. B. `/team/peter-fiegler.png`), für TeamCard und für TeamProfileContent (Quote, ggf. Bio). Optional separates Bio-Bild.
- Keine zusätzlichen Assets nur für Plan C gegenüber A/B.

---

## 10. Vorteile & Nachteile

| Vorteile | Nachteile |
|----------|-----------|
| Keine neuen Routen, alles auf einer Seite | Keine eigenen URLs pro Person (schlechter für SEO/Linking) |
| Schneller Wechsel zwischen Profilen (Modal/Expand) | Kein direktes Teilen eines Profil-Links |
| Einheitliche Navigation (weiter nur Anker) | Modal/Expand-Logik und Fokus-Management aufwändiger |
| Weniger Dateien als Plan B (keine Team-Pages) | Kein Person-Schema pro Profil (nur optional employee auf Homepage) |
| Klare Platzierung zwischen About und Services | 44 Locales für Team-Keys trotzdem nötig |

---

## 11. Geschätzter Aufwand

- **Stunden**: ca. 14–20 h (Section, Cards, Modal oder Expand, Fokus/Keyboard, alle Locales).
- **Dateien**: ~5–6 neue (Team, TeamCard, TeamProfileContent, TeamProfileModal oder TeamCardExpanded), ~3 angepasst (page.tsx, constants, messages; optional About, NAV_LINKS).

---

## 12. Implementierungsreihenfolge

1. **Constants**: `TEAM_MEMBERS` in `constants.ts` (slug, translationKey, imagePath). Optional `NAV_LINKS` um `team` ergänzen.
2. **Translations**: `team` und `team_peter_fiegler` / `team_second_member` in de.json, danach in alle 44 Locales.
3. **TeamProfileContent**: Wiederverwendbare Komponente (Bio-Grid, Kompetenzen-Cards, Quote, CTA); liest aus `useTranslations(\`team_${slug}\`)` oder bekommt Props.
4. **TeamCard**: Kompakte Karte mit Bild, Name, Rolle, „Profil ansehen“; ruft `onOpenProfile(slug)` auf.
5. **TeamProfileModal**: Dialog mit CloseButton, Overlay, useFocusTrap, AnimatePresence; rendert TeamProfileContent für aktuellen `slug`. State „open + slug“ in Parent.
6. **Team (Section)**: Section mit id="team", SectionHeading, Grid aus TEAM_MEMBERS → TeamCard; State für `selectedSlug`, bei Klick Modal öffnen (`setSelectedSlug(slug)`), onClose → `setSelectedSlug(null)`.
7. **Homepage**: In `page.tsx` Team zwischen About und Services einfügen, SectionDivider davor und danach.
8. **Scroll/NAV**: Optional NAV_LINKS um team erweitern, useActiveSection und scrollToSection für `#team` unterstützen.
9. **About**: Optional Link/Scroll zu `#team`.
10. **SEO**: Optional employee im Organization-Schema auf der Homepage.
11. **Review**: Keyboard (Escape, Tab im Modal), Fokus, RTL, alle Locales, Lint/Build.

**Alternative (Expand statt Modal):** Statt TeamProfileModal Schritt 5 durch TeamCardExpanded ersetzen; in Team Section State `expandedSlug`, bei Klick auf Karte `expandedSlug` setzen/wechseln, TeamCardExpanded unter der aktiven Karte rendern, „Einklappen“ setzt `expandedSlug` auf null.
