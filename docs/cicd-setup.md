# CI/CD — GitHub Actions → VPS

## Workflows

| File | Trigger | Action |
|------|---------|--------|
| `.github/workflows/ci-cd.yml` | push / PR / manual / `deploy-after-api` | CI on every run; deploy to VPS only after CI passes |

The client also deploys automatically when the API pipeline finishes (repository dispatch).

## Required GitHub secrets

- `SSH_PRIVATE_KEY`
- `SSH_HOST`
- `SSH_USER`
- `CLIENT_DEPLOY_PATH` — e.g. `/root/source/Rahil-Gallery-Client`

## VPS without npm registry access

**Do not run `npm install` or `npm run build` on the VPS** — npm registry is often blocked too.

| Method | How |
|--------|-----|
| CI/CD (recommended) | GitHub Actions builds → SCP tarball → PM2 |
| Manual bundle | Laptop: `bash scripts/bundle-client-release.sh` → SCP → `deploy-remote.sh` |

## One-time VPS setup

```bash
apt install -y rsync   # optional — deploy uses tar+scp if rsync is missing
git clone https://github.com/aliakbarebrahimy/Rahil-Gallery-Client.git ~/source/Rahil-Gallery-Client
cd ~/source/Rahil-Gallery-Client
cp .env.example .env
# API_PROXY_URL=http://127.0.0.1:8080  (Go API on same host)
npm install -g pm2
pm2 startup && pm2 save
```

Add GitHub Actions deploy key to `~/.ssh/authorized_keys` (same key as server repo).

## Manual deploy (offline)

**On laptop:**
```bash
bash scripts/bundle-client-release.sh
scp /tmp/rahil-client-release.tar.gz root@YOUR_SERVER:/tmp/
```

**On VPS** (API must be running on :8080 first):
```bash
cd ~/source/Rahil-Gallery-Client
mkdir -p /tmp/client-release
tar -xzf /tmp/rahil-client-release.tar.gz -C /tmp/client-release
bash scripts/deploy-remote.sh /tmp/client-release
```

Admin UI: `http://YOUR_SERVER_IP:3000`

## Reverse proxy (optional)

Nginx example — single domain, API + admin:

```nginx
server {
    listen 80;
    server_name admin.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Next.js rewrites `/api/v1` and `/static` to `127.0.0.1:8080` when `NEXT_PUBLIC_API_BASE_URL=/api/v1`.

## Stack overview

```
Browser → :3000 (Next.js / PM2) → /api/v1/* → :8080 (Go API) → Postgres
                                 → /static/*  → :8080 (Go static files)
```
