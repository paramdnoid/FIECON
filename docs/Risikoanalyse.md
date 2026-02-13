# Risikoanalyse

**FIECON Germany Co. KG**

| Feld | Wert |
|------|------|
| Version | 1.0 |
| Gültig ab | 2026-02-13 |
| Verantwortlich | IT-Verantwortlicher |
| Nächste Überprüfung | 2027-02-13 |

---

## 1. Zweck

Diese Risikoanalyse identifiziert und bewertet Bedrohungen für die IT-Systeme und Daten von FIECON. Sie bildet die Grundlage für die Priorisierung von Sicherheitsmaßnahmen.

---

## 2. Asset-Register

### 2.1 Informations-Assets

| Asset | Beschreibung | Klassifizierung | Verantwortlich |
|-------|-------------|-----------------|----------------|
| Kontaktformular-Daten | Name, E-Mail, Nachricht von Website-Besuchern | Personenbezogen | IT-Verantwortlicher |
| SMTP-Zugangsdaten | E-Mail-Server-Credentials in .env | Vertraulich | Admin |
| SSH-Keys | Server-Zugangsschlüssel | Vertraulich | Admin |
| GitHub-Secrets | CI/CD-Secrets, Sentry-Token | Vertraulich | Admin |
| Quellcode | Next.js-Anwendung im GitHub-Repository | Intern | Entwickler |
| Übersetzungsdateien | 44 Locale-JSON-Dateien | Öffentlich | Entwickler |

### 2.2 System-Assets

| Asset | Typ | Standort | Kritikalität |
|-------|-----|----------|-------------|
| Produktionsserver | VPS (Ubuntu) | 217.154.23.84 | Hoch |
| Webplattform | Next.js App (PM2) | Server | Hoch |
| Nginx Reverse Proxy | Webserver | Server | Hoch |
| GitHub-Repository | Versionskontrolle | github.com | Hoch |
| GitHub Actions | CI/CD | github.com | Mittel |
| Sentry | Error Monitoring | sentry.io | Mittel |
| UptimeRobot | Uptime Monitoring | uptimerobot.com | Niedrig |
| Domain/DNS | fiecon-consulting.eu | Registrar | Hoch |

---

## 3. Bewertungsmethodik

### Eintrittswahrscheinlichkeit

| Stufe | Beschreibung |
|-------|-------------|
| **1 — Niedrig** | Unwahrscheinlich (< 1x pro Jahr) |
| **2 — Mittel** | Möglich (1–3x pro Jahr) |
| **3 — Hoch** | Wahrscheinlich (> 3x pro Jahr) |

### Auswirkung

| Stufe | Beschreibung |
|-------|-------------|
| **1 — Gering** | Kurzfristige Beeinträchtigung, kein Datenverlust |
| **2 — Mittel** | Mehrstündiger Ausfall, begrenzter Datenverlust |
| **3 — Schwer** | Datenleck, längerer Ausfall, Reputationsschaden |

### Risikobewertung (Wahrscheinlichkeit x Auswirkung)

|  | Auswirkung 1 | Auswirkung 2 | Auswirkung 3 |
|--|-------------|-------------|-------------|
| **Wahrsch. 3** | 3 (Mittel) | 6 (Hoch) | 9 (Kritisch) |
| **Wahrsch. 2** | 2 (Niedrig) | 4 (Mittel) | 6 (Hoch) |
| **Wahrsch. 1** | 1 (Niedrig) | 2 (Niedrig) | 3 (Mittel) |

---

## 4. Risikoregister

### 4.1 Technische Risiken

| ID | Bedrohung | Asset | W | A | Risiko | Bestehende Maßnahmen | Restrisko |
|----|-----------|-------|---|---|--------|----------------------|-----------|
| T1 | Ungepatchte Dependency mit Schwachstelle | Webplattform | 3 | 2 | **6 (Hoch)** | Dependabot, pnpm audit in CI, SBOM | Mittel |
| T2 | Server-Kompromittierung (SSH-Brute-Force) | Server | 2 | 3 | **6 (Hoch)** | UFW Firewall, SSH-Key-only, PermitRootLogin prohibit-password | Niedrig |
| T3 | DDoS-Angriff auf Website | Webplattform | 2 | 2 | **4 (Mittel)** | Rate Limiting (API), Nginx | Mittel |
| T4 | XSS/Injection über Kontaktformular | Webplattform | 2 | 2 | **4 (Mittel)** | Input Validation, HTML-Escaping, CSP (Nonce) | Niedrig |
| T5 | SSL-Zertifikat abgelaufen | Webplattform | 1 | 2 | **2 (Niedrig)** | Certbot Auto-Renewal | Niedrig |
| T6 | Server-Hardwareausfall | Server | 1 | 3 | **3 (Mittel)** | Tägliches Backup, Restore-Prozedur, Code in GitHub | Niedrig |

