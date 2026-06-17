#!/usr/bin/env bash
# Build Next.js standalone on a machine with npm access, for offline VPS deploy.
# Usage:
#   bash scripts/bundle-client-release.sh
#   scp /tmp/rahil-client-release.tar.gz root@YOUR_SERVER:/tmp/
#   ssh root@YOUR_SERVER 'mkdir -p /tmp/client-release && tar -xzf /tmp/rahil-client-release.tar.gz -C /tmp/client-release && bash ~/source/Rahil-Gallery-Client/scripts/deploy-remote.sh /tmp/client-release'
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-/tmp/rahil-client-release.tar.gz}"

cd "${ROOT}"

echo "==> Installing dependencies"
npm ci

echo "==> Building standalone (API proxied to localhost:8080)"
NEXT_PUBLIC_API_BASE_URL=/api/v1 API_PROXY_URL=http://127.0.0.1:8080 npm run build

echo "==> Packing release"
rm -rf /tmp/rahil-client-release-pack
mkdir -p /tmp/rahil-client-release-pack
cp -a .next/standalone /tmp/rahil-client-release-pack/standalone
cp -a .next/static /tmp/rahil-client-release-pack/static
cp -a public /tmp/rahil-client-release-pack/public
tar -czf "${OUT}" -C /tmp/rahil-client-release-pack .
rm -rf /tmp/rahil-client-release-pack

ls -lh "${OUT}"
echo "Done. Copy to VPS and run scripts/deploy-remote.sh with extracted folder."
