#!/usr/bin/env bash
#
# One-time server setup for FIECON
# Run this ON THE SERVER (e.g. via: ssh root@217.154.23.84 'bash -s' < scripts/server-setup.sh)
# Or: scp scripts/server-setup.sh root@217.154.23.84:/tmp/ && ssh root@217.154.23.84 'bash /tmp/server-setup.sh'
#
set -e

echo "🔧 FIECON Server Setup"
echo "======================"

# Node.js 20+ (via NodeSource)
if ! command -v node &>/dev/null; then
  echo "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "Node: $(node -v)"

# pnpm
if ! command -v pnpm &>/dev/null; then
  echo "Installing pnpm..."
  if command -v corepack &>/dev/null; then
    corepack enable
    corepack prepare pnpm@latest --activate
  else
    npm install -g pnpm
  fi
fi
echo "pnpm: $(pnpm -v)"

# PM2
if ! command -v pm2 &>/dev/null; then
  echo "Installing PM2..."
  npm install -g pm2
  pm2 startup systemd -u root --hp /root 2>/dev/null || true
fi
echo "PM2: $(pm2 -v)"

# Directories
mkdir -p /var/www/fiecon
mkdir -p /var/log/pm2

# Create .env if missing
if [[ ! -f /var/www/fiecon/.env ]]; then
  echo ""
  echo "⚠️  Creating /var/www/fiecon/.env from template."
  echo "   Edit it with your SMTP credentials before first deploy!"
  cat > /var/www/fiecon/.env << 'ENVEOF'
# SMTP (required for contact form)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
CONTACT_TO=

# Optional
SMTP_FROM=
ENVEOF
  chmod 600 /var/www/fiecon/.env
fi

echo ""
echo "✅ Server setup complete."
echo ""
echo "Next steps:"
echo "  1. Edit /var/www/fiecon/.env with SMTP credentials"
echo "  2. Run ./deploy.sh from your local machine"
echo ""
echo "Optional: Install nginx as reverse proxy for SSL:"
echo "  apt install -y nginx certbot python3-certbot-nginx"
echo "  certbot --nginx -d fiecon-consulting.eu -d www.fiecon-consulting.eu"
echo ""
