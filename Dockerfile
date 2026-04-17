# ──────────────────────────────────────────
# Stage: Base image
# ──────────────────────────────────────────

# Start from official Node.js 18 on Alpine Linux
# Alpine = only 5MB, no unnecessary bloat
# Always pin exact version — never use :latest in production
FROM node:18-alpine

# Create non-root user EARLY — before anything else
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# ──────────────────────────────────────────
# Set working directory inside the container
# All subsequent commands run from here
# Think of it as: cd /app inside the container
# ──────────────────────────────────────────
WORKDIR /app

# ──────────────────────────────────────────
# Copy package files FIRST — before source code
# This is the most important Docker optimization
# Why? See explanation below
# ──────────────────────────────────────────
COPY package*.json ./

# ──────────────────────────────────────────
# Install dependencies
# RUN executes during BUILD, result is cached as a layer
# ──────────────────────────────────────────
RUN npm install --omit=dev

# ──────────────────────────────────────────
# NOW copy the rest of the source code
# Source code changes frequently
# Dependencies change rarely
# Separating them = faster rebuilds (cache hit on npm install)
# ──────────────────────────────────────────
COPY src/ ./src/

# Set non-sensitive defaults — secrets come from runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV APP_NAME=docker-node-app

# Create directory for persistent data and set ownership
RUN mkdir -p /app/data && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# ──────────────────────────────────────────
# Document that the app uses port 3000
# EXPOSE doesn't actually open the port —
# it's documentation + used by Docker Compose
# The actual port mapping happens in docker run -p
# ──────────────────────────────────────────
EXPOSE 3000

# ──────────────────────────────────────────
# The command that runs when container starts
# Use array form (exec form) — makes Node PID 1 directly
# Never use string form: CMD "node src/app.js"
# String form runs through shell, Node becomes PID 2
# PID 1 must handle signals for graceful shutdown
# ──────────────────────────────────────────
CMD ["node", "src/app.js"]
