FROM node:20-alpine AS base

WORKDIR /app/code/webapp

# ─── Development ────────────────────────────────────────────
FROM base AS dev

COPY code/webapp/package*.json ./
RUN npm ci

COPY code/webapp/ .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ─── Production build ──────────────────────────────────────
FROM base AS build

COPY code/webapp/package*.json ./
RUN npm ci

COPY code/webapp/ .
RUN npm run build

# ─── Production (served by nginx) ─────────────────────────
FROM nginx:alpine AS prod

COPY --from=build /app/code/webapp/dist /usr/share/nginx/html
COPY docker/nginx/conf.d/webapp-prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
