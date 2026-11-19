# Stage 1: Install semua dependensi (hanya 1 kali download via network)
FROM node:24-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Development server (tsx watch hot-reload)
FROM deps AS dev
WORKDIR /app

COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

# Stage 3: Compile TypeScript ke JavaScript (dist/) & prune devDependencies
FROM deps AS builder
WORKDIR /app

COPY . .
RUN npm run build && npm prune --omit=dev && npm cache clean --force

# Stage 4: Production runtime minimalis dengan user non-root (tanpa download ulang)
FROM node:24-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN mkdir -p uploads && chown -R node:node /app

USER node
EXPOSE 4000

HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4000/api/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "dist/server.js"]
