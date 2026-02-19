# Plan B: Team-Übersichtsseite + Profil-Detail

## 1. Übersicht

Es gibt eine **Team-Übersichtsseite** unter `/team` mit Profil-Karten und **dynamische Profil-Detailseiten** unter `/team/[slug]`. „Team“ wird als eigener Punkt in der **Header-Navigation** geführt. Die Übersicht listet alle Teammitglieder als Cards; ein Klick führt zur Detailseite. Die Detailseiten entsprechen inhaltlich Plan A: Hero, Biografie (asymmetrisches Grid), Kompetenzfelder (Cards), Zitat, CTA.

---

## 2. Routing & Dateien

### Erstellte/geänderte Dateien

| Aktion | Pfad |
|--------|------|
| **Neu** | `src/app/[locale]/team/page.tsx` (Übersicht) |
| **Neu** | `src/app/[locale]/team/[slug]/page.tsx` (Detail) |
| **Neu** | `src/app/[locale]/team/[slug]/not-found.tsx` (optional, 404 bei ungültigem Slug) |
| **Neu** | `src/components/sections/team/TeamOverview.tsx` (Übersichtsseite-Inhalt) |
| **Neu** | `src/components/sections/team/TeamMemberCard.tsx` (Karte für Übersicht) |
| **Neu** | `src/components/sections/team/TeamProfileHero.tsx` |
| **Neu** | `src/components/sections/team/TeamProfileBio.tsx` |
| **Neu** | `src/components/sections/team/TeamProfileCompetencies.tsx` |
| **Neu** | `src/components/sections/team/TeamProfileQuote.tsx` |
| **Neu** | `src/components/sections/team/TeamProfileCta.tsx` |
| **Angepasst** | `src/lib/constants.ts` (`TEAM_MEMBERS` mit slug, translationKey, image) |
| **Angepasst** | `src/components/layout/Header.tsx` (Team-Link) |
| **Angepasst** | `src/components/layout/MobileMenu.tsx` (Team-Link) |
| **Angepasst** | `src/components/sections/About.tsx` (Link zu Profil) |
| **Angepasst** | `src/components/layout/Footer.tsx` (Link „Team“ → `/team`) |
| **Angepasst** | `src/messages/de.json` (und alle 44 Locales) |

### Verzeichnisbaum (relevant)

```
src/
├── app/[locale]/
│   ├── team/
│   │   ├── page.tsx                 # Übersicht
│   │   └── [slug]/
│   │       ├── page.tsx             # Detail
│   │       └── not-found.tsx        # optional
├── components/sections/team/
│   ├── TeamOverview.tsx
│   ├── TeamMemberCard.tsx
│   ├── TeamProfileHero.tsx
│   ├── TeamProfileBio.tsx
│   ├── TeamProfileCompetencies.tsx
│   ├── TeamProfileQuote.tsx
│   └── TeamProfileCta.tsx
├── lib/
│   └── constants.ts
└── messages/
    └── de.json
```

---

## 3. Neue Komponenten

### `TeamOverview`

Container für die Übersichtsseite: SectionHeading + Grid von TeamMemberCards.

```ts
// src/components/sections/team/TeamOverview.tsx

import type { ReactNode } from "react";

export interface TeamMemberEntry {
  slug: string;
  /** Key für t("team.overview.card_role") oder personenspezifisch */
  translationKey: string;
  imagePath: string;
}

export interface TeamOverviewProps {
  members: TeamMemberEntry[];
  badge: string;
  headline: string;
  subtitle?: string;
  children?: ReactNode;
}
```

### `TeamMemberCard`

Klickbare Karte pro Person: Bild, Name, Rolle, Link zu `/team/[slug]`.

```ts
// src/components/sections/team/TeamMemberCard.tsx

export interface TeamMemberCardProps {
  slug: string;
  name: string;
  role: string;
  imagePath: string;
  imageAlt: string;
}
```

Verwendung von `Link` aus `@/i18n/navigation`, Styling analog zu bestehenden Cards (`rounded-2xl border border-beige-200/60`, Hover `shadow-lg shadow-bordeaux-900/8`).

### `TeamProfileHero`, `TeamProfileBio`, `TeamProfileCompetencies`, `TeamProfileQuote`, `TeamProfileCta`

