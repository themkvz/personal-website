#!/bin/sh
set -e

# Push schema to database (creates tables if they don't exist)
bun ./node_modules/drizzle-kit/bin.cjs push --force

# Seed database (uses onConflictDoNothing, safe to run multiple times)
bun scripts/seed.ts

# Start the application
exec bun run start
