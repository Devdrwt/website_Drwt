#!/bin/sh
set -e

# Sync the Prisma schema to the database (no migration history is used; the
# project relies on `prisma db push`). The DB container is up before this runs
# thanks to the compose `depends_on: condition: service_healthy`.
echo "→ Syncing database schema (prisma db push)..."
node ./node_modules/prisma/build/index.js db push --skip-generate

echo "→ Starting Next.js server on ${HOSTNAME}:${PORT}..."
exec node server.js
