# FIECON Consulting Website

## Project Overview
Corporate website for FIECON (Fiegler Consulting KG), an international consulting firm headquartered in Hamburg with offices in Belgrade and Texas.

## Tech Stack
- **Framework:** Next.js 15 (App Router, Turbopack dev server)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (PostCSS plugin)
- **Animations:** Motion (Framer Motion) v12
- **i18n:** next-intl v4 (German default + English, `localePrefix: "never"`)
- **Package Manager:** pnpm
- **Fonts:** Playfair Display (headings) + Inter (body) via next/font

## Commands
- `pnpm dev --port 3002` — Dev server (ports 3000/3001 used by other projects)
- `pnpm build` — Production build
- `pnpm lint` — ESLint

## Architecture

### Routing & i18n
- No locale prefix in URLs (`localePrefix: "never"`) — locale detected from cookie/Accept-Language header
- Middleware at `middleware.ts` handles locale routing
- i18n config: `src/i18n/routing.ts` (locale definitions) + `src/i18n/request.ts` (request config with cookie/header fallback)
- Translation files: `src/messages/de.json`, `src/messages/en.json`

### Directory Structure
```
src/
├── app/               # Next.js App Router pages
│   ├── page.tsx        # Homepage (single-page scroll, 7 sections)
│   ├── layout.tsx      # Root layout
│   ├── globals.css     # Global styles + Tailwind
│   ├── api/contact/    # POST endpoint (nodemailer)
│   ├── impressum/      # Legal: Impressum
│   └── datenschutz/    # Legal: Datenschutz
├── components/
│   ├── animations/     # FadeIn, StaggerChildren, CountUp, ParallaxLayer,
│   │                   # ScrollProgress, TextReveal, SlideReveal, MagneticButton
│   ├── layout/         # Header, Footer, LanguageSwitcher, MobileMenu
│   ├── sections/       # Hero, About, Services, Philosophy, Offices, Contact
│   └── ui/             # Button, Badge, Container, SectionHeading,
│                       # SectionDivider, GradientText, ContactDialog
├── hooks/              # useReducedMotion, useScrollProgress
├── i18n/               # next-intl routing + request config
├── lib/                # constants.ts (company data), utils.ts
└── messages/           # de.json, en.json translation files
```

### Design System
- **Color palette:** Bordeaux (#62191C, #873632) + Beige (#9E7161, #CAAE9F, #E0CFC2)
- **Path alias:** `@/*` maps to `./src/*`

## Conventions
- Use `React.ReactNode` for return types (not `JSX.Element` — removed in React 19)
- Motion v12 ease arrays need explicit tuple typing: `as [number, number, number, number]`
- Animation components respect `prefers-reduced-motion` via `useReducedMotion` hook
- Constants (company info, nav links, offices, services) live in `src/lib/constants.ts`
- All text content goes through next-intl translations — no hardcoded strings in components
