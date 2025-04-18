# Build Stage
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# 👇 Add this to replace default config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
