# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Зависимости
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Переменные окружения для сборки
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Сборка
COPY . .
RUN yarn build

# Production stage
FROM nginx:alpine

# Копируем сборку
COPY --from=build /app/build /usr/share/nginx/html

# Конфигурация nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Порт
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
