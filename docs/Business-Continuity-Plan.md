# Business Continuity Plan (BCP)

**FIECON Germany Co. KG**

| Feld | Wert |
|------|------|
| Version | 1.0 |
| Gültig ab | 2026-02-13 |
| Verantwortlich | Geschäftsführung FIECON |
| Nächste Überprüfung | 2027-02-13 |

---

## 1. Zweck

Dieser Plan stellt sicher, dass die FIECON-Webplattform nach einem Störfall schnellstmöglich wiederhergestellt werden kann. Er definiert Recovery-Ziele, Verantwortlichkeiten und konkrete Wiederherstellungsabläufe.

---

## 2. Recovery-Ziele

| Ziel | Wert | Beschreibung |
|------|------|-------------|
| **RTO** (Recovery Time Objective) | 4 Stunden | Maximale Zeit bis zur Wiederherstellung des Betriebs |
| **RPO** (Recovery Point Objective) | 24 Stunden | Maximaler akzeptabler Datenverlust (bezogen auf Backup-Frequenz) |

---

## 3. Kritische Systeme und Prioritäten

| Priorität | System | RTO | Wiederherstellungsmethode |
|-----------|--------|-----|--------------------------|
| 1 | Webplattform (fiecon-consulting.eu) | 2h | Re-Deployment aus GitHub |
| 2 | Kontaktformular (E-Mail-Versand) | 4h | .env + SMTP-Config wiederherstellen |
| 3 | SSL-Zertifikat | 4h | Certbot Renewal oder Neuausstellung |
| 4 | Monitoring (Sentry, UptimeRobot) | 8h | Rekonfiguration |

---

## 4. Störfallszenarien

### 4.1 Server-Ausfall (Hardware/Provider)

**Ursache:** Hardwaredefekt, Provider-Problem, Netzwerkausfall

**Wiederherstellung:**
1. UptimeRobot-Alert empfangen
2. Provider kontaktieren, Status prüfen
3. Falls Server nicht wiederherstellbar: neuen Server aufsetzen
   ```bash
   # Auf neuem Server:
   bash scripts/server-setup.sh
   
   # .env aus Backup wiederherstellen
   tar -xzf backup-YYYYMMDD.tar.gz -C /
   
   # Anwendung deployen
   ./deploy.sh
   
   # DNS auf neue IP umstellen (falls nötig)
   ```
4. Health-Check verifizieren
5. Monitoring-Dienste aktualisieren (falls neue IP)

**Geschätzte Dauer:** 2–4 Stunden

### 4.2 Anwendungsfehler (Crash, Fehlerhaftes Deployment)

**Ursache:** Bug in neuem Release, fehlerhafte Konfiguration

**Wiederherstellung:**
1. Sentry-Alert oder UptimeRobot-Alert empfangen
2. PM2-Logs prüfen: `ssh root@217.154.23.84 'pm2 logs fiecon --lines 100'`
3. Rollback auf letzten funktionierenden Stand:
   ```bash
   git revert HEAD
   git push origin main
   ./deploy.sh
   ```
4. Alternativ: vorherigen Commit direkt deployen
5. Ursache analysieren und Fix entwickeln

**Geschätzte Dauer:** 30 Minuten – 2 Stunden

### 4.3 Datenverlust (.env, Konfiguration)

**Ursache:** Versehentliches Löschen, fehlerhafte Änderung

**Wiederherstellung:**
1. Backup identifizieren: `ls /root/backups/fiecon/`
2. Wiederherstellen:
   ```bash
   tar -xzf /root/backups/fiecon/backup-YYYYMMDD.tar.gz -C /
   pm2 restart fiecon
   systemctl reload nginx
   ```

**Geschätzte Dauer:** 15–30 Minuten

### 4.4 DNS-Ausfall

**Ursache:** Registrar-Problem, fehlerhafte DNS-Änderung