Wie in Plan A (gleiche Props-Interfaces). Siehe Plan A, Abschnitt 3.

---

## 4. Bestehende Komponenten

| Komponente | Verwendung |
|------------|------------|
| `Container` | Übersichtsseite und alle Detail-Sektionen (size `md`/`lg`). |
| `SectionHeading` | Übersicht (badge, headline, subtitle); optional auf Detail für Kompetenzen. |
| `FadeIn` / `SlideReveal` | Übersicht: gestaffelt pro Card; Detail: wie Plan A. |
| `Button` | CTA auf Detailseite. |
| `SectionDivider` | Optional zwischen Sektionen auf Detailseite. |

**Anpassungen:**

- **Header.tsx**: Neuer Eintrag in der Navigation. Da NAV_LINKS bisher nur Anker (`#about` etc.) sind, muss unterschieden werden: Team als **Seitenlink** (`/team`), Rest bleibt `/#about` etc. Entweder:
  - `NAV_LINKS` um einen Eintrag `{ id: "team", href: "/team", isPage: true }` erweitern und im Header `isPage ? <Link href={href}> : <Link href={`/#${href}`}>` rendern, oder
  - Team separat neben den bestehenden NAV_LINKS rendern (z. B. `<Link href="/team">Team</Link>`).
- **MobileMenu.tsx**: Gleicher Team-Link wie im Desktop-Header (Link zu `/team`).
- **Footer.tsx**: Ein Link „Team“ → `/team` (Übersicht).
- **About.tsx**: Link zu `/team/peter-fiegler` wie in Plan A.

---

## 5. Translations

### Beispiel `de.json` (Struktur)

