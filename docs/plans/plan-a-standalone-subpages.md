# Plan A: Eigenständige Profil-Subpages unter `/team/[slug]`

## 1. Übersicht

Zwei feste Team-Profilseiten werden als **statische Routen** unter `/team/peter-fiegler` und `/team/<zweiter-name>` angeboten. Es gibt **keine Team-Übersichtsseite**. Verlinkung erfolgt aus der About-Section (Portrait/Zitat) und aus dem Footer. Jede Detailseite enthält: Hero-Banner, Biografie (asymmetrisches Grid), Kompetenzfelder (Cards), Zitatblock und CTA (z. B. Kontakt).

---

## 2. Routing & Dateien

### Erstellte/geänderte Dateien

| Aktion | Pfad |
|--------|------|
| **Neu** | `src/app/[locale]/team/peter-fiegler/page.tsx` |
| **Neu** | `src/app/[locale]/team/[slug]/page.tsx` (optional: zweite Person als dynamische Route mit `generateStaticParams`) |
| **Neu** | `src/app/[locale]/team/peter-fiegler/layout.tsx` (optional, für gemeinsame Metadata-Logik) |
| **Neu** | `src/components/sections/team/TeamProfileHero.tsx` |
| **Neu** | `src/components/sections/team/TeamProfileBio.tsx` |
| **Neu** | `src/components/sections/team/TeamProfileCompetencies.tsx` |
| **Neu** | `src/components/sections/team/TeamProfileQuote.tsx` |
| **Neu** | `src/components/sections/team/TeamProfileCta.tsx` |
| **Angepasst** | `src/lib/constants.ts` (z. B. `TEAM_SLUGS` oder feste Slugs) |
| **Angepasst** | `src/components/sections/About.tsx` (Link zum Profil) |
| **Angepasst** | `src/components/layout/Footer.tsx` (Link „Team“ / zu Profilen) |
| **Angepasst** | `src/messages/de.json` (und alle 44 Locales) – neue Namespaces |

**Variante mit zwei statischen Routen (ohne dynamische Route):**

- `src/app/[locale]/team/peter-fiegler/page.tsx`
- `src/app/[locale]/team/<zweiter-slug>/page.tsx` (z. B. `second-member`)

Dann keine `[slug]`-Route, keine `generateStaticParams`.

### Verzeichnisbaum (relevant)

```
src/
├── app/[locale]/
│   ├── team/
│   │   ├── peter-fiegler/
│   │   │   └── page.tsx
│   │   └── second-member/          # oder konkreter Name
│   │       └── page.tsx
├── components/sections/
│   └── team/
│       ├── TeamProfileHero.tsx
│       ├── TeamProfileBio.tsx
│       ├── TeamProfileCompetencies.tsx
│       ├── TeamProfileQuote.tsx
│       └── TeamProfileCta.tsx
├── lib/
│   └── constants.ts                # TEAM_SLUGS oder TEAM_MEMBERS
└── messages/
    └── de.json                    # team.*, team.peter_fiegler.*, team.second_member.*
```

---

## 3. Neue Komponenten

### `TeamProfileHero`

Hero-Banner oben auf der Profilseite: Hintergrund (optional Bild/Gradient), Name, Rolle, evtl. kurzer Teaser.

```ts
// src/components/sections/team/TeamProfileHero.tsx

export interface TeamProfileHeroProps {
  name: string;
  role: string;
  tagline?: string;
  imageSrc?: string;
  imageAlt?: string;
}
```

### `TeamProfileBio`

Asymmetrisches Grid: Bild links/rechts, Fließtext daneben. Nutzung von `Container`, Typografie wie auf der Seite.

```ts
// src/components/sections/team/TeamProfileBio.tsx

export interface TeamProfileBioProps {
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
}
```

### `TeamProfileCompetencies`

Kompetenzfelder als Cards (analog zu Services-Cards: `rounded-2xl border border-beige-200/60`, Hover).

```ts
// src/components/sections/team/TeamProfileCompetencies.tsx

export interface CompetencyItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
}

export interface TeamProfileCompetenciesProps {
  competencies: CompetencyItem[];
  /** Überschrift über den Cards, z. B. aus t("team.competencies_headline") */
  headline?: string;
}
```

