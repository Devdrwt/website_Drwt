#!/bin/sh
set -e

# Sync the Prisma schema to the database (no migration history is used; the
# project relies on `prisma db push`). The DB container is up before this runs
# thanks to the compose `depends_on: condition: service_healthy`.
echo "→ Syncing database schema (prisma db push)..."
/opt/prisma-cli/node_modules/.bin/prisma db push --schema /app/prisma/schema.prisma --skip-generate

echo "→ Starting Next.js server on ${HOSTNAME}:${PORT}..."
exec node server.js
