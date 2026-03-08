# Compliance & Zertifizierungsfahrplan

Dieses Dokument beschreibt den Fahrplan für ISO 27001- und SOC 2 Type II-Konformität
für die FIECON Consulting KG Webplattform und die damit verbundenen organisatorischen Maßnahmen.

> **Stand:** 2026-02-13

---

## 1. Aktueller Stand — Bereits implementiert

### 1.1 Technische Sicherheitsmaßnahmen

| Maßnahme | Status | Verweis |
|---|---|---|
| HTTPS-Enforcement (HSTS, 1 Jahr) | ✅ Implementiert | `next.config.ts` |
| Content Security Policy (Nonce-basiert) | ✅ Implementiert | `middleware.ts` |
| Clickjacking-Schutz (X-Frame-Options, frame-ancestors) | ✅ Implementiert | `next.config.ts`, `middleware.ts` |
| MIME-Sniffing-Schutz (X-Content-Type-Options) | ✅ Implementiert | `next.config.ts` |
| Referrer-Policy | ✅ Implementiert | `next.config.ts` |
| Permissions-Policy | ✅ Implementiert | `next.config.ts` |
| Eingabevalidierung & HTML-Escaping | ✅ Implementiert | `api/contact/route.ts` |
| Rate Limiting (Kontaktformular) | ✅ Implementiert | `api/contact/route.ts` |
| Dependency-Scanning (pnpm audit) | ✅ CI-Pipeline | `.github/workflows/ci.yml` |
| Dependency-Scanning (Snyk) | ✅ CI-Pipeline | `.github/workflows/ci.yml` |
| SBOM-Generierung (CycloneDX) | ✅ CI-Pipeline | `.github/workflows/ci.yml` |
| Automatische Dependency-Updates | ✅ Dependabot | `.github/dependabot.yml` |
| Error Monitoring (Sentry) | ✅ Konfiguriert | `sentry.*.config.ts` |
| Vulnerability Disclosure Policy | ✅ Dokumentiert | `SECURITY.md` |
| Server-Firewall (UFW) | ✅ Implementiert | `scripts/server-setup.sh`, `DEPLOYMENT.md` |
| SSH-Hardening (Key-only) | ✅ Implementiert | `scripts/server-setup.sh`, `DEPLOYMENT.md` |

### 1.2 Qualitätssicherung

| Maßnahme | Status | Verweis |
|---|---|---|
| Automatisierte Tests (umfangreiche Testsuite) | ✅ Implementiert | `src/tests/` |
| Coverage-Threshold (80%) | ✅ Enforced in CI | `vitest.config.ts` |
| ESLint (0 Errors, 0 Warnings) | ✅ Enforced in CI | `eslint.config.mjs` |
| TypeScript Strict Mode | ✅ Aktiviert | `tsconfig.json` |
| Changelog-Pflege | ✅ Keep a Changelog | `CHANGELOG.md` |
| Backup-Strategie | ✅ Dokumentiert | `DEPLOYMENT.md` |

### 1.3 Organisatorische Dokumentation

| Maßnahme | Status | Verweis |
|---|---|---|
| Informationssicherheitsrichtlinie | ✅ Erstellt | `Informationssicherheitsrichtlinie.md` |
| Zugriffsmatrix | ✅ Erstellt | `Zugriffsmatrix.md` |
| Incident-Response-Plan | ✅ Erstellt | `Incident-Response-Plan.md` |
| Risikoanalyse | ✅ Erstellt | `Risikoanalyse.md` |
| Change-Management-Prozess | ✅ Erstellt | `Change-Management.md` |
| Acceptable Use Policy | ✅ Erstellt | `Acceptable-Use-Policy.md` |
| Business Continuity Plan | ✅ Erstellt | `Business-Continuity-Plan.md` |

---

## 2. ISO 27001 — Fahrplan

ISO 27001 ist der internationale Standard für Informationssicherheits-Managementsysteme (ISMS).

