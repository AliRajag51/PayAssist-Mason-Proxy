# syntax=docker/dockerfile:1
# Optimized deployment image:
# - Single Alpine Bun base for deps, build, and runtime (one small image to pull)
# - output:"standalone" (next.config.js) traces only the files actually used, so
#   the runner ships .next/standalone (minimal node_modules + server.js) — no
#   separate prod-deps install, no full production node_modules copy
# - BuildKit cache mounts keep Bun's package cache and Next's build cache warm
# - NEXT_PUBLIC_* baked at build time (leave NEXT_PUBLIC_API_BASE_URL empty so
#   browsers use the same-origin /api proxy route); INTERNAL_API_BASE_URL is read
#   at runtime by SSR and the proxy (http://backend:5000 over the private network)

FROM oven/bun:1.3.14-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

FROM oven/bun:1.3.14-alpine AS builder
WORKDIR /app

ARG INTERNAL_API_BASE_URL=http://backend:5000
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_STRIPE_KEY
ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID
ARG NEXT_PUBLIC_ENABLE_STRIPE=true
ARG NEXT_PUBLIC_ENABLE_PAYPAL=true
ENV INTERNAL_API_BASE_URL=$INTERNAL_API_BASE_URL \
    NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_STRIPE_KEY=$NEXT_PUBLIC_STRIPE_KEY \
    NEXT_PUBLIC_PAYPAL_CLIENT_ID=$NEXT_PUBLIC_PAYPAL_CLIENT_ID \
    NEXT_PUBLIC_ENABLE_STRIPE=$NEXT_PUBLIC_ENABLE_STRIPE \
    NEXT_PUBLIC_ENABLE_PAYPAL=$NEXT_PUBLIC_ENABLE_PAYPAL \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=cache,target=/app/.next/cache \
    bun run build

FROM oven/bun:1.3.14-alpine AS runner
WORKDIR /app

ARG INTERNAL_API_BASE_URL=http://backend:5000
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    INTERNAL_API_BASE_URL=$INTERNAL_API_BASE_URL \
    NEXT_TELEMETRY_DISABLED=1

# Standalone server bundle (minimal traced node_modules + server.js), plus the
# static assets and public/ that standalone does not inline.
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static
COPY --from=builder --chown=bun:bun /app/public ./public

USER bun

EXPOSE 3000

CMD ["bun", "server.js"]
