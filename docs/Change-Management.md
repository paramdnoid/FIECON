# Change-Management-Prozess

**FIECON Germany Co. KG**

| Feld | Wert |
|------|------|
| Version | 1.0 |
| Gültig ab | 2026-02-13 |
| Verantwortlich | IT-Verantwortlicher |
| Nächste Überprüfung | 2027-02-13 |

---

## 1. Zweck

Dieser Prozess stellt sicher, dass Änderungen an der Webplattform kontrolliert, nachvollziehbar und qualitätsgesichert durchgeführt werden.

---

## 2. Geltungsbereich

- Quellcode-Änderungen (Features, Bugfixes, Refactoring)
- Konfigurationsänderungen (Server, Nginx, .env)
- Dependency-Updates
- Infrastruktur-Änderungen (DNS, Firewall, SSL)

---

## 3. Änderungsprozess

### 3.1 Entwicklung (Code-Änderungen)

```
Feature Branch → Pull Request → CI-Pipeline → Review → Merge → Deploy
```

1. **Branch erstellen:** Feature-Branch von `main` ableiten
2. **Entwickeln:** Änderungen implementieren, Tests schreiben
3. **Pull Request erstellen:** Beschreibung der Änderung, Verweis auf Issue/Ticket
4. **CI-Pipeline läuft automatisch:**
   - ESLint (0 Errors, 0 Warnings)
   - Tests mit Coverage (>80% Threshold)
   - Production Build
   - Security Audit (`pnpm audit`)
   - SBOM-Generierung
5. **Code Review:** Mindestens eine Freigabe vor Merge
6. **Merge:** Squash & Merge in `main`
7. **Deploy:** `./deploy.sh` ausführen (siehe Deployment-Checkliste)

### 3.2 Dependency-Updates

1. Dependabot erstellt automatisch Pull Requests
2. CI-Pipeline validiert Kompatibilität
3. CHANGELOG.md aktualisieren
4. Merge und Deploy wie oben

### 3.3 Konfigurationsänderungen (Server)

| Änderung | Prozess |
|----------|---------|
| .env-Änderung | Direkt auf Server, Dokumentation in DEPLOYMENT.md |
| Nginx-Config | Lokale Änderung in `scripts/`, Deploy via SCP, `nginx -t` vor Reload |
| Firewall (UFW) | Über `server-setup.sh` oder manuell, Dokumentation in DEPLOYMENT.md |
| DNS-Änderung | Beim Registrar, 48h DNS-Propagation einplanen |

---

## 4. Deployment-Checkliste

Vor jedem Deployment folgende Punkte prüfen:

- [ ] Alle CI-Checks auf `main` grün (Lint, Tests, Build)
- [ ] CHANGELOG.md aktualisiert
- [ ] Keine offenen Security-Advisories für betroffene Dependencies
- [ ] Bei Breaking Changes: Rollback-Plan vorbereiten
- [ ] `.env`-Änderungen auf dem Server vorgenommen (falls nötig)

**Deployment ausführen:**

```bash
# Standard-Deployment
./deploy.sh

# Nur Config (ohne Build)
./deploy.sh --skip-build
```

**Nach dem Deployment:**

- [ ] Health-Check: `curl https://www.fiecon-consulting.eu/api/health`
- [ ] Website manuell prüfen (Startseite, Kontaktformular, Sprachen)
- [ ] Sentry auf neue Fehler prüfen
- [ ] UptimeRobot-Status prüfen

---

## 5. Rollback-Verfahren

Bei Problemen nach einem Deployment:

```bash
# 1. Letzten funktionierenden Commit auf main finden
git log --oneline -10

# 2. Revert-Commit erstellen
git revert HEAD
git push origin main

# 3. Erneut deployen
./deploy.sh
```

Alternativ (Notfall):

```bash
# Backup wiederherstellen
ssh root@217.154.23.84 'pm2 stop fiecon'
# Vorherige Version aus Backup deployen
```

---

## 6. Notfalländerungen (Emergency Changes)

Bei kritischen Sicherheitsvorfällen darf der Prozess abgekürzt werden:

1. Hotfix direkt auf `main` pushen (ohne PR)
2. CI-Pipeline muss trotzdem grün sein
3. Sofort deployen
4. **Nachträglich:** PR erstellen, Review durchführen, Incident dokumentieren

---

## 7. Dokumentation

Alle Änderungen werden nachvollziehbar dokumentiert:

| Quelle | Inhalt |
|--------|--------|
| **Git-History** | Alle Code-Änderungen mit Commit-Messages |
| **Pull Requests** | Beschreibung, Review-Kommentare, CI-Ergebnisse |
| **CHANGELOG.md** | Nutzersichtbare Änderungen (Keep a Changelog) |
| **DEPLOYMENT.md** | Infrastruktur- und Konfigurationsänderungen |

---

## Referenzen

- [DEPLOYMENT.md](DEPLOYMENT.md) — Deploy-Prozess und Server-Setup
- [CHANGELOG.md](CHANGELOG.md) — Änderungsprotokoll
- [Informationssicherheitsrichtlinie](Informationssicherheitsrichtlinie.md)
- [CI-Pipeline](../.github/workflows/ci.yml)
