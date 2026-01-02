# FORMA Strategy

> NFT Buyback & Burn Strategy Platform - Perpetual NFT Machine

<p align="center">
  <img src="frontend/public/logo.svg" alt="FORMA Strategy Logo" width="200"/>
</p>

## 🎯 О проекте

**FORMA Strategy** — это платформа для автоматизированной стратегии выкупа и сжигания NFT. Проект реализует механизм "Perpetual NFT Machine", где:

- 📈 Трейдинговые комиссии накапливаются в казне
- 🛒 Автоматический выкуп NFT по floor price
- 🔥 Сжигание токенов $FORMA для дефляции
- 💎 Устойчивое создание ценности для холдеров

## ✨ Возможности

### Frontend
- 🎨 **Современный UI** в стиле FOMO.cx (шрифт Gilroy, pill-shaped кнопки)
- 🦊 **MetaMask интеграция** с JWT аутентификацией
- 📊 **CoinGecko Terminal** для отображения цен криптовалют
- 🖼️ **NFT галерея** с фильтрами, поиском и бейджами редкости
- 📈 **Strategy Modal** — полная страница стратегии с графиками и swap-формой
- 📱 **Responsive design** для всех устройств

### Backend
- 🚀 **FastAPI** сервер с REST API
- 🔐 **JWT аутентификация** для кошельков (sign message)
- 🗄️ **MongoDB** для хранения данных
- 📡 **CoinGecko API** интеграция

## 🛠️ Технологии

### Frontend
- React 18
- TailwindCSS
- Framer Motion (анимации)
- Recharts (графики)
- Lucide React (иконки)
- ethers.js v6 (Web3)

### Backend
- Python 3.11+
- FastAPI
- Motor (async MongoDB)
- PyJWT / python-jose
- eth-account (signature verification)
- pycoingecko

### Database
- MongoDB

## 📁 Структура проекта

```
forma-strategy/
├── backend/
│   ├── server.py           # FastAPI сервер
│   ├── requirements.txt    # Python зависимости
│   └── .env               # Переменные окружения
│
├── frontend/
│   ├── public/
│   │   └── logo.svg       # Логотип FORMA
│   ├── src/
│   │   ├── App.js         # Корневой компонент
│   │   ├── index.css      # Глобальные стили + Gilroy
│   │   ├── pages/
│   │   │   └── StrategyMiniApp.js  # Основной компонент
│   │   └── components/
│   │       └── ui/        # Shadcn UI компоненты
│   ├── tailwind.config.js # Конфигурация Tailwind
│   ├── package.json       # Node зависимости
│   └── .env              # Frontend переменные
│
├── docs/
│   ├── API.md            # API документация
│   ├── ARCHITECTURE.md   # Архитектура проекта
│   └── DEPLOYMENT.md     # Инструкции по деплою
│
├── docker-compose.yml    # Docker конфигурация
├── .gitignore
└── README.md
```

## 🚀 Быстрый старт

### Требования
- Node.js 18+
- Python 3.11+
- MongoDB (локально или Atlas)
- Git

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/forma-strategy.git
cd forma-strategy
```

### 2. Настройка Backend

```bash
cd backend

# Создание виртуального окружения
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
.\venv\Scripts\activate   # Windows

# Установка зависимостей
pip install -r requirements.txt

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env файл
```

### 3. Настройка Frontend

```bash
cd frontend

# Установка зависимостей
yarn install
# или
npm install

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env файл
```

### 4. Запуск проекта

**Backend:**
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Frontend:**
```bash
cd frontend
yarn start
# или
npm start
```

Приложение будет доступно по адресу: http://localhost:3000

## 🐳 Docker запуск

```bash
# Запуск всех сервисов
docker-compose up -d

# Остановка
docker-compose down
```

## 📡 API Endpoints

### Аутентификация
| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/auth/nonce` | Получить nonce для подписи |
| POST | `/api/auth/verify` | Верификация подписи, получение JWT |
| GET | `/api/auth/me` | Профиль текущего кошелька |
| POST | `/api/auth/logout` | Выход из сессии |

### Стратегия
| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/strategy/state` | Полное состояние стратегии |
| GET | `/api/stats` | Статистика стратегии |
| GET | `/api/nfts` | Список NFT |
| GET | `/api/transactions` | История транзакций |

### Внешние данные
| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/crypto/price/{coin_id}` | Цена криптовалюты (CoinGecko) |

## ⚙️ Переменные окружения

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=forma_strategy
CORS_ORIGINS=*
JWT_SECRET=your-secret-key-here
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 📚 Документация

- [API Reference](docs/API.md) — Полная документация API
- [Architecture](docs/ARCHITECTURE.md) — Архитектура проекта
- [Deployment](docs/DEPLOYMENT.md) — Инструкции по развертыванию

## 📝 Лицензия

MIT License — см. файл [LICENSE](LICENSE)

## 🤝 Контрибьютинг

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменений (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📞 Контакты

- Website: [fomo.cx](https://www.fomo.cx)

---

<p align="center">
  Made with ❤️ by FORMA Team
</p>