### 4.2 Organisatorische Risiken

| ID | Bedrohung | Asset | W | A | Risiko | Bestehende Maßnahmen | Restrisko |
|----|-----------|-------|---|---|--------|----------------------|-----------|
| O1 | Unberechtigter Zugriff auf GitHub | Quellcode, Secrets | 1 | 3 | **3 (Mittel)** | Zugriffsmatrix, 2FA empfohlen | Niedrig |
| O2 | Verlust des Server-SSH-Keys | Server | 1 | 2 | **2 (Niedrig)** | Key-Backup, Hosting-Provider Notfallzugang | Niedrig |
| O3 | Fehlerhaftes Deployment | Webplattform | 2 | 1 | **2 (Niedrig)** | CI-Pipeline, lokaler Build vor Deploy | Niedrig |
| O4 | Wissenskonzentration (Bus-Faktor) | Alle | 2 | 2 | **4 (Mittel)** | Dokumentation (DEPLOYMENT.md, COMPLIANCE.md) | Mittel |

### 4.3 Datenschutz-Risiken

| ID | Bedrohung | Asset | W | A | Risiko | Bestehende Maßnahmen | Restrisko |
|----|-----------|-------|---|---|--------|----------------------|-----------|
| D1 | Datenleck Kontaktformulardaten | Kontaktdaten | 1 | 3 | **3 (Mittel)** | Keine DB (nur E-Mail-Weiterleitung), TLS, Input Validation | Niedrig |
| D2 | SMTP-Zugangsdaten kompromittiert | SMTP-Credentials | 1 | 2 | **2 (Niedrig)** | .env Datei chmod 600, nicht im Repository | Niedrig |
| D3 | Unzureichende Cookie-Consent-Umsetzung | Website-Besucher | 2 | 1 | **2 (Niedrig)** | Nur Session-Cookie für Locale, keine Tracking-Cookies | Niedrig |

---

## 5. Risikomatrix-Übersicht

| Risikostufe | Anzahl | IDs |
|-------------|--------|-----|
| **Kritisch (7–9)** | 0 | — |
| **Hoch (5–6)** | 2 | T1, T2 |
| **Mittel (3–4)** | 4 | T3, T4, T6, O4 |
| **Niedrig (1–2)** | 6 | T5, O1, O2, O3, D1, D2, D3 |

---

## 6. Handlungsbedarf

### Hohe Risiken (Maßnahmen bereits umgesetzt)

| Risiko | Empfehlung | Status |
|--------|-----------|--------|
| T1 (Dependencies) | Snyk ergänzen, vierteljährliche Reviews | Teilweise umgesetzt |
| T2 (Server-SSH) | UFW + SSH-Hardening | Umgesetzt (server-setup.sh) |

### Mittlere Risiken

| Risiko | Empfehlung | Status |
|--------|-----------|--------|
| T3 (DDoS) | Nginx Rate Limiting prüfen, ggf. CDN/Cloudflare | Offen |
| T4 (XSS/Injection) | Regelmäßiger Penetrationstest | Offen (kostenpflichtig) |
| T6 (Hardware) | Off-Site-Backup einrichten | Optional |
| O4 (Bus-Faktor) | Weitere Dokumentation, Wissenstransfer | In Arbeit |

---

## 7. Nächste Schritte

1. Risikoregister halbjährlich überprüfen und aktualisieren
2. Neue Assets bei Systemerweiterungen ergänzen
3. Nach Sicherheitsvorfällen: betroffene Risiken neu bewerten
4. Ergebnisse in Management-Review einbringen

---

## Referenzen

- [Informationssicherheitsrichtlinie](Informationssicherheitsrichtlinie.md)
- [Zugriffsmatrix](Zugriffsmatrix.md)
- [Incident-Response-Plan](Incident-Response-Plan.md)
- [COMPLIANCE.md](COMPLIANCE.md)
