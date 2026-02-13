# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

## [0.2.0] - 2025-02-13

### Added

- CI/CD-Pipeline mit GitHub Actions (Lint, Test, Coverage, Build, SBOM)
- Dependabot für automatische Dependency-Updates (npm + GitHub Actions)
- Coverage-Threshold (50 %) als Quality Gate in Vitest
- Health-Check-Endpoint `/api/health` für Uptime-Monitoring
- Sentry Error Monitoring (Client, Server, Edge)
- SBOM-Generierung mit CycloneDX
- SECURITY.md mit Vulnerability-Disclosure-Prozess
- CHANGELOG.md nach Keep a Changelog
- Backup-Strategie und Uptime-Monitoring-Dokumentation in DEPLOYMENT.md

### Fixed

- Alle ESLint-Fehler und -Warnings behoben (0 Errors, 0 Warnings)
- ESLint-Ignores für `coverage/` und `scripts/` ergänzt

## [0.1.0] - 2025-02-13

### Added

- Initiale Website mit Next.js 16, TypeScript 5.9, Tailwind CSS 4
- 7 Sektionen: Hero, About, Services, Philosophy, Offices, Contact, Footer
- Internationalisierung mit next-intl (44 Sprachen inkl. RTL)
- Kontakt-API mit CSRF-Schutz, Rate Limiting, XSS-Schutz, Header-Injection-Schutz
- SEO: robots.txt, sitemap.xml, Open Graph, Twitter Cards, JSON-LD
- Barrierefreiheit: Skip-Link, ARIA-Attribute, `useReducedMotion`, Focus-Trap
- 338 Tests (API, Utils, i18n, SEO, A11y, Hooks, UI, Animations)
- Animations-Komponenten: FadeIn, TextReveal, SlideReveal, MagneticButton, CountUp
- Security Headers: HSTS, CSP, X-Frame-Options, X-Content-Type-Options
- Deployment-Setup mit rsync, PM2, Nginx, SSL (Let's Encrypt)
