# Base image
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Development stage
FROM base AS development
COPY package*.json ./
COPY turbo.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/database/package*.json ./packages/database/
COPY packages/shared/package*.json ./packages/shared/

RUN npm ci

COPY . .
RUN npx prisma generate --schema=./apps/backend/prisma/schema.prisma

WORKDIR /app/apps/backend
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Builder stage
FROM base AS builder
COPY package*.json ./
COPY turbo.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/database/package*.json ./packages/database/
COPY packages/shared/package*.json ./packages/shared/

RUN npm ci

COPY . .
RUN npx prisma generate --schema=./apps/backend/prisma/schema.prisma
RUN npm run build --workspace=@mates/backend

# Production stage
FROM base AS production
RUN apk add --no-cache dumb-init

ENV NODE_ENV production
ENV PORT 3001

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=builder --chown=nodejs:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/backend/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/apps/backend/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/apps/backend/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
