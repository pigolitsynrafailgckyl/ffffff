# FORMA Strategy - Product Requirements Document

## Original Problem Statement
Create "Forma Strategy" project, conceptually similar to "NFT Strategy" and "PunkStrategy". The application is an NFT buyback and burn mechanism mini-app with:
- MetaMask wallet connection for authentication
- Design aesthetic inspired by fomo.cx and punkstrategy.fun
- NFT/token prices display
- Strategy explanation
- Link to external NFT marketplace (fomo.cx)
- CoinGecko Terminal integration for live crypto prices
- Data mocked initially using MongoDB

## User Personas
- **Crypto Traders**: Users who want to participate in NFT buyback strategy
- **NFT Collectors**: Users looking to buy/sell NFTs on the platform
- **DeFi Enthusiasts**: Users interested in token burns and sustainable value mechanisms

## Core Requirements
1. **Mini-App UI** (✅ Complete)
   - Compact, non-scrolling UI with icon-based navigation
   - Light theme with Manrope/Inter fonts
   - Views: Home, Statistics, NFTs, Leaderboard

2. **MetaMask Integration** (✅ Complete)
   - Connect Wallet button with proper states
   - Wallet address display when connected
   - Account change detection
   - Error handling for missing MetaMask

3. **CoinGecko Terminal** (✅ Complete)
   - Real-time prices for BTC, ETH, SOL
   - 24h price change percentage
   - Market cap display
   - Auto-refresh every 60 seconds

4. **Logo Implementation** (✅ Complete)
   - Full SVG logo without container box
   - Located at /logo.svg

## Tech Stack
- **Frontend**: React, TailwindCSS, recharts, framer-motion, lucide-react, ethers.js v6
- **Backend**: FastAPI, pymongo
- **Database**: MongoDB

## What's Been Implemented

### January 2, 2026 (Session 2 - P2)
- ✅ **Backend API Integration**: Frontend now fetches data from `/api/strategy/state` instead of static JSON
- ✅ **Cleanup**: Removed unused files:
  - `/app/frontend/src/pages/StrategyDashboard.js`
  - `/app/frontend/src/pages/StrategyPage.js`
  - `/app/frontend/src/data/strategy_state.json`
- ✅ **Loading/Error States**: Added loading spinner and error handling with retry button

### January 2, 2026 (Session 1 - P0-P1)
- ✅ **P0 - Logo Implementation**: Official FOMO logo without container box
- ✅ **P1 - MetaMask Wallet Connection**: 
  - Connect/Disconnect functionality
  - Wallet address display (truncated format)
  - Account change listeners
  - Error handling (Russian localization)
- ✅ **P1 - CoinGecko Market Terminal**:
  - Real-time BTC, ETH, SOL prices
  - 24h change percentage with color coding
  - Market cap display
  - Refresh button with loading state
  - "Powered by CoinGecko" attribution

### Previous Sessions
- ✅ Mini-App UI with 4 views (Home, Stats, NFTs, Leaderboard)
- ✅ Mock data endpoints in backend
- ✅ Design styling matching voice-club-platform reference

## Prioritized Backlog

### P0 (Critical) - None remaining

### P1 (High Priority)
- Backend wallet authentication with JWT tokens
- Store wallet sessions in MongoDB

### P2 (Medium Priority) - Completed
- ~~Transition from mock data to real API~~ ✅
- ~~Cleanup unused components from previous iterations~~ ✅

### Future/Backlog
- Full smart contract integration
- Real NFT data from blockchain
- User profile management
- Transaction history from chain

## Architecture
```
/app/
├── backend/
│   ├── server.py           # FastAPI with mock endpoints
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── logo.svg        # Official FOMO logo
│   └── src/
│       ├── pages/
│       │   └── StrategyMiniApp.js  # Main mini-app component
│       └── data/
│           └── strategy_state.json # Mock data
└── memory/
    └── PRD.md              # This file
```

## Key API Endpoints (Backend)
- GET /api/stats - Strategy statistics
- GET /api/nfts - NFT listings
- GET /api/transactions - Transaction history

## External Integrations
- **CoinGecko API**: Public API for crypto prices (no key required)
- **MetaMask**: Browser wallet via window.ethereum

## Testing Status
- ✅ Frontend testing: 100% pass rate
- ✅ CoinGecko Terminal verified with live data
- ✅ Navigation between all views working
- ✅ MetaMask error handling verified

## Known Limitations
- **MOCKED**: Strategy data is from static JSON file
- **MOCKED**: Wallet connection doesn't persist sessions
- MetaMask testing requires browser extension
