# API Documentation

## Base URL
```
http://localhost:8001/api
```

## Authentication

### Get Nonce
Получить nonce для подписи кошельком.

**Request:**
```http
POST /api/auth/nonce
Content-Type: application/json

{
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f9e4E8"
}
```

**Response:**
```json
{
  "nonce": "a9635c316d9ba7a11206c36803a2f9e2",
  "message": "Sign this message to authenticate with Forma Strategy.\n\nWallet: 0x742d35cc6634c0532925a3b844bc9e7595f9e4e8\nNonce: a9635c316d9ba7a11206c36803a2f9e2"
}
```

### Verify Signature
Верификация подписи и получение JWT токена.

**Request:**
```http
POST /api/auth/verify
Content-Type: application/json

{
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f9e4E8",
  "signature": "0x...",
  "message": "Sign this message to authenticate..."
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "wallet_address": "0x742d35cc6634c0532925a3b844bc9e7595f9e4e8",
  "expires_in": 86400
}
```

### Get Profile
Получить профиль текущего аутентифицированного кошелька.

**Request:**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "wallet_address": "0x742d35cc6634c0532925a3b844bc9e7595f9e4e8",
  "created_at": "2024-01-02T12:00:00Z",
  "last_active": "2024-01-02T15:30:00Z",
  "total_transactions": 5,
  "nfts_owned": 3
}
```

### Logout
Завершить сессию кошелька.

**Request:**
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Strategy

### Get Strategy State
Получить полное состояние стратегии.

**Request:**
```http
GET /api/strategy/state
```

**Response:**
```json
{
  "timestamp": 1704200000,
  "treasury": {
    "eth_balance": 24.73,
    "target_eth_per_buyback": 3.0
  },
  "nft_supply": {
    "total_minted": 5000,
    "burned": 312,
    "strategy_owned": 148,
    "market_circulating": 4540
  },
  "activity": {
    "nft_bought_total": 460,
    "nft_sold_total": 312,
    "eth_spent_on_buybacks": 128.4,
    "eth_received_from_sales": 96.1
  },
  "market": {
    "floor_price_eth": 1.24,
    "strategy_avg_buy_price": 1.05,
    "strategy_avg_sell_price": 1.18
  },
  "liquidity": {
    "eth_in_lp": 42.0,
    "token_in_lp": 120000
  },
  "distribution": {
    "buyback_nft_pct": 40,
    "buyback_token_pct": 30,
    "liquidity_pct": 20,
    "dev_pct": 10
  },
  "orderbook": [
    {"price": 1.1, "count": 4},
    {"price": 1.15, "count": 7},
    {"price": 1.2, "count": 12}
  ],
  "history": [
    {
      "date": "2024-12-01",
      "floor": 0.92,
      "strategy_buy": 0.88,
      "burned_total": 180,
      "buyback_event": true
    }
  ],
  "nfts": [
    {
      "token_id": 124,
      "price_eth": 1.12,
      "owner": "strategy",
      "status": "available",
      "burn_candidate": false,
      "image": "https://..."
    }
  ]
}
```

### Get Statistics
Получить статистику стратегии.

**Request:**
```http
GET /api/stats
```

**Response:**
```json
{
  "nft_floor_price": 1.24,
  "token_price": 0.0004,
  "market_cap": 406350,
  "total_volume_24h": 405.0,
  "total_nfts_owned": 148,
  "total_buybacks": 460,
  "total_burned": 312,
  "treasury_balance": 24.73
}
```

### Get NFTs
Получить список NFT.

**Request:**
```http
GET /api/nfts
```

**Response:**
```json
[
  {
    "id": "uuid-1",
    "token_id": 124,
    "name": "FORMA #124",
    "image_url": "https://...",
    "purchase_price": 1.05,
    "current_price": 1.12
  }
]
```

### Get Transactions
Получить историю транзакций.

**Request:**
```http
GET /api/transactions
```

**Response:**
```json
[
  {
    "id": "uuid-1",
    "type": "buy",
    "nft_id": 124,
    "price_eth": 1.05,
    "timestamp": "2024-01-02T10:00:00Z",
    "tx_hash": "0x..."
  }
]
```

---

## External Data

### Get Crypto Price
Получить цену криптовалюты через CoinGecko API.

**Request:**
```http
GET /api/crypto/price/ethereum
```

**Response:**
```json
{
  "coin_id": "ethereum",
  "price_usd": 3121.45,
  "price_change_24h": 2.35,
  "market_cap": 375000000000,
  "volume_24h": 12500000000,
  "last_updated": "2024-01-02T15:30:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "No pending authentication. Request nonce first."
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication required"
}
```

### 404 Not Found
```json
{
  "detail": "Cryptocurrency not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "API Error: Connection failed"
}
```

---

## Rate Limits

- CoinGecko API: 30 requests/minute (free tier)
- Auth endpoints: 10 requests/minute per IP
- General API: 100 requests/minute per IP
