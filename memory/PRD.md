# FORMA Strategy - Product Requirements Document

## Original Problem Statement
Create "Forma Strategy" project - NFT buyback and burn mechanism platform inspired by FOMO.cx, PunkStrategy, and NFTStrategy. The application implements a "Perpetual NFT Machine" with:
- MetaMask wallet connection for authentication
- Design aesthetic inspired by fomo.cx (Gilroy font, pill-shaped buttons)
- NFT/token prices display with CoinGecko integration
- Strategy explanation and mechanics
- Link to external NFT marketplace (fomo.cx)
- Full-featured Strategy Modal with swap functionality

## User Personas
- **Crypto Traders**: Users who want to participate in NFT buyback strategy
- **NFT Collectors**: Users looking to buy/sell NFTs on the platform
- **DeFi Enthusiasts**: Users interested in token burns and sustainable value mechanisms

## Core Requirements - ALL COMPLETED ✅

### 1. Mini-App UI ✅
- Compact UI with icon-based navigation
- Light theme with Gilroy font
- Views: Home, Statistics, NFTs
- Responsive design for all devices

### 2. MetaMask Integration ✅
- Connect Wallet button with proper states
- JWT authentication via message signing
- Wallet address display when connected
- Account change detection
- Session persistence in localStorage

### 3. CoinGecko Terminal ✅
- Real-time prices for BTC, ETH, SOL
- 24h price change percentage
- Market cap display
- Auto-refresh every 60 seconds

### 4. NFT Gallery ✅
- Search and filter functionality
- Rarity badges (Epic, Legendary, Rare, FOMO Gold)
- Favorites system
- Below Floor filter
- Views count, Round, Chain info

### 5. Strategy Detail Modal ✅
- Token price and market data
- FORMA/ETH chart with timeframes
- Swap form (ETH ↔ FORMA)
- Holdings and Sales tabs
- Treasury info and progress bar
- Burn statistics
- Mechanics description

## Tech Stack
- **Frontend**: React 18, TailwindCSS, Framer Motion, Recharts, Lucide React, ethers.js v6
- **Backend**: Python 3.11, FastAPI, Motor (async MongoDB), PyJWT, eth-account, pycoingecko
- **Database**: MongoDB

## What's Been Implemented

### January 2, 2026 - Full Implementation
- ✅ **P0 - Logo Implementation**: Official FOMO logo without container box
- ✅ **P1 - MetaMask Wallet Connection**: Full JWT auth flow
- ✅ **P1 - CoinGecko Market Terminal**: Real-time crypto prices
- ✅ **P2 - Backend API Integration**: Frontend fetches from API
- ✅ **P2 - Code Cleanup**: Removed unused files
- ✅ **P1 - JWT Authentication**: Backend wallet auth with sessions
- ✅ **Design Update**: Gilroy font, FOMO.cx style (pill buttons, icons)
- ✅ **NFTs Redesign**: Filters, search, rarity badges, favorites
- ✅ **Stats Redesign**: Compact metrics, activity summary, charts
- ✅ **Strategy Modal**: Full nftstrategy.fun-style page

## API Endpoints
- `POST /api/auth/nonce` - Get nonce for wallet signature
- `POST /api/auth/verify` - Verify signature and get JWT
- `GET /api/auth/me` - Get authenticated wallet profile
- `POST /api/auth/logout` - Logout wallet session
- `GET /api/strategy/state` - Full strategy state
- `GET /api/stats` - Strategy statistics
- `GET /api/nfts` - NFT listings
- `GET /api/transactions` - Transaction history
- `GET /api/crypto/price/{coin_id}` - CoinGecko data

## Project Structure
```
forma-strategy/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/StrategyMiniApp.js
│   │   └── ...
│   ├── public/logo.svg
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
├── docker-compose.yml
├── start.sh
├── README.md
└── LICENSE
```

## Deployment Options
1. **Local Development**: `./start.sh dev`
2. **Docker**: `docker-compose up -d`
3. **Production**: See docs/DEPLOYMENT.md

## Future/Backlog
- Smart contract integration for real swap
- Real NFT data from blockchain
- Transaction history from chain
- Admin dashboard

## Known Limitations
- Strategy data uses default values (not from smart contracts yet)
- Swap form is UI-only (no actual Web3 transactions)
- CoinGecko API has rate limits (30 req/min)