### 2.1 Phase 1: Scope & Gap-Analyse (1–2 Wochen)

- [x] **Scope definieren:** Welche Systeme, Prozesse und Daten sind betroffen?
  - Webplattform (fiecon-consulting.eu)
  - Kontaktformular-Daten (Name, E-Mail, Nachricht)
  - Server-Infrastruktur (217.154.23.84)
  - Entwicklungsprozess (GitHub, CI/CD)
- [x] **Asset-Register erstellen:** Alle IT-Assets erfassen und klassifizieren → `Risikoanalyse.md`
- [x] **Risikoanalyse durchführen:** Bedrohungen, Schwachstellen, Auswirkungen bewerten → `Risikoanalyse.md`
- [ ] **Gap-Analyse:** Aktuellen Stand gegen ISO 27001 Annex A Controls abgleichen

### 2.2 Phase 2: Richtlinien & Prozesse (2–4 Wochen) — ✅ Abgeschlossen

- [x] **Informationssicherheitsrichtlinie** → `Informationssicherheitsrichtlinie.md`
- [x] **Acceptable Use Policy** → `Acceptable-Use-Policy.md`
- [x] **Zugangssteuerungsrichtlinie** → `Zugriffsmatrix.md`
- [x] **Incident-Response-Plan** → `Incident-Response-Plan.md`
- [x] **Business Continuity Plan** → `Business-Continuity-Plan.md`
- [x] **Change-Management-Prozess** → `Change-Management.md`

### 2.3 Phase 3: Technische Controls (2–4 Wochen)

- [ ] **Logging & Monitoring erweitern**
  - Zugriffslogs auswerten
  - Sentry-Alerts konfigurieren *(manuell auf sentry.io)*
  - Uptime-Monitoring aktiv schalten *(manuell auf uptimerobot.com, Anleitung in `DEPLOYMENT.md`)*
- [x] **Verschlüsselung**
  - TLS 1.3 auf dem Server erzwingen
  - SSH-Key-basierte Authentifizierung (Passwort deaktiviert) → `scripts/server-setup.sh`
- [x] **Netzwerksicherheit**
  - Firewall-Regeln (UFW) dokumentiert → `DEPLOYMENT.md`
  - Nur Ports 80, 443, 22 offen → `scripts/server-setup.sh`
- [ ] **Regelmäßige Sicherheitsaudits**
  - Vierteljährliche Dependency-Reviews
  - Jährlicher Penetrationstest (extern, kostenpflichtig)

### 2.4 Phase 4: Zertifizierung (fortlaufend)

- [ ] Internen Auditor benennen oder externen beauftragen
- [ ] Management-Review durchführen
- [ ] Zertifizierungsstelle auswählen (z.B. TÜV, BSI, Bureau Veritas)
- [ ] Stage 1 Audit (Dokumentenprüfung)
- [ ] Stage 2 Audit (Vor-Ort-Prüfung)

---

## 3. SOC 2 Type II — Fahrplan

SOC 2 fokussiert auf fünf Trust Service Criteria: Sicherheit, Verfügbarkeit, Verarbeitungsintegrität, Vertraulichkeit und Datenschutz.

### 3.1 Relevante Trust Service Criteria

| Kriterium | Relevanz | Begründung |
|---|---|---|
| **Sicherheit** (CC) | Hoch | Schutz gegen unberechtigten Zugriff |
| **Verfügbarkeit** (A) | Mittel | Uptime-SLAs für Kunden |
| **Vertraulichkeit** (C) | Mittel | Kontaktdaten-Schutz |
| **Datenschutz** (P) | Hoch | DSGVO-Konformität |
| **Verarbeitungsintegrität** (PI) | Niedrig | Kein transaktionales System |

### 3.2 Maßnahmen nach Kriterium

#### Sicherheit (Common Criteria)

