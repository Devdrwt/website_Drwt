# syntax=docker/dockerfile:1

# ============================================================
#  Drwintech website — production image (Next.js 16 standalone)
# ============================================================

# ---------- 1. Builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Prisma needs openssl; libc6-compat helps some native deps on alpine.
RUN apk add --no-cache libc6-compat openssl

# Install dependencies first (better layer caching).
# --ignore-scripts skips the postinstall asset download here; we run it
# explicitly below once the full source (scripts/) is present.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy the rest of the source.
COPY . .

# Public build-time config — NEXT_PUBLIC_* values are INLINED into the client
# bundle by `next build`, so they must be present now (not just at runtime).
ARG NEXT_PUBLIC_SITE_URL="https://drwintech.com"
ARG NEXT_PUBLIC_WHATSAPP="+22962707002"
ARG NEXT_PUBLIC_CONTACT_EMAIL="contact@drwintech.com"
ARG NEXT_PUBLIC_PHONE="+229 01 97 17 17 96"
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_WHATSAPP=$NEXT_PUBLIC_WHATSAPP \
    NEXT_PUBLIC_CONTACT_EMAIL=$NEXT_PUBLIC_CONTACT_EMAIL \
    NEXT_PUBLIC_PHONE=$NEXT_PUBLIC_PHONE \
    NEXT_TELEMETRY_DISABLED=1

# Generate the Prisma client and fetch remote media assets (best-effort).
RUN npx prisma generate
RUN node scripts/download-videos.mjs && node scripts/download-images.mjs || true

# Build. DB-backed pages are `force-dynamic`, so no database is needed here.
RUN npm run build

# ---------- 2. Runner ----------
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as an unprivileged user.
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

# Standalone server + static assets + public files.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Prisma schema + generated client (used by the app at runtime).
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Isolated Prisma CLI (with its full dependency tree) for `prisma db push` at
# startup — kept separate from the app's node_modules to avoid clashes.
RUN npm install --prefix /opt/prisma-cli prisma@6.19.3 --omit=dev --no-audit --no-fund

# Entrypoint: sync DB schema, then launch the server.
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh \
    && mkdir -p /app/private/uploads \
    && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
