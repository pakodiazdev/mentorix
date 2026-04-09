FROM node:20-alpine AS base

RUN apk add --no-cache curl

WORKDIR /app/code/api

# ─── Development ────────────────────────────────────────────
FROM base AS dev

COPY code/api/package*.json ./
RUN npm ci

COPY code/api/ .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# ─── Production build ──────────────────────────────────────
FROM base AS build

COPY code/api/package*.json ./
RUN npm ci

COPY code/api/ .
RUN npm run build

# ─── Production ────────────────────────────────────────────
FROM base AS prod

COPY --from=build /app/code/api/dist ./dist
COPY --from=build /app/code/api/node_modules ./node_modules
COPY --from=build /app/code/api/package*.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