### `TeamProfileQuote`

Zitatblock wie in der About-Section: Gradient-Frame, rundes Portrait, Zitat + Attribution.

```ts
// src/components/sections/team/TeamProfileQuote.tsx

export interface TeamProfileQuoteProps {
  quote: string;
  attribution: string;
  imageSrc: string;
  imageAlt: string;
}
```

### `TeamProfileCta`

Call-to-Action am Ende der Seite (z. B. „Kontakt aufnehmen“ mit Link zu `/#contact` oder ContactDialog).

```ts
// src/components/sections/team/TeamProfileCta.tsx

export interface TeamProfileCtaProps {
  headline: string;
  subline?: string;
  ctaLabel: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}
```

---

## 4. Bestehende Komponenten

| Komponente | Verwendung |
|------------|------------|
| `Container` | Alle Sektionen (size `md`/`lg`), wie Impressum/Subpages. |
| `SectionHeading` | Optional für „Kompetenzfelder“-Überschrift; ansonsten nur Headline-Text. |
| `FadeIn` | Hero, Bio, Competencies, Quote, CTA (gestaffelt). |
| `SlideReveal` | Optional für Textblöcke (direction left/right). |
| `Button` | CTA (variant `primary`, href zu `/#contact`). |
| `SectionDivider` | Optional zwischen Sektionen (variant `line`). |

**Anpassungen:**

- **About.tsx**: Portrait/Zitat klickbar machen (Link zu `/team/peter-fiegler`) oder darunter einen kleinen Link „Mehr zu Peter Fiegler“ mit `Link` von `@/i18n/navigation`.
- **Footer.tsx**: Unter „Rechtliches“ oder eigener Spalte „Team“ mit Links zu `/team/peter-fiegler` und `/team/second-member`.

Keine Änderung an Header/Nav (kein neuer Navigationspunkt).

---

## 5. Translations

Neue Namespaces: `team` (gemeinsam) und pro Person z. B. `team.peter_fiegler`, `team.second_member` (oder Keys unter `team` mit Slug-Präfix).

### Beispiel `de.json` (Auszug)

```json
{
  "team": {
    "nav_label": "Team",
    "competencies_headline": "Kompetenzfelder",
    "cta_headline": "Lassen Sie uns sprechen",
    "cta_subline": "Wir freuen uns auf Ihre Anfrage.",
    "cta_button": "Kontakt aufnehmen",
    "back_to_home": "Zur Startseite"
  },
  "team_peter_fiegler": {
    "meta_title": "Peter Fiegler — Gründer",
    "meta_description": "Peter Fiegler, Gründer von FIECON. Gesellschaftsrecht, internationale Firmengründungen, persönliche Beratung.",
    "hero_role": "Gründer",
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
    "meta_title": "…",
    "meta_description": "…",
    "hero_role": "…",
    "hero_tagline": "…",
    "bio_1": "…",
    "quote": "…",
    "quote_attribution": "…",
    "competency_1_title": "…",
    "competency_1_description": "…"
  }
}
```

Oder flache Keys pro Slug unter einem Objekt (z. B. `team.profiles.peter_fiegler.hero_role`), je nach Präferenz. Wichtig: Alle Keys in allen 44 Locales anlegen (oder Platzhalter bis Übersetzung vorliegt).

---

## 6. Navigation

- **Header**: Unverändert (kein „Team“-Link).
- **Footer**: Neuer Block „Team“ (oder unter „Rechtliches“) mit:
  - Link zu `/team/peter-fiegler` (Text z. B. „Peter Fiegler“)
  - Link zu `/team/second-member` (Text aus Übersetzung).
- **About-Section**: Link von Portrait oder Zitat zu `/team/peter-fiegler`; optional zweiter Link für zweite Person.
- **Intern**: Auf den Profilseiten „Zur Startseite“ (Link `/`) und ggf. Breadcrumb „Team > Name“.

---

## 7. SEO & Structured Data

