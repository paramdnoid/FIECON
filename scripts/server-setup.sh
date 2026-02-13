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

# ─── Firewall (UFW) ──────────────────────────────────────────────────
echo ""
echo "🔥 Configuring UFW firewall..."
if ! command -v ufw &>/dev/null; then
  apt-get install -y ufw
fi

# Default policies: deny incoming, allow outgoing
ufw default deny incoming
ufw default allow outgoing

# Allow essential ports only
ufw allow 22/tcp   comment 'SSH'
ufw allow 80/tcp   comment 'HTTP'
ufw allow 443/tcp  comment 'HTTPS'
# Docker→Host: Nginx-Container muss Next.js auf Port 3000 erreichen
ufw allow from 172.18.0.0/16 to any port 3000 comment 'Docker to Next.js'

# Enable UFW (--force skips the interactive prompt)
ufw --force enable
ufw status verbose
echo "✅ UFW configured: ports 22, 80, 443 open; Docker→3000 allowed."

# ─── SSH Hardening ────────────────────────────────────────────────────
echo ""
echo "🔒 Hardening SSH configuration..."
SSHD_CONFIG="/etc/ssh/sshd_config"

# Disable password authentication (key-only login)
if grep -q "^PasswordAuthentication" "$SSHD_CONFIG"; then
  sed -i 's/^PasswordAuthentication.*/PasswordAuthentication no/' "$SSHD_CONFIG"
elif grep -q "^#PasswordAuthentication" "$SSHD_CONFIG"; then
  sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' "$SSHD_CONFIG"
else
  echo "PasswordAuthentication no" >> "$SSHD_CONFIG"
fi

# Disable root login with password (allow key-based only)
if grep -q "^PermitRootLogin" "$SSHD_CONFIG"; then
  sed -i 's/^PermitRootLogin.*/PermitRootLogin prohibit-password/' "$SSHD_CONFIG"
elif grep -q "^#PermitRootLogin" "$SSHD_CONFIG"; then
  sed -i 's/^#PermitRootLogin.*/PermitRootLogin prohibit-password/' "$SSHD_CONFIG"
else
  echo "PermitRootLogin prohibit-password" >> "$SSHD_CONFIG"
fi

# Restart SSH daemon to apply changes (service name varies: ssh or sshd)
if systemctl list-units --type=service | grep -q "sshd.service"; then
  systemctl restart sshd
elif systemctl list-units --type=service | grep -q "ssh.service"; then
  systemctl restart ssh
else
  echo "⚠️  Could not restart SSH service automatically. Please restart manually."
fi
echo "✅ SSH hardened: password auth disabled, root login key-only."

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
echo "Summary:"
echo "  ✅ Node.js, pnpm, PM2 installed"
echo "  ✅ UFW firewall active (ports 22, 80, 443)"
echo "  ✅ SSH hardened (password auth disabled, key-only login)"
echo ""
echo "Next steps:"
echo "  1. Edit /var/www/fiecon/.env with SMTP credentials"
echo "  2. Run ./deploy.sh from your local machine"
echo ""
echo "⚠️  IMPORTANT: Ensure your SSH key is in ~/.ssh/authorized_keys on this server"
echo "   BEFORE closing this session, or you will be locked out!"
echo ""
echo "Optional: Install nginx as reverse proxy for SSL:"
echo "  apt install -y nginx certbot python3-certbot-nginx"
echo "  certbot --nginx -d fiecon-consulting.eu -d www.fiecon-consulting.eu"
echo ""
