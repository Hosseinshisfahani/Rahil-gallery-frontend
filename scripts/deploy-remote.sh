#!/usr/bin/env bash
# Server-side deploy hook for Next.js standalone — called by GitHub Actions over SSH.
set -euo pipefail

RELEASE_DIR="${1:?release directory required}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

echo "==> Installing release from ${RELEASE_DIR}"
rm -rf .next/standalone
mkdir -p .next
cp -a "${RELEASE_DIR}/standalone" .next/standalone
cp -a "${RELEASE_DIR}/public" .next/standalone/public
mkdir -p .next/standalone/.next
cp -a "${RELEASE_DIR}/static" .next/standalone/.next/static
cp -a "${RELEASE_DIR}/public" ./public

if [[ ! -f .env ]]; then
  echo "WARN: .env missing — copy from .env.example" >&2
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "Installing pm2..."
  npm install -g pm2
fi

echo "==> Restarting PM2 app"
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save

echo "==> Client deploy complete"
