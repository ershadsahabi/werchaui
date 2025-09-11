# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Build args for compile-time envs
ARG NEXT_PUBLIC_API_BASE_URL
ARG INTERNAL_API_BASE_URL

# Expose them at build-time so Next can inline public envs
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV INTERNAL_API_BASE_URL=${INTERNAL_API_BASE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Install deps (cache friendly)
COPY werchaui/package*.json ./
RUN npm ci

# Copy source
COPY werchaui/ ./

# Build (SSR + client)
RUN npm run build

# ---------- runtime stage ----------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Only runtime deps
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev

# Next assets (standalone-like)
COPY --from=build /app/.next/ ./.next/
COPY --from=build /app/public ./public

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=5 \
  CMD wget -qO- http://localhost:3000/ >/dev/null || exit 1

CMD ["npm","run","start","--","-p","3000"]
