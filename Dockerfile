FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build-time env vars
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
    if [ -f yarn.lock ]; then yarn run build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create uploads directory with open permissions for Docker volume mounts
RUN mkdir -p /app/public/uploads && chmod -R 777 /app/public/uploads

# Copy entrypoint script (runs as root to fix volume permissions at startup)
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Run as root so we can chmod the mounted volume at container start
# The entrypoint.sh handles permission setup before starting the app
USER root

EXPOSE 3000

ENV PORT 3000

# Healthcheck: container is "healthy" only after warmup completes
# --start-period=150s: sunucu başlaması (~30s) + warmup (~80s) için süre
# --interval=30s: sonrasında 30 sn'de bir kontrol et
# --timeout=10s: her kontrol 10 sn timeout
# --retries=3: 3 başarısız kontrol = unhealthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=150s --retries=3 \
  CMD wget -T 5 -q -O /dev/null http://localhost:3000/api/health || exit 1

# Entrypoint fixes volume permissions then starts the app
ENTRYPOINT ["/entrypoint.sh"]
