#!/usr/bin/env bash
#
# FIECON Deployment Script
# Deploys the Next.js app to root@217.154.23.84 via rsync + PM2
#
# Usage: ./deploy.sh [--skip-build] [--force] [--dry-run]
#   --skip-build  Skip local build (e.g. config-only deploys)
#   --force       Deploy even if git working tree is dirty
#   --dry-run     Show rsync plan only; do not sync or restart
#

set -e

SERVER="root@217.154.23.84"
REMOTE_DIR="/var/www/fiecon"
DEPLOY_URL="${DEPLOY_URL:-https://www.fiecon-consulting.eu}"
RSYNC_EXCLUDES=(
  --exclude "node_modules"
  --exclude ".playwright-mcp"
  --exclude ".next"
  --exclude ".git"
  --exclude ".env"
  --exclude ".env*.local"
  --exclude "coverage"
  --exclude "*.tsbuildinfo"
  --exclude ".DS_Store"
  --exclude "plugins"
  --exclude "docs"
  --exclude "scripts"
  --exclude "src/tests"
  --exclude ".github"
  --exclude "vitest.config.ts"
  --exclude "eslint.config.mjs"
  --exclude "CONTRIBUTING.md"
  --exclude "README.md"
  --exclude "CLAUDE.md"
)

SKIP_BUILD=""
FORCE=""
DRY_RUN=""
for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=1 ;;
    --force)      FORCE=1 ;;
    --dry-run)    DRY_RUN=1 ;;
  esac
done

echo "🚀 FIECON Deployment"
echo "===================="
echo "Started at: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

if [[ -z "$FORCE" ]] && [[ -n $(git status --porcelain 2>/dev/null) ]]; then
  echo "⚠️  Git working tree has uncommitted changes."
  echo "   Commit or stash them, or run with --force to deploy anyway."
  exit 1
fi

if [[ -z "$SKIP_BUILD" ]]; then
  echo "📦 Building locally (verification)..."
  pnpm build
  echo "✓ Build successful"
  echo ""
fi

if [[ -n "$DRY_RUN" ]]; then
  echo "📤 [DRY-RUN] Would sync to ${SERVER}:${REMOTE_DIR}..."
  rsync -avz --delete --dry-run \
    --filter 'protect .env' \
    "${RSYNC_EXCLUDES[@]}" \
    ./ "${SERVER}:${REMOTE_DIR}/"
  echo ""
  echo "✅ Dry run complete (no changes made)."
  echo "Finished at: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  exit 0
fi

echo "📤 Syncing to ${SERVER}:${REMOTE_DIR}..."
rsync -avz --delete \
  --filter 'protect .env' \
  "${RSYNC_EXCLUDES[@]}" \
  ./ "${SERVER}:${REMOTE_DIR}/"

echo ""
echo "🔄 Installing dependencies and restarting on server..."
ssh "${SERVER}" "cd ${REMOTE_DIR} && rm -rf .next node_modules && pnpm install --frozen-lockfile && pnpm build && pm2 restart fiecon --update-env || pm2 start ecosystem.config.cjs"

echo ""
echo "⏳ Waiting 10s before health check..."
sleep 10

HEALTH_URL="${DEPLOY_URL}/api/health"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "$HEALTH_URL" || true)
if [[ "$HTTP_CODE" != "200" ]]; then
  echo "⚠️  Health check failed: GET ${HEALTH_URL} returned ${HTTP_CODE:-timeout/error}"
  exit 1
fi
echo "✓ Health check passed (HTTP 200)"

echo ""
echo "✅ Deployment complete!"
echo "Finished at: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""
echo "Useful commands:"
echo "  ssh ${SERVER} 'pm2 logs fiecon'     # View logs"
echo "  ssh ${SERVER} 'pm2 status'           # Check status"
echo ""
