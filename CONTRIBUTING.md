# Contributing to FIECON

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in the required values
3. Install dependencies: `pnpm install`
4. Start the dev server: `pnpm dev`

## Development

- **Dev server:** `pnpm dev` (port 3000)
- **Lint:** `pnpm lint`
- **Test:** `pnpm test`
- **Test with coverage:** `pnpm test:coverage`
- **Check translations:** `pnpm check:i18n`
- **Build:** `pnpm build`

## Code Conventions

- TypeScript strict mode — no `any` types
- All UI text goes through next-intl translations (no hardcoded strings)
- Use `@/*` path alias for imports from `src/`
- Use locale-aware `Link`, `redirect`, `usePathname`, `useRouter` from `@/i18n/navigation`
- Buttons must have explicit `type="button"` unless they are submit buttons
- Interactive elements must have visible `:focus-visible` indicators

## Translations

Translation files live in `src/messages/{locale}.json`. German (`de.json`) is the reference locale. Run `pnpm check:i18n` to verify all locales have matching keys.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.
