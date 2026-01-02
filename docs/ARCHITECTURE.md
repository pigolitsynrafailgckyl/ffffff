# Architecture Documentation

## Обзор системы

FORMA Strategy — это full-stack веб-приложение для управления NFT buyback стратегией. Система состоит из трёх основных компонентов:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│     Backend     │────▶│    MongoDB      │
│   (React SPA)   │◀────│   (FastAPI)     │◀────│   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│    MetaMask     │     │   CoinGecko     │
│   (Web3 Auth)   │     │     (API)       │
└─────────────────┘     └─────────────────┘
```

---

## Frontend Architecture

### Технологический стек
- **React 18** — UI библиотека
- **TailwindCSS** — CSS фреймворк
- **Framer Motion** — анимации
- **Recharts** — графики
- **ethers.js v6** — Web3 взаимодействие

### Структура компонентов

```
src/
├── App.js                    # Корневой роутер
├── index.css                 # Глобальные стили
│
├── pages/
│   └── StrategyMiniApp.js    # Главный компонент
│       ├── StrategyDetailModal   # Модальное окно
│       ├── HomeView              # Домашняя страница
│       ├── StatsView             # Статистика
│       ├── NFTsView              # Галерея NFT
│       ├── CoinGeckoTerminal     # Виджет цен
│       ├── StatCard              # Карточка статистики
│       └── Step                  # Шаг в How It Works
│
└── components/
    └── ui/                   # Shadcn UI компоненты
```

### State Management

```javascript
// Основные состояния в StrategyMiniApp
const [activeView, setActiveView] = useState('home');     // Текущий view
const [data, setData] = useState(null);                   // Данные стратегии
const [walletAddress, setWalletAddress] = useState(null); // Адрес кошелька
const [authToken, setAuthToken] = useState(null);         // JWT токен
const [isModalOpen, setIsModalOpen] = useState(false);    // Модальное окно
const [selectedNft, setSelectedNft] = useState(null);     // Выбранный NFT
```

### Data Flow

```
User Action → Event Handler → API Call → State Update → Re-render
     │                            │
     │                            ▼
     │                    ┌──────────────┐
     └───────────────────▶│   Backend    │
                          │     API      │
                          └──────────────┘
```

---

## Backend Architecture

### Технологический стек
- **FastAPI** — асинхронный веб-фреймворк
- **Motor** — асинхронный MongoDB драйвер
- **python-jose** — JWT обработка
- **eth-account** — Ethereum подписи
- **pycoingecko** — CoinGecko API клиент

### Структура сервера

```python
# server.py структура

# 1. Imports & Configuration
from fastapi import FastAPI, APIRouter
# JWT, MongoDB, CoinGecko setup

# 2. Pydantic Models
class WalletConnectRequest(BaseModel): ...
class WalletVerifyRequest(BaseModel): ...
class StrategyState(BaseModel): ...

# 3. JWT Helper Functions
def create_jwt_token(wallet_address): ...
def verify_jwt_token(token): ...
async def get_current_wallet(credentials): ...

# 4. API Routes
@api_router.post("/auth/nonce")
@api_router.post("/auth/verify")
@api_router.get("/auth/me")
@api_router.get("/strategy/state")
@api_router.get("/crypto/price/{coin_id}")
```

### Authentication Flow

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client    │         │   Server    │         │  MongoDB    │
└─────────────┘         └─────────────┘         └─────────────┘
      │                       │                       │
      │  POST /auth/nonce     │                       │
      │──────────────────────▶│                       │
      │                       │  Store nonce          │
      │                       │──────────────────────▶│
      │  { nonce, message }   │                       │
      │◀──────────────────────│                       │
      │                       │                       │
      │  Sign with MetaMask   │                       │
      │                       │                       │
      │  POST /auth/verify    │                       │
      │──────────────────────▶│                       │
      │                       │  Verify signature     │
      │                       │  Create session       │
      │                       │──────────────────────▶│
      │  { token }            │                       │
      │◀──────────────────────│                       │
      │                       │                       │
      │  GET /auth/me         │                       │
      │  Authorization: Bearer│                       │
      │──────────────────────▶│                       │
      │  { profile }          │                       │
      │◀──────────────────────│                       │
```

---

## Database Schema

### Collections

#### wallet_nonces
Временные nonce для аутентификации (TTL: 10 минут)
```json
{
  "wallet_address": "0x...",
  "nonce": "random_hex_string",
  "message": "Sign this message...",
  "created_at": "2024-01-02T12:00:00Z",
  "expires_at": "2024-01-02T12:10:00Z"
}
```

#### wallet_sessions
Сессии аутентифицированных кошельков
```json
{
  "wallet_address": "0x...",
  "created_at": "2024-01-02T12:00:00Z",
  "last_active": "2024-01-02T15:30:00Z",
  "is_active": true
}
```

#### nfts
NFT коллекция
```json
{
  "token_id": 124,
  "name": "FORMA #124",
  "image": "https://...",
  "price_eth": 1.12,
  "owner": "strategy",
  "status": "available"
}
```

#### transactions
История транзакций
```json
{
  "type": "buy",
  "nft_id": 124,
  "price_eth": 1.05,
  "timestamp": "2024-01-02T10:00:00Z",
  "tx_hash": "0x..."
}
```

---

## Security

### JWT Token
- Algorithm: HS256
- Expiration: 24 hours
- Payload: `{ sub: wallet_address, exp, iat, type }`

### Signature Verification
```python
from eth_account.messages import encode_defunct
from eth_account import Account

message = encode_defunct(text=message_text)
recovered_address = Account.recover_message(message, signature=signature)
# Compare with claimed address
```

### CORS
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В production указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## External Integrations

### MetaMask (Frontend)
```javascript
// Подключение кошелька
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts'
});

// Подпись сообщения
const signature = await window.ethereum.request({
  method: 'personal_sign',
  params: [message, address]
});
```

### CoinGecko API (Backend)
```python
from pycoingecko import CoinGeckoAPI
cg = CoinGeckoAPI()

data = cg.get_price(
    ids='ethereum',
    vs_currencies='usd',
    include_24hr_change=True,
    include_market_cap=True
)
```

---

## Performance Considerations

### Frontend
- Lazy loading компонентов
- Memoization с useMemo/useCallback
- Debounced поиск
- Virtual scrolling для больших списков

### Backend
- Async/await для всех I/O операций
- Connection pooling для MongoDB
- Caching для CoinGecko данных
- Индексы в MongoDB для частых запросов

### Caching Strategy
```
┌─────────────────────────────────────────────────┐
│                   Caching Layers                 │
├─────────────────────────────────────────────────┤
│  Browser     │  localStorage (JWT, preferences)  │
│  Frontend    │  React state (session data)       │
│  Backend     │  In-memory (CoinGecko, 60s TTL)   │
│  Database    │  MongoDB indexes                  │
└─────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Production Setup
```
                    ┌─────────────────┐
                    │   Load Balancer │
                    │   (Nginx/CF)    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     ┌────────▼────────┐          ┌────────▼────────┐
     │    Frontend     │          │     Backend      │
     │   (Static/CDN)  │          │   (Container)    │
     └─────────────────┘          └────────┬─────────┘
                                           │
                                  ┌────────▼────────┐
                                  │    MongoDB      │
                                  │    (Atlas)      │
                                  └─────────────────┘
```

### Environment Variables
```bash
# Production
MONGO_URL=mongodb+srv://...
JWT_SECRET=<strong-random-secret>
CORS_ORIGINS=https://forma-strategy.com
```
