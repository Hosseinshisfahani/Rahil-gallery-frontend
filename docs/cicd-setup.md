# CI/CD — GitHub Actions → VPS

## Workflows

| File | Trigger | Action |
|------|---------|--------|
| `.github/workflows/ci.yml` | push / PR | lint + build |
| `.github/workflows/deploy.yml` | push to `master` | Standalone build → SCP → PM2 reload |

## Required GitHub secrets

- `SSH_PRIVATE_KEY`
- `SSH_HOST`
- `SSH_USER`
- `CLIENT_DEPLOY_PATH` — e.g. `/root/source/Rahil-Gallery-Client`

## First-time VPS

1. Install Node 20 + PM2: `npm install -g pm2 && pm2 startup`  
2. Create `.env` from `.env.example` (`API_PROXY_URL=http://127.0.0.1:8080`)  
3. Add deploy public key to `authorized_keys`

Manual first start: `pm2 start ecosystem.config.cjs && pm2 save`
