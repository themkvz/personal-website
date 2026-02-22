#!/bin/sh
set -e

# Push schema to database (creates tables if they don't exist)
bun ./node_modules/drizzle-kit/bin.cjs push --force

# Only seed when explicitly requested via SEED_DB=true
if [ "$SEED_DB" = "true" ]; then
  echo "SEED_DB=true — running seeds..."
  bun scripts/seed.ts
fi

# Start the application
exec bun run start