- **Metadata pro Seite**: `generateMetadata` in jeder `page.tsx` (oder in gemeinsamem Layout):
  - `title`: `{t("team_<slug>.meta_title")} — ${COMPANY.name}`
  - `description`: `t("team_<slug>.meta_description")`
  - `alternates.canonical`: `/${locale}/team/<slug>`
  - `openGraph`: title, description, url; `type: "profile"` möglich.
- **JSON-LD**: Pro Profilseite ein `Person`-Schema:
  - `@type: "Person"`, name, jobTitle, description, image, worksFor: Organization (FIECON), url.
- **Open Graph**: Gleiche title/description wie Metadata; optional `og:image` mit Portrait.

---

## 8. Animations

- **Hero**: `FadeIn` (direction `up`) für Name/Rolle/Tagline.
- **Bio**: `SlideReveal` links für Bild, rechts für Text (oder umgekehrt je nach `imagePosition`).
- **Competencies**: `FadeIn` mit gestaffeltem `delay` pro Card.
- **Quote**: `FadeIn` wie in About (gradient frame + blockquote).
- **CTA**: `FadeIn` mit leichtem delay.
- `useReducedMotion` aus `motion/react` berücksichtigen (wie in bestehenden Animationen).

---

## 9. Assets

- **Bilder**: Pro Person mindestens:
  - Portrait quadratisch/hochkant für Quote und ggf. Hero (z. B. `/team/peter-fiegler.png` bereits vorhanden).
  - Optional: weiteres Bild für Bio-Sektion (z. B. `/team/peter-fiegler-bio.jpg`).
- Für zweite Person: `/team/second-member.png` (oder analog).
- Formate: WebP/AVIF empfohlen, Next.js `Image` mit sinnvollen `sizes`.

---

## 10. Vorteile & Nachteile

| Vorteile | Nachteile |
|----------|-----------|
| Einfaches Routing, nur 2 feste Seiten | Jede neue Person = neue Route + neue Datei |
| Gute SEO durch eigene URLs und Person-Schema | Kein zentraler „Team“-Einstieg |
| Klare Verlinkung aus About/Footer | Header bleibt ohne Team-Link |
| Wiederverwendung von Container, FadeIn, SectionHeading | 44 Locales für alle neuen Keys pflegen |

---

## 11. Geschätzter Aufwand

- **Stunden**: ca. 12–18 h (inkl. beide Profile, alle Locales, SEO, Assets einbinden).
- **Dateien**: ~8 neue (5 Komponenten, 2–3 Seiten), ~4 angepasst (constants, About, Footer, messages).

---

## 12. Implementierungsreihenfolge

1. **Constants**: In `constants.ts` `TEAM_SLUGS` oder `TEAM_MEMBERS` mit `slug`, `translationKey` definieren.
2. **Translations**: Namespace `team` und `team_peter_fiegler` / `team_second_member` in `de.json` anlegen, danach in alle 44 Locales übernehmen (Copy/Platzhalter).
3. **Team-Komponenten**: `TeamProfileHero`, `TeamProfileBio`, `TeamProfileCompetencies`, `TeamProfileQuote`, `TeamProfileCta` in `src/components/sections/team/` implementieren (mit Props oben).
4. **Seite Peter Fiegler**: `src/app/[locale]/team/peter-fiegler/page.tsx` anlegen, `generateMetadata` + alle Sektionen einbinden, `setRequestLocale`, Container, Abstände `pt-32 pb-24`.
5. **Seite zweite Person**: Entweder `team/second-member/page.tsx` oder dynamische Route `team/[slug]/page.tsx` mit `generateStaticParams` für beide Slugs; gleicher Seitenaufbau.
6. **About**: Link zu `/team/peter-fiegler` (Portrait oder „Mehr erfahren“).
7. **Footer**: „Team“-Links zu beiden Profilseiten.
8. **SEO**: Metadata + JSON-LD Person pro Profilseite, Open Graph.
9. **Assets**: Bilder ablegen und in Komponenten einbinden.
10. **Review**: Alle Locales, RTL (Arabic), Fokus-Indikatoren, Lint/Build.
