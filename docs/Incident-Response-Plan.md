# Incident-Response-Plan

**FIECON Germany Co. KG**

| Feld | Wert |
|------|------|
| Version | 1.0 |
| Gültig ab | 2026-02-13 |
| Verantwortlich | IT-Verantwortlicher |
| Nächste Überprüfung | 2027-02-13 |

---

## 1. Zweck

Dieser Plan beschreibt das Vorgehen bei Sicherheitsvorfällen (Security Incidents), die die Webplattform, den Server oder die Daten von FIECON betreffen. Ziel ist eine schnelle, koordinierte und nachvollziehbare Reaktion.

---

## 2. Geltungsbereich

- Webplattform fiecon-consulting.eu
- Produktionsserver 217.154.23.84
- GitHub-Repository und CI/CD-Pipeline
- Kontaktformular-Daten (personenbezogene Daten)
- Monitoring-Dienste (Sentry, UptimeRobot)

---

## 3. Incident-Klassifizierung

| Schweregrad | Beschreibung | Reaktionszeit |
|------------|-------------|---------------|
| **Kritisch** | Datenleck, Server-Kompromittierung, aktiver Angriff | Sofort (< 1 Stunde) |
| **Hoch** | Website nicht erreichbar, Datenintegrität gefährdet | < 4 Stunden |
| **Mittel** | Sicherheitslücke entdeckt (nicht ausgenutzt), erhöhte Fehlerrate | < 24 Stunden |
| **Niedrig** | Fehlkonfiguration, nicht-kritischer Bug, Warnung | < 1 Woche |

---

## 4. Kontakte und Eskalation

> **Hinweis:** Kontaktdaten mit tatsächlichen Ansprechpartnern ausfüllen.

| Rolle | Name | Kontakt | Erreichbarkeit |
|-------|------|---------|----------------|
| **Incident Manager** | *[Name eintragen]* | *[E-Mail/Telefon]* | Geschäftszeiten |
| **IT-Verantwortlicher** | *[Name eintragen]* | *[E-Mail/Telefon]* | Geschäftszeiten |
| **Geschäftsführung** | *[Name eintragen]* | *[E-Mail/Telefon]* | Bei Schweregrad Kritisch/Hoch |

### Externe Kontakte

| Dienst | Kontakt |
|--------|---------|
| Hosting-Provider | *[Support-Kontakt eintragen]* |
| Domain-Registrar | *[Support-Kontakt eintragen]* |
| Datenschutzbehörde (DSGVO) | Hamburgischer Beauftragter für Datenschutz |

---

## 5. Incident-Response-Phasen

### Phase 1: Erkennung und Meldung

**Erkennungsquellen:**
- Sentry-Alerts (Laufzeitfehler, unerwartete Exceptions)
- UptimeRobot-Alerts (Downtime)
- Manuelle Meldung (E-Mail an Sicherheitskontakt, siehe [SECURITY.md](SECURITY.md))
- GitHub Dependabot/Security-Alerts
- Manuelle Code-Reviews

**Meldung:**
1. Vorfall in einem Incident-Log dokumentieren (Zeitpunkt, Beschreibung, Quelle)
2. Schweregrad einschätzen (siehe Tabelle oben)
3. Incident Manager informieren
4. Bei Schweregrad Kritisch/Hoch: Geschäftsführung sofort informieren

### Phase 2: Eindämmung

**Sofortmaßnahmen (je nach Vorfall):**

| Szenario | Maßnahme |
|----------|----------|
| Server kompromittiert | SSH-Zugang sperren, Server isolieren |
| Website defaced/manipuliert | Letzte bekannte gute Version deployen |
| Datenleck (Kontaktdaten) | Betroffene API-Endpoints deaktivieren |
| DDoS/hohe Last | Firewall-Regeln anpassen, ggf. Provider kontaktieren |
| Dependency-Schwachstelle | Betroffene Dependency patchen/entfernen, Hotfix deployen |

**Generelle Eindämmung:**
```bash
# Website in Wartungsmodus (PM2 stoppen)
ssh root@217.154.23.84 'pm2 stop fiecon'

# Notfall: Firewall für alle außer SSH sperren
ssh root@217.154.23.84 'ufw deny 80/tcp && ufw deny 443/tcp'

# Passwörter/Keys rotieren falls kompromittiert
```

### Phase 3: Untersuchung

1. **Ursachenanalyse:**
   - Server-Logs prüfen: `ssh root@217.154.23.84 'pm2 logs fiecon --lines 500'`
   - Sentry-Dashboard auf Anomalien prüfen
   - Git-History auf unautorisierte Änderungen prüfen
   - Firewall-Logs: `ssh root@217.154.23.84 'ufw status verbose'`

2. **Auswirkungsanalyse:**
   - Welche Daten/Systeme betroffen?
   - Zeitraum des Vorfalls?
   - Sind personenbezogene Daten betroffen (DSGVO-Meldepflicht)?

3. **Beweissicherung:**
   - Relevante Logs sichern
   - Systemzustand dokumentieren (Screenshots, Konfigurationen)
   - Zeitstempel aller Aktionen notieren

### Phase 4: Behebung

1. Ursache beseitigen (Patch, Config-Änderung, Dependency-Update)
2. Sicherheitsmaßnahmen verstärken falls nötig
3. System wiederherstellen:
   ```bash
   # Backup wiederherstellen (falls nötig)
   tar -xzf /root/backups/fiecon/backup-YYYYMMDD.tar.gz -C /

   # Anwendung neu deployen
   ./deploy.sh

   # Firewall-Regeln wiederherstellen
   ssh root@217.154.23.84 'ufw allow 80/tcp && ufw allow 443/tcp'
   ```
4. Funktionalität verifizieren (Health-Check, manuelle Tests)
5. Monitoring auf Wiederholung beobachten

### Phase 5: Nachbereitung (Lessons Learned)

1. **Incident-Report erstellen:**
   - Zeitlinie des Vorfalls
   - Ursache und Auswirkungen
   - Ergriffene Maßnahmen
   - Verbesserungsvorschläge

2. **Maßnahmen ableiten:**
   - Richtlinien/Prozesse aktualisieren
   - Technische Maßnahmen implementieren
   - Schulungsbedarf identifizieren

3. **DSGVO-Meldepflicht prüfen:**
   - Bei Verletzung personenbezogener Daten: Meldung an Datenschutzbehörde innerhalb von 72 Stunden
   - Bei hohem Risiko für Betroffene: Betroffene Personen informieren

4. **Dokumentation aktualisieren:**
   - CHANGELOG.md aktualisieren
   - Diesen Plan bei Bedarf anpassen
   - Zugriffsmatrix überprüfen

---

## 6. Incident-Log-Vorlage

| Feld | Wert |
|------|------|
| **Incident-ID** | INC-YYYY-NNN |
| **Datum/Uhrzeit** | |
| **Gemeldet von** | |
| **Schweregrad** | Kritisch / Hoch / Mittel / Niedrig |
| **Betroffene Systeme** | |
| **Beschreibung** | |
| **Sofortmaßnahmen** | |
| **Ursache** | |
| **Behebung** | |
| **Lessons Learned** | |
| **Abgeschlossen am** | |

---

## Referenzen

- [SECURITY.md](SECURITY.md) — Vulnerability Disclosure Policy
- [DEPLOYMENT.md](DEPLOYMENT.md) — Server-Sicherheit, Backup-Strategie
- [Informationssicherheitsrichtlinie](Informationssicherheitsrichtlinie.md)
- [Zugriffsmatrix](Zugriffsmatrix.md)
