# Zugriffsmatrix

**FIECON Germany Co. KG**

| Feld | Wert |
|------|------|
| Version | 1.0 |
| Gültig ab | 2026-02-13 |
| Verantwortlich | IT-Verantwortlicher |
| Nächste Überprüfung | 2026-08-13 (halbjährlich) |

---

## 1. Zweck

Diese Matrix dokumentiert, welche Personen und Rollen auf welche Systeme zugreifen können. Sie dient der Zugriffskontrolle gemäß dem Need-to-know-Prinzip.

---

## 2. Systemübersicht

| System | Beschreibung | Kritikalität |
|--------|-------------|-------------|
| **Produktionsserver** | 217.154.23.84 (Ubuntu, PM2, Nginx) | Hoch |
| **GitHub-Repository** | Quellcode, CI/CD-Pipeline | Hoch |
| **DNS-Verwaltung** | Domain fiecon-consulting.eu | Hoch |
| **Sentry** | Error Monitoring (sentry.io) | Mittel |
| **UptimeRobot** | Uptime-Monitoring | Niedrig |
| **SMTP-Server** | E-Mail-Versand (Kontaktformular) | Mittel |

---

## 3. Rollen

| Rolle | Beschreibung |
|-------|-------------|
| **Admin** | Vollzugriff, Konfiguration, Benutzerverwaltung |
| **Entwickler** | Code-Änderungen, Deployment, Logs einsehen |
| **Beobachter** | Nur lesender Zugriff (Dashboards, Logs) |

---

## 4. Zugriffsmatrix

| System | Admin | Entwickler | Beobachter |
|--------|-------|-----------|-----------|
| **Server SSH** | Root-Zugang (Key) | — | — |
| **Server Deployment** | `./deploy.sh` | `./deploy.sh` | — |
| **Server Logs** | PM2 logs, Syslog | PM2 logs | — |
| **GitHub Repository** | Admin (Settings, Secrets) | Write (Push, PR) | Read |
| **GitHub Actions** | Konfiguration | Trigger, Logs einsehen | Logs einsehen |
| **GitHub Secrets** | Erstellen/Ändern | — | — |
| **DNS-Verwaltung** | Vollzugriff | — | — |
| **Sentry** | Owner/Admin | Member (Errors einsehen) | — |
| **UptimeRobot** | Account-Owner | — | Statuspage |
| **SMTP-Zugangsdaten** | .env auf Server | — | — |

---

## 5. Aktuelle Zugriffsinhaber

> **Hinweis:** Diese Tabelle muss mit den tatsächlichen Personen/Accounts ausgefüllt werden.

| Person | Rolle | Server SSH | GitHub | DNS | Sentry | UptimeRobot |
|--------|-------|-----------|--------|-----|--------|-------------|
| *[Name eintragen]* | Admin | ✅ | Admin | ✅ | Owner | ✅ |
| *[Name eintragen]* | Entwickler | — | Write | — | Member | — |

---

## 6. Authentifizierungsmethoden

| System | Methode | MFA |
|--------|---------|-----|
| Server SSH | SSH-Key (Ed25519/RSA) | — |
| GitHub | Passwort + 2FA | Empfohlen |
| Sentry | SSO / Passwort | Empfohlen |
| DNS-Provider | Passwort | Empfohlen |
| UptimeRobot | Passwort | Optional |

---

## 7. Prozesse

### Neuen Zugang einrichten
1. Genehmigung durch Admin/Geschäftsführung
2. Minimale Rechte zuweisen (Least Privilege)
3. Diese Matrix aktualisieren
4. Zugangsdaten sicher übermitteln

### Zugang entziehen
1. Accounts deaktivieren/entfernen
2. SSH-Keys vom Server entfernen (`~/.ssh/authorized_keys`)
3. GitHub-Zugriff entziehen
4. Diese Matrix aktualisieren

### Regelmäßige Überprüfung
- **Halbjährlich:** Alle Einträge auf Aktualität prüfen
- **Bei Personalwechsel:** Sofortige Aktualisierung
- **Nach Sicherheitsvorfällen:** Sofortige Überprüfung aller Zugänge

---

## Referenzen

- [Informationssicherheitsrichtlinie](Informationssicherheitsrichtlinie.md)
- [Incident-Response-Plan](Incident-Response-Plan.md)
- [DEPLOYMENT.md](DEPLOYMENT.md) — Server-Sicherheit