**Wiederherstellung:**
1. DNS-Status prüfen (z.B. via `dig fiecon-consulting.eu`)
2. Beim Registrar korrigieren
3. Propagation abwarten (bis zu 48 Stunden)
4. Workaround: direkte IP-Kommunikation für kritische Stakeholder

**Geschätzte Dauer:** Abhängig von DNS-Propagation

### 4.5 GitHub-Ausfall

**Ursache:** GitHub-Service-Störung

**Wiederherstellung:**
1. GitHub Status prüfen (status.github.com)
2. Lokale Git-Kopien nutzen (alle Entwickler haben vollständigen Klon)
3. Deployment aus lokalem Repository möglich (`./deploy.sh`)
4. CI/CD-Pipeline erst nach GitHub-Recovery verfügbar

**Geschätzte Dauer:** Abhängig von GitHub (typisch: < 2 Stunden)

---

## 5. Backup-Strategie

### Automatische Backups

| Was | Wie | Häufigkeit | Aufbewahrung |
|-----|-----|-----------|-------------|
| Server-Konfiguration (.env, Nginx, PM2) | Cron-Job: tar-Archiv | Täglich 03:00 Uhr | 30 Tage |
| Quellcode | Git (GitHub) | Bei jedem Push | Unbegrenzt |
| CI-Artefakte (Coverage, SBOM) | GitHub Actions Artifacts | Bei jedem CI-Run | 14–30 Tage |

### Backup-Verifizierung

- **Monatlich:** Stichprobenartig Backup entpacken und Inhalt prüfen
- **Vierteljährlich:** Vollständigen Restore-Test auf Test-Umgebung durchführen

---

## 6. Kommunikationsplan

### Interne Kommunikation

| Schweregrad | Informiert werden | Kanal |
|------------|-------------------|-------|
| Kritisch | Geschäftsführung, IT-Team | Telefon/Sofort |
| Hoch | IT-Verantwortlicher | E-Mail/Chat |
| Mittel | IT-Team | E-Mail |

### Externe Kommunikation

| Zielgruppe | Wann | Kanal |
|-----------|------|-------|
| Website-Besucher | Bei Ausfall > 1 Stunde | Statuspage (optional) |
| Kunden | Bei Ausfall > 4 Stunden | E-Mail |
| Hosting-Provider | Bei Server-Problemen | Support-Ticket |

---

## 7. Test und Übung

| Aktivität | Häufigkeit | Verantwortlich |
|-----------|-----------|----------------|
| Backup-Restore-Test | Vierteljährlich | IT-Verantwortlicher |
| Deployment-Rollback-Test | Halbjährlich | IT-Verantwortlicher |
| BCP-Review | Jährlich | Geschäftsführung |
| Notfallkontakte aktualisieren | Halbjährlich | IT-Verantwortlicher |

---

## 8. Abhängigkeiten von Drittanbietern

| Dienst | Auswirkung bei Ausfall | Alternative |
|--------|----------------------|-------------|
| Hosting-Provider | Website nicht erreichbar | Neuen Server aufsetzen |
| GitHub | Kein CI/CD, kein Remote-Repo | Lokale Git-Kopien |
| SMTP-Provider | Kontaktformular funktioniert nicht | Alternativen SMTP-Server |
| Sentry | Kein Error-Monitoring | PM2-Logs als Fallback |
| UptimeRobot | Kein Uptime-Monitoring | Manuell prüfen |
| Let's Encrypt | SSL-Erneuerung fehlschlägt | Alternatives Zertifikat |

---

## Referenzen

- [DEPLOYMENT.md](DEPLOYMENT.md) — Deployment-Prozess, Backup-Strategie, Server-Sicherheit
- [Incident-Response-Plan](Incident-Response-Plan.md)
- [Informationssicherheitsrichtlinie](Informationssicherheitsrichtlinie.md)
- [Risikoanalyse](Risikoanalyse.md)
