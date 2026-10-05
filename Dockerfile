FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
ARG NPM_REGISTRY=
RUN if [ -n "$NPM_REGISTRY" ]; then npm ci --registry "$NPM_REGISTRY"; else npm ci; fi

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_BASE_URL=/api/v1
ARG GO_API_PROXY_URL=http://go:8080
ARG DJANGO_API_PROXY_URL=http://django:8000
ARG ALLOWED_DEV_ORIGINS=
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    GO_API_PROXY_URL=$GO_API_PROXY_URL \
    DJANGO_API_PROXY_URL=$DJANGO_API_PROXY_URL \
    ALLOWED_DEV_ORIGINS=$ALLOWED_DEV_ORIGINS \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
