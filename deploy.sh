#!/usr/bin/env bash
#
# FIECON Deployment Script
# Deploys the Next.js app to root@217.154.23.84 via rsync + PM2
#
# Usage: ./deploy.sh [--skip-build]
#   --skip-build  Skip local build (useful if only deploying config changes)
#

set -e

SERVER="root@217.154.23.84"
REMOTE_DIR="/var/www/fiecon"
RSYNC_EXCLUDES=(
  --exclude "node_modules"
  --exclude ".next"
  --exclude ".git"
  --exclude ".env"
  --exclude ".env*.local"
  --exclude "coverage"
  --exclude "*.tsbuildinfo"
  --exclude ".DS_Store"
  --exclude "plugins"
)

echo "🚀 FIECON Deployment"
echo "===================="

# Optional: skip build (e.g. for config-only deploys)
if [[ "${1:-}" != "--skip-build" ]]; then
  echo ""
  echo "📦 Building locally (verification)..."
  pnpm build
  echo "✓ Build successful"
fi

echo ""
echo "📤 Syncing to ${SERVER}:${REMOTE_DIR}..."
rsync -avz --delete \
  --filter 'protect .env' \
  "${RSYNC_EXCLUDES[@]}" \
  --exclude ".next" \
  ./ "${SERVER}:${REMOTE_DIR}/"

echo ""
echo "🔄 Installing dependencies and restarting on server..."
ssh "${SERVER}" "cd ${REMOTE_DIR} && pnpm install --frozen-lockfile && pnpm build && pm2 restart fiecon --update-env || pm2 start ecosystem.config.cjs"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Useful commands:"
echo "  ssh ${SERVER} 'pm2 logs fiecon'     # View logs"
echo "  ssh ${SERVER} 'pm2 status'           # Check status"
echo ""
