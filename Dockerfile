# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Accept build-time argument
ARG NODE_ENV=dev

RUN npm install -g pnpm

# Copy dependency manifests and install dependencies
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

# Copy all source code
COPY . .

RUN npm run build:${NODE_ENV}

# Stage 2: Production image
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from builder
COPY --from=builder /app/dist/taskify /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html

# Copy custom nginx config
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
