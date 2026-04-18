# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies for build
COPY package*.json ./
RUN npm ci

# Copy source code and build artifacts
COPY . .

# Generate Prisma client and build the app
RUN npm run generate
RUN npm run build

# Remove development-only dependencies before copying to production
RUN npm prune --production

# Production stage
FROM node:24-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

# Copy only the app, generated build, and production dependencies
COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/index.js"]