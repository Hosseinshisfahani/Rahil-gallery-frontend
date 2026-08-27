# Rahil Gallery Frontend

Next.js 16 storefront and admin UI for Rahil Gallery.

The browser calls same-origin `/api/v1`. Next.js rewrites split that traffic between the two backends (Strangler Fig):

| Repo | Role |
|------|------|
| [Rahil-gallery-backend-go](../Rahil-gallery-backend-go) | Auth, CRM customers, catalog, static assets |
| [Rahil-gallery-backend-django](../Rahil-gallery-backend-django) | Carts, orders, payments, promotions |

## Local development

**Prerequisites:** Node 20+. Start Postgres and the Go API first (`make docker-dev && make dev` in the Go repo), then Django on `:8000`.

```bash
cp .env.example .env
npm install
npm run dev
```

| Surface | URL |
|---------|-----|
| Storefront | http://localhost:3000 |
| Admin | http://localhost:3000/admin |

## Same-origin proxy

With `NEXT_PUBLIC_API_BASE_URL=/api/v1` (the default), `next.config.ts` rewrites:

| Path | Upstream (defaults) |
|------|---------------------|
| `/api/v1/carts`, `/orders`, `/payments`, `/promotions`, `/coupons` | Django — `DJANGO_API_PROXY_URL` (`http://localhost:8000`) |
| `/api/v1/*` (everything else) | Go — `GO_API_PROXY_URL` (`http://localhost:8081`) |
| `/static/*` | Go (catalog images, customer signatures) |

Set `NEXT_PUBLIC_API_BASE_URL` to a full `http(s)://…` URL to skip rewrites and call one backend directly (CORS must allow the frontend origin).

`API_PROXY_URL` is still accepted as a legacy alias for `GO_API_PROXY_URL`.

## Environment

Copy `.env.example` and adjust as needed:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Browser API base. Use `/api/v1` for the proxy. |
| `GO_API_PROXY_URL` | Go origin used by rewrites. Default `http://localhost:8081`. |
| `DJANGO_API_PROXY_URL` | Django origin used by rewrites. Default `http://localhost:8000`. |
| `NEXT_PUBLIC_DEV_ACCESS_TOKEN` | Optional. Sends a Bearer token on every request in development. |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on `:3000` |
| `npm run build` | Production build (`output: "standalone"`) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Deploy

GitHub Actions builds the standalone bundle and deploys with PM2. See [docs/cicd-setup.md](docs/cicd-setup.md).

To bundle on a machine with npm access:

```bash
bash scripts/bundle-client-release.sh
```

## Docs

- [API assumptions](docs/api-assumptions.md) — live Go + Django contracts
- [Pages](docs/pages.md) — route inventory
- [CI/CD](docs/cicd-setup.md)
