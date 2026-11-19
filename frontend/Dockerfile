# Stage 1: Install dependencies (menggunakan glibc slim demi kompatibilitas native binary Vite 8 & Tailwind v4)
FROM node:24-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Development server (Vite HMR)
FROM deps AS dev
WORKDIR /app

COPY . .
EXPOSE 4174
CMD ["npm", "run", "dev"]

# Stage 3: Build production static bundle
FROM deps AS builder
WORKDIR /app

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY . .
RUN npm run build

# Stage 4: Production runtime dengan Nginx
FROM nginx:1.27-alpine AS prod

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

