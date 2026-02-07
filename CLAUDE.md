# FIECON Consulting Website

## Project Overview
Corporate website for FIECON (Fiegler Consulting KG), an international consulting firm headquartered in Hamburg with offices in Belgrade and Texas.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack dev server)
- **Language:** TypeScript 5.9 (strict mode)
- **Styling:** Tailwind CSS v4 (@tailwindcss/postcss plugin)
- **Animations:** Motion (Framer Motion) v12
- **i18n:** next-intl v4 (14 locales, `localePrefix: "never"`)
- **Email:** Nodemailer 8
- **Testing:** Vitest + Testing Library
- **Package Manager:** pnpm
- **Fonts:** Playfair Display (headings) + DM Sans (body) + Noto Sans Arabic (RTL) via next/font

## Commands
- `pnpm dev` — Dev server on port 3000 (if port 3000 is occupied, kill the existing process first — never use a different port)
- `pnpm build` — Production build
- `pnpm lint` — ESLint
- `pnpm test` — Vitest (run once)
- `pnpm test:watch` — Vitest (watch mode)

## Architecture

### Routing & i18n
- No locale prefix in URLs (`localePrefix: "never"`) — locale detected from cookie / Accept-Language header
- Middleware at `middleware.ts` handles locale routing
- i18n config: `src/i18n/routing.ts` (14 locale definitions) + `src/i18n/request.ts` (request config with cookie/header fallback)
- Translation files: `src/messages/{locale}.json` (de, en, nds, tr, ar, pl, ru, sr-Cyrl, sr-Latn, hu, bs, hr, rom, es)
- RTL support: Arabic (`ar`) gets `dir="rtl"` on `<html>` and uses Noto Sans Arabic font

### Directory Structure
```
src/
├── app/
│   ├── layout.tsx           # Root layout (passes children through)
│   ├── global-error.tsx     # Root error boundary (hardcoded German — no providers available)
│   ├── globals.css          # Global styles + Tailwind @theme
│   ├── robots.ts            # SEO: robots.txt
│   ├── sitemap.ts           # SEO: sitemap.xml
│   ├── api/contact/route.ts # POST endpoint (nodemailer, rate-limited)
│   └── [locale]/
│       ├── layout.tsx       # Locale layout: fonts, metadata, providers, Header/Footer
│       ├── page.tsx         # Homepage (single-page scroll, 7 sections)
│       ├── error.tsx        # Error boundary (translated)
│       ├── loading.tsx      # Loading spinner
│       ├── not-found.tsx    # 404 page (translated)
│       ├── impressum/       # Legal: Impressum
│       └── datenschutz/     # Legal: Datenschutz
├── components/
│   ├── animations/          # FadeIn, StaggerChildren, CountUp, ScrollProgress,
│   │                        # TextReveal, SlideReveal, MagneticButton
│   ├── flags/               # 13 SVG flag components + index.ts barrel export
│   ├── layout/              # Header, Footer, LanguageSwitcher, MobileMenu, ScrollToSection
│   ├── sections/            # Hero, About, Services, Philosophy, Offices, Contact
│   └── ui/                  # Button, Badge, Container, SectionHeading,
│                            # SectionDivider, ContactDialog
├── hooks/                   # useScrollProgress, useActiveSection, useFocusTrap
├── i18n/                    # next-intl routing + request config
├── lib/                     # constants.ts (company data, locales, nav links), utils.ts (cn, escapeHtml)
├── messages/                # 14 JSON translation files
└── tests/                   # contact-api.test.ts, utils.test.ts
```

### Design System
- **Color palette:** Bordeaux (#62191C, #873632) + Beige (#9E7161, #CAAE9F, #E0CFC2)
- **Path alias:** `@/*` maps to `./src/*`

## Conventions
- Use `React.ReactNode` for return types (not `JSX.Element` — removed in React 19)
- Motion v12 ease arrays need explicit tuple typing: `as [number, number, number, number]`
- Animation components use `useReducedMotion` from `motion/react` to respect prefers-reduced-motion
- Constants (company info, nav links, offices, services, locales) live in `src/lib/constants.ts`
- All text content goes through next-intl translations — no hardcoded strings in components
- Buttons always have explicit `type="button"` unless they are submit buttons
- Interactive elements must have visible focus indicators (`:focus-visible`)
