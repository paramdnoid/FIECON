# FIECON Deployment

Deployment auf den Server `217.154.23.84` via rsync und PM2.

## Voraussetzungen

- SSH-Zugang zu `root@217.154.23.84`
- Lokal: `rsync`, `ssh`, `pnpm`

## Einmaliges Server-Setup

Vor dem ersten Deploy muss der Server vorbereitet werden:

```bash
# Option A: Script direkt ausführen
ssh root@217.154.23.84 'bash -s' < scripts/server-setup.sh

# Option B: Script hochladen und ausführen
scp scripts/server-setup.sh root@217.154.23.84:/tmp/
ssh root@217.154.23.84 'bash /tmp/server-setup.sh'
```

Das Script installiert und konfiguriert:
- Node.js 20
- pnpm
- PM2
- Erstellt `/var/www/fiecon` und eine `.env`-Vorlage
- UFW-Firewall (Ports 22, 80, 443)
- SSH-Hardening (Passwort-Login deaktiviert)

**Wichtig:** Nach dem Setup die Datei `/var/www/fiecon/.env` auf dem Server bearbeiten und SMTP-Zugangsdaten eintragen (siehe `.env.example`).

## Deploy ausführen

```bash
./deploy.sh
```

Das Script:
1. Baut lokal (zur Verifikation)
2. Synchronisiert den Quellcode per rsync auf den Server
3. Führt auf dem Server aus: `pnpm install`, `pnpm build`, `pm2 restart`

### Nur Config-Änderungen deployen (ohne Build)

```bash
./deploy.sh --skip-build
```

## Nginx + SSL (optional)

Für HTTPS mit Let's Encrypt:

```bash
# Auf dem Server
apt install -y nginx certbot python3-certbot-nginx
cp scripts/nginx-fiecon.conf /etc/nginx/sites-available/fiecon
ln -s /etc/nginx/sites-available/fiecon /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d fiecon-consulting.eu -d www.fiecon-consulting.eu
```

## Nützliche Befehle

| Befehl | Beschreibung |
|--------|--------------|
| `ssh root@217.154.23.84 'pm2 status'` | PM2-Status prüfen |
| `ssh root@217.154.23.84 'pm2 logs fiecon'` | Logs anzeigen |
| `ssh root@217.154.23.84 'pm2 restart fiecon'` | App neu starten |

## Umgebungsvariablen

Die `.env` auf dem Server muss mindestens enthalten:

- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` – für das Kontaktformular
- `CONTACT_TO` – E-Mail-Adresse für eingehende Anfragen

Optional (SEO):

- `SITE_URL` – Basis-URL für robots.txt / Sitemap (Standard: `https://www.fiecon-consulting.eu`)
- `GOOGLE_SITE_VERIFICATION` – Google Search Console Verifizierungscode (Meta-Tag wird nur bei gesetztem Wert ausgegeben)

Optional (Monitoring):

- `NEXT_PUBLIC_SENTRY_DSN` – Sentry DSN für Error Monitoring (siehe sentry.io)
- `SENTRY_AUTH_TOKEN` – Sentry Auth Token für Source-Map-Upload

---

## Server-Sicherheit

### Firewall (UFW)

Das Server-Setup-Script konfiguriert automatisch eine UFW-Firewall mit folgenden Regeln:

| Port | Protokoll | Dienst | Richtung |
|------|-----------|--------|----------|
| 22   | TCP       | SSH    | Eingehend erlaubt |
| 80   | TCP       | HTTP   | Eingehend erlaubt |
| 443  | TCP       | HTTPS  | Eingehend erlaubt |
| 3000 | TCP       | Next.js | Nur von 172.18.0.0/16 (Docker-Netzwerk) für Nginx-Proxy |
| *    | *         | *      | Eingehend blockiert (default deny) |
| *    | *         | *      | Ausgehend erlaubt (default allow) |

**Status prüfen:**

```bash
ssh root@217.154.23.84 'ufw status verbose'
```

**Bei Docker-Nginx:** Falls die Website nicht erreichbar ist, prüfen ob der Nginx-Container den Host (Next.js auf Port 3000) erreichen kann. UFW-Regel:

```bash
ufw allow from 172.18.0.0/16 to any port 3000 comment "Docker to Next.js"
```

**Regel hinzufügen/entfernen (Beispiel):**

```bash
# Regel hinzufügen
ssh root@217.154.23.84 'ufw allow 8080/tcp comment "Temp Debug Port"'

# Regel entfernen
ssh root@217.154.23.84 'ufw delete allow 8080/tcp'
```

### SSH-Hardening

Das Script deaktiviert automatisch die Passwort-Authentifizierung und erlaubt nur SSH-Key-basiertes Login:

- `PasswordAuthentication no`
- `PermitRootLogin prohibit-password`

> **Wichtig:** Stelle sicher, dass dein SSH-Key in `~/.ssh/authorized_keys` auf dem Server hinterlegt ist, **bevor** du das Script ausführst. Andernfalls sperrst du dich aus.

**SSH-Key auf den Server kopieren (falls noch nicht geschehen):**

```bash
ssh-copy-id root@217.154.23.84
```

---

## Uptime-Monitoring

Der Health-Check-Endpoint `/api/health` steht für externes Monitoring bereit.

### Empfohlenes Setup

1. Einen externen Monitoring-Dienst einrichten (z.B. [UptimeRobot](https://uptimerobot.com/) – kostenloser Plan reicht)
2. HTTP(s)-Monitor anlegen:
   - **URL:** `https://www.fiecon-consulting.eu/api/health`
   - **Intervall:** 5 Minuten
   - **Erwarteter Status:** 200
3. Benachrichtigungen konfigurieren (E-Mail, Slack, etc.)
4. Optional: Statuspage einrichten für öffentliche Verfügbarkeitsanzeige

---

## Backup-Strategie

### Was wird gesichert?

| Quelle | Pfad | Häufigkeit |
|--------|------|------------|
| Umgebungsvariablen | `/var/www/fiecon/.env` | Nach jeder Änderung |
| Nginx-Konfiguration | `/etc/nginx/sites-available/fiecon` | Nach jeder Änderung |
| PM2-Konfiguration | `/var/www/fiecon/ecosystem.config.cjs` | Nach jeder Änderung |
| SSL-Zertifikate | `/etc/letsencrypt/` | Monatlich |

### Automatisches Backup (Cron-Job)

Auf dem Server einrichten:

```bash
# Backup-Verzeichnis erstellen
mkdir -p /root/backups/fiecon

# Cron-Job einrichten (tägliches Backup um 03:00 Uhr)
crontab -e
# Folgende Zeile hinzufügen:
0 3 * * * tar -czf /root/backups/fiecon/backup-$(date +\%Y\%m\%d).tar.gz /var/www/fiecon/.env /etc/nginx/sites-available/fiecon /var/www/fiecon/ecosystem.config.cjs 2>/dev/null

# Alte Backups automatisch löschen (älter als 30 Tage)
0 4 * * * find /root/backups/fiecon -name "backup-*.tar.gz" -mtime +30 -delete
```

### Wiederherstellung

```bash
# Backup entpacken
tar -xzf /root/backups/fiecon/backup-YYYYMMDD.tar.gz -C /

# Services neu starten
pm2 restart fiecon
systemctl reload nginx
```

### Off-Site-Backup (optional)

Für zusätzliche Sicherheit die Backups auf einen externen Speicher kopieren:

```bash
# Beispiel: rsync auf einen zweiten Server
rsync -avz /root/backups/fiecon/ backup-user@backup-server:/backups/fiecon/
```
