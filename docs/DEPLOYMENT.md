# Deployment Guide

## Содержание
1. [Локальная разработка](#локальная-разработка)
2. [Docker развертывание](#docker-развертывание)
3. [Production развертывание](#production-развертывание)
4. [CI/CD Pipeline](#cicd-pipeline)

---

## Локальная разработка

### Требования
- Node.js 18+ (рекомендуется nvm)
- Python 3.11+
- MongoDB (локально или Docker)
- Git

### Шаг 1: Клонирование

```bash
git clone https://github.com/your-username/forma-strategy.git
cd forma-strategy
```

### Шаг 2: MongoDB

**Вариант A: Docker**
```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

**Вариант B: MongoDB Atlas**
1. Создайте кластер на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Получите connection string

### Шаг 3: Backend

```bash
cd backend

# Виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# .\venv\Scripts\activate  # Windows

# Зависимости
pip install -r requirements.txt

# Переменные окружения
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=forma_strategy
CORS_ORIGINS=*
JWT_SECRET=$(openssl rand -hex 32)
EOF

# Запуск
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Шаг 4: Frontend

```bash
cd frontend

# Зависимости
yarn install

# Переменные окружения
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
EOF

# Запуск
yarn start
```

### Проверка

- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/api
- API Docs: http://localhost:8001/docs

---

## Docker развертывание

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: forma-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - forma-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: forma-backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=forma_strategy
      - CORS_ORIGINS=*
      - JWT_SECRET=${JWT_SECRET:-your-secret-key}
    depends_on:
      - mongodb
    networks:
      - forma-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: forma-frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8001
    depends_on:
      - backend
    networks:
      - forma-network

volumes:
  mongodb_data:

networks:
  forma-network:
    driver: bridge
```

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Системные зависимости
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Python зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Исходный код
COPY . .

# Порт
EXPOSE 8001

# Запуск
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Зависимости
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Сборка
COPY . .
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN yarn build

# Production
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx конфигурация

```nginx
# frontend/nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Запуск Docker

```bash
# Сборка и запуск
docker-compose up -d --build

# Логи
docker-compose logs -f

# Остановка
docker-compose down

# Полная очистка (с данными)
docker-compose down -v
```

---

## Production развертывание

### Vercel (Frontend)

1. Подключите GitHub репозиторий к Vercel
2. Настройте переменные:
   ```
   REACT_APP_BACKEND_URL=https://api.forma-strategy.com
   ```
3. Deploy автоматически при push в main

### Railway / Render (Backend)

**Railway:**
```bash
# Установите Railway CLI
npm i -g @railway/cli

# Логин
railway login

# Создание проекта
railway init

# Деплой
railway up
```

**Render:**
1. Создайте Web Service
2. Подключите GitHub
3. Настройте:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

### MongoDB Atlas

1. Создайте кластер (M0 бесплатно)
2. Создайте Database User
3. Добавьте IP в Network Access (0.0.0.0/0 для везде)
4. Получите connection string

### Переменные окружения Production

```bash
# Backend
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/forma_strategy
DB_NAME=forma_strategy
CORS_ORIGINS=https://forma-strategy.com,https://www.forma-strategy.com
JWT_SECRET=<сгенерированный-секретный-ключ>

# Frontend
REACT_APP_BACKEND_URL=https://api.forma-strategy.com
```

---

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install Frontend Dependencies
        run: cd frontend && yarn install
        
      - name: Lint Frontend
        run: cd frontend && yarn lint
        
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.11
          
      - name: Install Backend Dependencies
        run: cd backend && pip install -r requirements.txt
        
      - name: Lint Backend
        run: cd backend && ruff check .

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

---

## Чек-лист Production

### Безопасность
- [ ] JWT_SECRET уникальный и надёжный
- [ ] CORS ограничен конкретными доменами
- [ ] HTTPS везде
- [ ] Rate limiting настроен
- [ ] Sensitive data не в логах

### Performance
- [ ] Frontend сжат (gzip)
- [ ] Статика на CDN
- [ ] MongoDB индексы созданы
- [ ] Caching настроен

### Мониторинг
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Логирование настроено
- [ ] Метрики собираются

### Backup
- [ ] MongoDB backup настроен
- [ ] Автоматические бэкапы
- [ ] Тестирование восстановления

---

## Troubleshooting

### MongoDB Connection Error
```bash
# Проверьте, что MongoDB запущен
docker ps | grep mongo

# Проверьте connection string
mongosh "mongodb://localhost:27017"
```

### CORS Error
```python
# Добавьте домен в CORS_ORIGINS
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
```

### JWT Token Invalid
```bash
# Убедитесь что JWT_SECRET одинаковый
echo $JWT_SECRET
```

### Frontend не видит API
```bash
# Проверьте REACT_APP_BACKEND_URL
echo $REACT_APP_BACKEND_URL

# Перезапустите frontend после изменения .env
yarn start
```