```json
{
  "nav": {
    "team": "Team"
  },
  "team": {
    "overview": {
      "badge": "Unser Team",
      "headline": "Die Menschen hinter FIECON",
      "subtitle": "Persönliche Beratung mit Weitblick.",
      "meta_title": "Team — FIECON",
      "meta_description": "Lernen Sie das Team von FIECON kennen. Gesellschaftsrecht, Firmengründungen, Finanzverwaltung.",
      "card_cta": "Profil ansehen"
    },
    "competencies_headline": "Kompetenzfelder",
    "cta_headline": "Lassen Sie uns sprechen",
    "cta_subline": "Wir freuen uns auf Ihre Anfrage.",
    "cta_button": "Kontakt aufnehmen",
    "back_to_team": "Zurück zum Team",
    "back_to_home": "Zur Startseite"
  },
  "team_peter_fiegler": {
    "meta_title": "Peter Fiegler — Gründer",
    "meta_description": "Peter Fiegler, Gründer von FIECON. Gesellschaftsrecht, internationale Firmengründungen.",
    "card_name": "Peter Fiegler",
    "card_role": "Gründer",
    "hero_tagline": "Gesellschaftsrecht und internationale Firmengründungen",
    "bio_1": "…",
    "bio_2": "…",
    "quote": "Wir beraten, als ginge es um unser eigenes Unternehmen.",
    "quote_attribution": "Peter Fiegler, Gründer",
    "competency_1_title": "…",
    "competency_1_description": "…"
  },
  "team_second_member": {
    "meta_title": "…",
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

- **nav.team**: Für Header und Mobile-Menü.
- **team.overview**: Alle Texte der Übersichtsseite inkl. Metadata.
- **team_<slug>**: Pro Person (meta, card_name, card_role, hero_tagline, bio, quote, competencies). Alle Keys in allen 44 Locales anlegen.

---

## 6. Navigation

- **Header (Desktop)**: Neuer Link „Team“ → `/team` (Seitenlink, kein Anker). Position z. B. nach „Über uns“ oder am Ende.
- **MobileMenu**: Gleicher Link „Team“ → `/team`.
- **Footer**: Link „Team“ → `/team` (Übersicht).
- **About**: Link zu `/team/peter-fiegler` (oder „Team“ → `/team`).
- **Übersichtsseite**: Jede Card verlinkt auf `/team/[slug]`.
- **Detailseite**: „Zurück zum Team“ → `/team`, „Zur Startseite“ → `/`.

**Constants**: `NAV_LINKS` erweitern oder separate Konstante für Seitenlinks (z. B. `PAGE_LINKS = [{ id: "team", href: "/team" }]`) und im Header beide listen.

---

## 7. SEO & Structured Data

- **Übersichtsseite** (`/team`):
  - `generateMetadata`: title, description, canonical `/${locale}/team`, openGraph.
  - Optional: ItemList-Schema mit ListItem pro Teammitglied (url, name).
- **Detailseiten** (`/team/[slug]`):
  - Wie Plan A: `generateMetadata` pro Slug (aus Übersetzung), canonical `/${locale}/team/${slug}`.
  - JSON-LD `Person`: name, jobTitle, description, image, worksFor, url.
  - Open Graph: title, description, url, optional og:image (Portrait).
- **generateStaticParams**: In `team/[slug]/page.tsx` alle gültigen Slugs aus `TEAM_MEMBERS` zurückgeben, damit statische Generierung für alle Profile möglich ist.

---

## 8. Animations

- **Übersicht**: SectionHeading mit FadeIn; TeamMemberCards mit FadeIn und gestaffeltem delay (z. B. index * 0.1).
- **Detail**: Wie Plan A (Hero, Bio, Competencies, Quote, CTA mit FadeIn/SlideReveal).
- Überall `useReducedMotion` berücksichtigen.

---

## 9. Assets

- Wie Plan A: Portrait pro Person (z. B. `/team/peter-fiegler.png`, `/team/second-member.png`) für Card und Detail (Quote, ggf. Hero/Bio).
- Optional: separates Bio-Bild pro Person. Next.js `Image` mit `sizes` für Card (kleiner) und Detail (größer).

---

## 10. Vorteile & Nachteile

| Vorteile | Nachteile |
|----------|-----------|
| Klarer Einstieg „Team“ im Header | Mehr Implementierungsaufwand als Plan A |
| Eine dynamische Route für alle Profile (leichter erweiterbar) | Header-Logik muss Seitenlink vs. Anker unterscheiden |
| Übersicht verbessert Auffindbarkeit und SEO (ItemList) | Zwei Seiten-Typen (Übersicht + Detail) zu pflegen |
| Konsistente UX: Karte → Detail | 44 Locales für alle neuen Keys |

---

## 11. Geschätzter Aufwand

- **Stunden**: ca. 18–24 h (Übersicht, dynamische Route, Header/Mobile, alle Locales, SEO).
- **Dateien**: ~10 neue (TeamOverview, TeamMemberCard, 5 Detail-Komponenten, 2 Seiten), ~6 angepasst (constants, Header, MobileMenu, Footer, About, messages).

---

## 12. Implementierungsreihenfolge

1. **Constants**: `TEAM_MEMBERS` in `constants.ts` mit slug, translationKey, imagePath. Optional `PAGE_LINKS` oder Erweiterung von `NAV_LINKS` für Team.
2. **Translations**: `nav.team`, `team.overview`, `team_<slug>` in de.json definieren, dann in alle 44 Locales übernehmen.
3. **TeamMemberCard**: Komponente mit Link zu `/team/[slug]`, Bild, Name, Rolle; Styling wie bestehende Cards.
4. **TeamOverview**: SectionHeading + Grid aus TEAM_MEMBERS, Map zu TeamMemberCard.
5. **Übersichtsseite**: `app/[locale]/team/page.tsx` mit generateMetadata, setRequestLocale, Container, TeamOverview.
6. **Detail-Komponenten**: TeamProfileHero, Bio, Competencies, Quote, Cta (wie Plan A).
7. **Detailseite**: `app/[locale]/team/[slug]/page.tsx` mit generateStaticParams (Slugs aus TEAM_MEMBERS), generateMetadata (aus Übersetzung), notFound bei ungültigem Slug, alle Sektionen einbinden.
8. **Header**: Team-Link einbauen (Seitenlink `/team`).
9. **MobileMenu**: Team-Link einbauen.
10. **Footer**: Link „Team“ → `/team`.
11. **About**: Link zu Peter Fiegler Profil.
12. **SEO**: Metadata + JSON-LD für Übersicht (ItemList optional) und Detail (Person).
13. **Optional**: `team/[slug]/not-found.tsx` mit übersetzter 404-Message.
14. **Review**: Build, alle Locales, RTL, Fokus, Lint.
