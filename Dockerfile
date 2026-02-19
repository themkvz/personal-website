FROM oven/bun:1 AS base

# Install dependencies (all, needed for build)
FROM base AS deps
WORKDIR /app
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile

# Install production dependencies only
FROM base AS prod-deps
WORKDIR /app
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile --production

# Build the application
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production image
FROM base
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./

VOLUME /app/data

EXPOSE 3000

CMD ["bun", "run", "start"]
