#!/usr/bin/env bash
# Package tracked client source for VPS sync (runtime still comes from standalone build).
# Usage: GITHUB_SHA=<sha> bash scripts/package-client-source.sh [output.tar.gz]
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

OUT="${1:-client-source.tar.gz}"
STAGING="$(mktemp -d)"
trap 'rm -rf "${STAGING}"' EXIT

echo "==> Archiving git tree at HEAD"
git archive --format=tar HEAD | tar -x -C "${STAGING}"

if [[ -n "${GITHUB_SHA:-}" ]]; then
  echo "${GITHUB_SHA}" > "${STAGING}/.deploy-sha"
fi

tar -czf "${OUT}" -C "${STAGING}" .
echo "==> Wrote ${OUT} ($(du -h "${OUT}" | awk '{print $1}'))"
