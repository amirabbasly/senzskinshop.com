# ---------- SENZ SKIN SHOP — API (Node.js + Express + PostgreSQL) ----------
FROM node:22-alpine

ENV NODE_ENV=production \
    PORT=4000 \
    UPLOAD_DIR=/app/uploads

WORKDIR /app

# Install production dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# App source
COPY src ./src

# Uploaded images live on a shared volume
RUN mkdir -p /app/uploads && chown -R node:node /app

USER node

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=5 \
  CMD wget -qO- http://127.0.0.1:4000/api/health >/dev/null 2>&1 || exit 1

CMD ["node", "src/server.js"]