| Control | Status | Verweis / Nächster Schritt |
|---|---|---|
| CC1: Control Environment | ✅ Dokumentiert | `Informationssicherheitsrichtlinie.md`, `Acceptable-Use-Policy.md` |
| CC2: Communication | ⬜ Ausstehend | Mitarbeiter-Schulungen durchführen |
| CC3: Risk Assessment | ✅ Dokumentiert | `Risikoanalyse.md` |
| CC4: Monitoring Activities | 🟡 Teilweise | Sentry konfiguriert; Alerts + UptimeRobot manuell einrichten |
| CC5: Control Activities | ✅ Dokumentiert | CI/CD, Code-Reviews, `Change-Management.md` |
| CC6: Logical & Physical Access | ✅ Dokumentiert | `Zugriffsmatrix.md`, UFW, SSH-Hardening |
| CC7: System Operations | ✅ Dokumentiert | `DEPLOYMENT.md`, `Business-Continuity-Plan.md` |
| CC8: Change Management | ✅ Dokumentiert | `Change-Management.md` |
| CC9: Risk Mitigation | ✅ Implementiert | Security Headers, CSP, Rate Limiting, UFW, SSH-Hardening |

#### Verfügbarkeit

- [ ] SLA definieren (z.B. 99,5% Uptime)
- [ ] Uptime-Monitoring aktivieren *(manuell auf uptimerobot.com, Anleitung in `DEPLOYMENT.md`)*
- [ ] Disaster-Recovery-Test durchführen

#### Vertraulichkeit & Datenschutz

- [x] Datenklassifizierung durchführen → `Risikoanalyse.md` (Asset-Register)
- [ ] Datenschutz-Folgenabschätzung (DSFA) prüfen
- [ ] Auftragsverarbeitungsverträge (AVV) mit Dienstleistern prüfen
  - Hosting-Provider
  - E-Mail-Provider (SMTP)
  - Sentry (Error-Reporting)

### 3.3 Zertifizierungsprozess

1. **Readiness Assessment** (1–2 Monate)
   - Interner Audit gegen SOC 2 Criteria
   - Lücken identifizieren und schließen
2. **Type I Audit** (Stichtagsbewertung)
   - Nachweis, dass Controls zu einem bestimmten Zeitpunkt vorhanden sind
3. **Beobachtungszeitraum** (6–12 Monate)
   - Controls im Betrieb nachweisen
   - Evidenz sammeln (Logs, Tickets, Reviews)
4. **Type II Audit** (Zeitraumbewertung)
   - Nachweis, dass Controls über den Zeitraum effektiv waren

---

## 4. Priorisierte Handlungsempfehlungen

### ✅ Erledigt

| # | Maßnahme | Verweis |
|---|----------|--------|
| 1 | Uptime-Monitoring — Anleitung erstellt, `/api/health` Endpoint vorhanden | `DEPLOYMENT.md` |
| 2 | Server-Firewall (UFW) konfiguriert und dokumentiert | `scripts/server-setup.sh`, `DEPLOYMENT.md` |
| 3 | SSH-Passwort-Authentifizierung deaktiviert | `scripts/server-setup.sh` |
| 4 | Sentry-Alerts — Sentry integriert, Alerts manuell einzurichten | `sentry.*.config.ts` |
| 5 | Informationssicherheitsrichtlinie erstellt | `Informationssicherheitsrichtlinie.md` |
| 6 | Zugriffsmatrix erstellt | `Zugriffsmatrix.md` |
| 7 | Incident-Response-Plan formalisiert | `Incident-Response-Plan.md` |
| 8 | Risikoanalyse durchgeführt | `Risikoanalyse.md` |
| 9 | Change-Management-Prozess dokumentiert | `Change-Management.md` |
| 10 | Acceptable Use Policy erstellt | `Acceptable-Use-Policy.md` |
| 11 | Business Continuity Plan dokumentiert | `Business-Continuity-Plan.md` |
| 12 | Snyk Vulnerability Scanning in CI integriert | `.github/workflows/ci.yml` |

