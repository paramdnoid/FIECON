# Acceptable Use Policy (Nutzungsrichtlinie)

**FIECON Germany Co. KG**

| Feld | Wert |
|------|------|
| Version | 1.0 |
| Gültig ab | 2026-02-13 |
| Verantwortlich | Geschäftsführung FIECON |
| Nächste Überprüfung | 2027-02-13 |

---

## 1. Zweck

Diese Richtlinie regelt die akzeptable Nutzung der IT-Systeme, Accounts und Zugänge von FIECON durch Mitarbeitende und externe Dienstleister.

---

## 2. Geltungsbereich

Diese Richtlinie gilt für alle Personen mit Zugang zu:

- Produktionsserver (SSH)
- GitHub-Repository
- DNS-Verwaltung
- Monitoring-Dienste (Sentry, UptimeRobot)
- E-Mail-Accounts im Zusammenhang mit FIECON

---

## 3. Allgemeine Grundsätze

### 3.1 Verantwortungsvoller Umgang
- IT-Systeme werden ausschließlich für geschäftliche Zwecke genutzt
- Zugangsdaten sind persönlich und dürfen nicht weitergegeben werden
- Bei Verdacht auf Kompromittierung: sofortige Meldung an den IT-Verantwortlichen

### 3.2 Passwörter und Authentifizierung
- Starke, einzigartige Passwörter für jeden Dienst verwenden
- Zwei-Faktor-Authentifizierung (2FA) wo immer möglich aktivieren, insbesondere für:
  - GitHub
  - Sentry
  - DNS-Provider
- Passwort-Manager wird empfohlen
- SSH-Keys mit Passphrase schützen

### 3.3 Geräte und Software
- Betriebssysteme und Software regelmäßig aktualisieren
- Keine ungeprüfte Software auf Geräten installieren, die Zugang zu FIECON-Systemen haben
- Bildschirmsperre bei Verlassen des Arbeitsplatzes aktivieren

---

## 4. Servernutzung

### Erlaubt
- Deployment über dokumentierten Prozess (`./deploy.sh`)
- Logs einsehen (`pm2 logs`)
- Statusprüfungen (`pm2 status`, `ufw status`)
- Geplante Wartungsarbeiten

### Nicht erlaubt
- Installation nicht autorisierter Software
- Änderung von Firewall-Regeln ohne Dokumentation
- Weitergabe von SSH-Keys
- Nutzung des Servers für persönliche Zwecke
- Deaktivierung von Sicherheitsmaßnahmen (UFW, SSH-Hardening)

---

## 5. GitHub-Nutzung

### Erlaubt
- Code-Änderungen über Pull Requests
- Issue-Tracking und Diskussionen
- Code-Reviews

### Nicht erlaubt
- Force-Push auf `main`
- Deaktivierung von Branch-Protection-Rules
- Veröffentlichung von Secrets/Credentials im Code
- Änderungen an CI/CD ohne Absprache

---

## 6. Datenumgang

### Vertrauliche Daten
- SMTP-Zugangsdaten, SSH-Keys, API-Tokens: nur verschlüsselt speichern und übertragen
- Niemals in Chat, E-Mail oder Code-Kommentaren im Klartext teilen
- `.env`-Dateien und Secrets: nicht ins Git-Repository committen

### Personenbezogene Daten
- Kontaktformular-Daten nur für den vorgesehenen Zweck nutzen
- DSGVO-Grundsätze beachten (Datensparsamkeit, Zweckbindung)
- Bei unbeabsichtigtem Zugriff auf personenbezogene Daten: IT-Verantwortlichen informieren

---

## 7. Meldepflichten

Folgende Ereignisse sind **sofort** dem IT-Verantwortlichen zu melden:

- Verlust oder Diebstahl eines Geräts mit FIECON-Zugang
- Verdacht auf kompromittierte Zugangsdaten
- Phishing-Versuche oder verdächtige E-Mails
- Ungewöhnliches Verhalten von Systemen
- Unbeabsichtigter Zugriff auf vertrauliche Daten

---

## 8. Verstöße

Verstöße gegen diese Richtlinie können folgende Konsequenzen haben:

1. Gespräch und Ermahnung
2. Einschränkung von Zugriffsrechten
3. Arbeitsrechtliche Maßnahmen (bei schwerwiegenden Verstößen)

---

## 9. Bestätigung

> Ich habe die Acceptable Use Policy gelesen und verstanden. Ich verpflichte mich, die darin beschriebenen Regeln einzuhalten.
>
> Name: ___________________________
>
> Datum: ___________________________
>
> Unterschrift: ___________________________

---

## Referenzen

- [Informationssicherheitsrichtlinie](Informationssicherheitsrichtlinie.md)
- [Zugriffsmatrix](Zugriffsmatrix.md)
- [Incident-Response-Plan](Incident-Response-Plan.md)
- [Change-Management](Change-Management.md)
