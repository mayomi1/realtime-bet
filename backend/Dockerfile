# Build stage
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

COPY prisma ./prisma/

COPY src/ ./src/

RUN npm ci

RUN npx prisma generate

RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /usr/src/app

# Install OpenSSL and other required dependencies for Prisma
RUN apt-get update && apt-get install -y openssl

COPY package*.json ./

COPY prisma ./prisma/

RUN npm ci --only=production

COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8080

# Command to run the application with Prisma migrations
CMD ["/bin/sh", "-c", "node dist/src/index.js"]