### ⏳ Manuelle Schritte (kostenlos, noch auszuführen)

| # | Maßnahme | Aufwand |
|---|----------|--------|
| 1 | UptimeRobot-Account anlegen und Monitor einrichten | 10 Min |
| 2 | Sentry-Alert-Rules in der Weboberfläche konfigurieren | 15 Min |
| 3 | `server-setup.sh` auf dem Server ausführen (UFW + SSH-Hardening) | 5 Min |
| 4 | Snyk-Account anlegen und `SNYK_TOKEN` als GitHub Secret hinterlegen | 10 Min |
| 5 | `Zugriffsmatrix.md` — Platzhalter mit echten Namen/Accounts ausfüllen | 15 Min |

### 🔜 Mittelfristig (2–6 Monate)

| # | Maßnahme | Kosten |
|---|----------|--------|
| 1 | Mitarbeiterschulungen zu IT-Sicherheit durchführen | Intern |
| 2 | Externer Penetrationstest beauftragen | Ab ~3.000 € |
| 3 | ISO 27001 Gap-Analyse mit Berater durchführen | Ab ~5.000 € |
| 4 | SOC 2 Readiness Assessment planen | Ab ~5.000 € |

### 🏁 Langfristig (6–18 Monate)

| # | Maßnahme | Kosten |
|---|----------|--------|
| 1 | ISO 27001 Zertifizierung anstreben | 15.000–30.000 € |
| 2 | SOC 2 Type I durchführen | 20.000–40.000 € |
| 3 | SOC 2 Type II nach 6–12 Monaten Beobachtung | 30.000–60.000 € |

---

## 5. Tooling-Übersicht

| Bereich | Tool | Status | Kosten |
|---|---|---|---|
| Uptime-Monitoring | [UptimeRobot](https://uptimerobot.com/) | Bereit (manuelles Setup) | Kostenlos |
| Vulnerability Scanning | [Snyk](https://snyk.io/) | ✅ In CI integriert | Kostenlos |
| Dependency Scanning | pnpm audit | ✅ In CI integriert | Kostenlos |
| SBOM-Generierung | CycloneDX | ✅ In CI integriert | Kostenlos |
| Error Monitoring | [Sentry](https://sentry.io/) | ✅ Integriert | Kostenlos (Basisplan) |
| Dependency Updates | [Dependabot](https://github.com/dependabot) | ✅ Aktiv | Kostenlos |
| Compliance-Management | [Vanta](https://www.vanta.com/) / [Drata](https://drata.com/) | Nicht benötigt | Ab ~10.000 €/Jahr |
| Penetrationstest | Externer Dienstleister | Ausstehend | Ab ~3.000 €/Test |

---

## 6. Kosten-Schätzung

| Maßnahme | Geschätzte Kosten | Status |
|---|---|---|
| Interne Vorbereitung (Richtlinien, Prozesse) | 40–80 Personenstunden | ✅ Abgeschlossen |
| ISO 27001 Beratung + Audit | 15.000–30.000 € | Ausstehend |
| SOC 2 Type I Audit | 20.000–40.000 € | Ausstehend |
| SOC 2 Type II Audit | 30.000–60.000 € | Ausstehend |
| Jährliche Wartung (Re-Audits) | 10.000–20.000 €/Jahr | Ausstehend |

> **Empfehlung:** Die internen Maßnahmen (Richtlinien, Prozesse, technische Controls) sind abgeschlossen.
> Als nächstes die manuellen Schritte (Abschnitt 4, "Manuelle Schritte") erledigen, dann die
> Gap-Analyse angehen. Formale Zertifizierungen lohnen sich primär, wenn Kunden diese explizit
> verlangen oder wenn sensible Daten verarbeitet werden, die über Kontaktformulare hinausgehen.
