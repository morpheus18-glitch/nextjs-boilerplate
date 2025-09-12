# Build and run the Next.js application

# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Install production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
EXPOSE 3000
CMD ["npm", "start"]
