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

Das Script installiert:
- Node.js 20
- pnpm
- PM2
- Erstellt `/var/www/fiecon` und eine `.env`-Vorlage

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
