FROM oven/bun:1 AS base

# Install dependencies (all, needed for build)
FROM base AS deps
WORKDIR /app
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile --ignore-scripts

# Install production dependencies only
FROM oven/bun:1-alpine AS prod-deps
WORKDIR /app
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile --production --ignore-scripts

# Build the application
FROM base AS build
ARG VITE_OP_CLIENT_ID
ARG VITE_OP_API_URL
ARG VITE_GLITCHTIP_DSN
ENV VITE_OP_CLIENT_ID=$VITE_OP_CLIENT_ID
ENV VITE_OP_API_URL=$VITE_OP_API_URL
ENV VITE_GLITCHTIP_DSN=$VITE_GLITCHTIP_DSN
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN test -n "$VITE_OP_CLIENT_ID" && test -n "$VITE_OP_API_URL" && test -n "$VITE_GLITCHTIP_DSN"
RUN bun run build

# Production image
FROM node:24-alpine
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./

ENV NODE_ENV=production
ENV PORT=3000
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -qO- "http://127.0.0.1:${PORT}/robots.txt" || exit 1

CMD ["node", "./node_modules/.bin/react-router-serve", "./build/server/index.js"]
