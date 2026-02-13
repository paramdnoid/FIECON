# Informationssicherheitsrichtlinie

**FIECON Germany Co. KG (Fiegler Consulting KG)**

| Feld | Wert |
|------|------|
| Version | 1.0 |
| Gültig ab | 2026-02-13 |
| Verantwortlich | Geschäftsführung FIECON |
| Nächste Überprüfung | 2027-02-13 |

---

## 1. Zweck und Geltungsbereich

Diese Richtlinie definiert die Grundsätze, Verantwortlichkeiten und Mindestanforderungen für die Informationssicherheit bei FIECON Germany Co. KG.

### Geltungsbereich (Scope)

Die Richtlinie gilt für:

- **Webplattform:** fiecon-consulting.eu (Next.js-Anwendung)
- **Server-Infrastruktur:** Produktionsserver 217.154.23.84
- **Kontaktformular-Daten:** Name, E-Mail-Adresse, Nachricht
- **Entwicklungsumgebung:** GitHub-Repository, CI/CD-Pipeline
- **Monitoring-Dienste:** Sentry (Error-Reporting), UptimeRobot
- **Alle Mitarbeitenden** und Dienstleister mit Zugang zu oben genannten Systemen

---

## 2. Grundsätze

### 2.1 Vertraulichkeit
Informationen sind nur den Personen zugänglich, die sie für ihre Arbeit benötigen (Need-to-know-Prinzip).

### 2.2 Integrität
Daten und Systeme werden vor unbefugter oder unbeabsichtigter Veränderung geschützt.

### 2.3 Verfügbarkeit
Systeme und Daten stehen den berechtigten Nutzern bei Bedarf zur Verfügung. Recovery Time Objective (RTO): 4 Stunden, Recovery Point Objective (RPO): 24 Stunden.

---

## 3. Verantwortlichkeiten

| Rolle | Verantwortung |
|-------|---------------|
| **Geschäftsführung** | Gesamtverantwortung für Informationssicherheit, Freigabe von Richtlinien |
| **IT-Verantwortlicher** | Technische Umsetzung, Überwachung, Incident Response |
| **Alle Mitarbeitenden** | Einhaltung der Richtlinien, Meldung von Sicherheitsvorfällen |

---

## 4. Sicherheitsmaßnahmen

### 4.1 Zugangskontrolle
- Server-Zugang ausschließlich per SSH-Key (Passwort-Authentifizierung deaktiviert)
- GitHub-Repository mit Zugriffsbeschränkung
- Regelmäßige Überprüfung der Zugriffsrechte (siehe [Zugriffsmatrix](Zugriffsmatrix.md))

### 4.2 Netzwerksicherheit
- UFW-Firewall auf dem Server: nur Ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
- HTTPS-Enforcement mit HSTS (1 Jahr)
- Content Security Policy (Nonce-basiert)
- Weitere Security-Headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

### 4.3 Anwendungssicherheit
- Eingabevalidierung und HTML-Escaping (Kontaktformular)
- Rate Limiting für API-Endpoints
- TypeScript Strict Mode
- Automatisierte Tests (>400 Tests, 80% Coverage-Threshold)
- ESLint mit 0 Errors/Warnings

### 4.4 Abhängigkeitsverwaltung
- Automatische Dependency-Updates via Dependabot
- Security-Audit in CI-Pipeline (`pnpm audit`)
- SBOM-Generierung (CycloneDX) bei jedem Build
- Vierteljährliche manuelle Dependency-Reviews

### 4.5 Monitoring und Logging
- Error Monitoring via Sentry (Client, Server, Edge)
- Uptime-Monitoring via UptimeRobot (Health-Endpoint `/api/health`)
- PM2 Prozess-Logs auf dem Server

### 4.6 Datensicherung
- Tägliches automatisches Backup (Cron-Job, 30 Tage Aufbewahrung)
- Backup-Umfang: .env, Nginx-Config, PM2-Config, SSL-Zertifikate
- Wiederherstellungsprozedur dokumentiert in DEPLOYMENT.md

---

## 5. Umgang mit Sicherheitsvorfällen

Sicherheitsvorfälle werden gemäß dem [Incident-Response-Plan](Incident-Response-Plan.md) behandelt.

Externe Sicherheitslücken-Meldungen folgen dem Prozess in [SECURITY.md](SECURITY.md).

---

## 6. Änderungsmanagement

Alle Änderungen an der Webplattform erfolgen über einen kontrollierten Prozess:
- Pull-Request-basierter Workflow
- CI/CD-Pipeline als Quality-Gate (Lint, Tests, Build)
- Dokumentierte Deployment-Prozedur

Details siehe [Change-Management](Change-Management.md).

---

## 7. Schulung und Sensibilisierung

- Neue Mitarbeitende erhalten Einweisung in diese Richtlinie
- Jährliche Überprüfung und Auffrischung
- Nutzungsrichtlinien in der [Acceptable Use Policy](Acceptable-Use-Policy.md)

---

## 8. Überprüfung und Aktualisierung

Diese Richtlinie wird mindestens einmal jährlich überprüft und bei Bedarf aktualisiert. Änderungen werden im CHANGELOG dokumentiert.

---

## Referenzen

- [Zugriffsmatrix](Zugriffsmatrix.md)
- [Incident-Response-Plan](Incident-Response-Plan.md)
- [Risikoanalyse](Risikoanalyse.md)
- [Change-Management](Change-Management.md)
- [Business Continuity Plan](Business-Continuity-Plan.md)
- [Acceptable Use Policy](Acceptable-Use-Policy.md)
- [SECURITY.md](SECURITY.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [COMPLIANCE.md](COMPLIANCE.md)
