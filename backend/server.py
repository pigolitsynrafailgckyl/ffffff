from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from pycoingecko import CoinGeckoAPI
import httpx
import secrets
from jose import jwt, JWTError

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', secrets.token_urlsafe(32))
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# CoinGecko client
cg = CoinGeckoAPI()

# Security
security = HTTPBearer(auto_error=False)

# Create the main app without a prefix
app = FastAPI(title="Forma Strategy API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class NFT(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    token_id: int
    name: str
    image_url: str
    purchase_price: float
    current_price: float
    purchase_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "owned"  # owned, listed, sold

class NFTCreate(BaseModel):
    token_id: int
    name: str
    image_url: str
    purchase_price: float
    current_price: float

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # buy, sell, burn
    nft_token_id: Optional[int] = None
    amount: float
    price: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    description: str

class TransactionCreate(BaseModel):
    type: str
    nft_token_id: Optional[int] = None
    amount: float
    price: float
    description: str

class Statistics(BaseModel):
    nft_floor_price: float
    token_price: float
    market_cap: float
    total_volume_24h: float
    total_nfts_owned: int
    total_buybacks: int
    total_burned: int
    treasury_balance: float

# Wallet Authentication Models
class WalletNonce(BaseModel):
    """Nonce for wallet signature verification"""
    wallet_address: str
    nonce: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc) + timedelta(minutes=10))

class WalletSession(BaseModel):
    """Wallet session stored in DB"""
    wallet_address: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_active: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

class WalletConnectRequest(BaseModel):
    """Request to get nonce for wallet connection"""
    wallet_address: str

class WalletVerifyRequest(BaseModel):
    """Request to verify wallet signature"""
    wallet_address: str
    signature: str
    message: str

class WalletAuthResponse(BaseModel):
    """Response with JWT token after successful verification"""
    token: str
    wallet_address: str
    expires_in: int  # seconds

class WalletProfile(BaseModel):
    """User profile based on wallet"""
    wallet_address: str
    created_at: datetime
    last_active: datetime
    total_transactions: int = 0
    nfts_owned: int = 0

class StrategyState(BaseModel):
    """Full strategy state for mini-app"""
    timestamp: int
    treasury: dict
    nft_supply: dict
    activity: dict
    market: dict
    liquidity: dict
    distribution: dict
    orderbook: List[dict]
    history: List[dict]
    nfts: List[dict]

class CalculatorInput(BaseModel):
    nft_price: float
    time_horizon: int  # days
    daily_volume: float  # in ETH/USDT
    fee_percentage: float = 1.0
    buyback_nft_percentage: float = 40.0
    buyback_token_percentage: float = 30.0
    lp_percentage: float = 20.0
    dev_percentage: float = 10.0
    current_supply: int = 10000
    burn_percentage: float = 70.0
    impact_strength: float = 0.5  # 0 to 1

class CalculatorResult(BaseModel):
    treasury_inflow: float
    buyback_nft_budget: float
    buyback_token_budget: float
    nfts_buyable: float
    nfts_burned: float
    supply_after: int
    supply_reduction_percent: float
    value_per_nft: float
    price_scenarios: dict

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Forma Strategy API"}

# NFT Routes
@api_router.get("/nfts", response_model=List[NFT])
async def get_nfts(limit: int = 20):
    nfts = await db.nfts.find({}, {"_id": 0}).sort("purchase_date", -1).limit(limit).to_list(limit)
    for nft in nfts:
        if isinstance(nft['purchase_date'], str):
            nft['purchase_date'] = datetime.fromisoformat(nft['purchase_date'])
    return nfts

@api_router.post("/nfts", response_model=NFT)
async def create_nft(nft_input: NFTCreate):
    nft_dict = nft_input.model_dump()
    nft_obj = NFT(**nft_dict)
    doc = nft_obj.model_dump()
    doc['purchase_date'] = doc['purchase_date'].isoformat()
    await db.nfts.insert_one(doc)
    return nft_obj

# Transaction Routes
@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(limit: int = 50):
    transactions = await db.transactions.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
    for tx in transactions:
        if isinstance(tx['timestamp'], str):
            tx['timestamp'] = datetime.fromisoformat(tx['timestamp'])
    return transactions

@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(tx_input: TransactionCreate):
    tx_dict = tx_input.model_dump()
    tx_obj = Transaction(**tx_dict)
    doc = tx_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.transactions.insert_one(doc)
    return tx_obj

# Statistics Route
@api_router.get("/statistics", response_model=Statistics)
async def get_statistics():
    # Mock data for now
    nft_count = await db.nfts.count_documents({"status": "owned"})
    buyback_count = await db.transactions.count_documents({"type": "buy"})
    burn_count = await db.transactions.count_documents({"type": "burn"})
    
    return Statistics(
        nft_floor_price=42.5,
        token_price=0.0245,
        market_cap=24500000,
        total_volume_24h=1850000,
        total_nfts_owned=nft_count,
        total_buybacks=buyback_count,
        total_burned=burn_count,
        treasury_balance=125000
    )

# Calculator Route
@api_router.post("/calculator", response_model=CalculatorResult)
async def calculate_yield(calc_input: CalculatorInput):
    # Calculate Treasury inflow
    total_volume = calc_input.daily_volume * calc_input.time_horizon
    treasury_inflow = total_volume * (calc_input.fee_percentage / 100)
    
    # Calculate budgets
    buyback_nft_budget = treasury_inflow * (calc_input.buyback_nft_percentage / 100)
    buyback_token_budget = treasury_inflow * (calc_input.buyback_token_percentage / 100)
    
    # Calculate NFT buybacks and burns
    nfts_buyable = buyback_nft_budget / calc_input.nft_price
    nfts_burned = nfts_buyable * (calc_input.burn_percentage / 100)
    supply_after = calc_input.current_supply - int(nfts_burned)
    supply_reduction = (nfts_burned / calc_input.current_supply) * 100
    
    # Calculate value per NFT
    value_per_nft = treasury_inflow / calc_input.current_supply
    
    # Calculate price scenarios
    k = calc_input.impact_strength
    if supply_after > 0:
        price_multiplier = (calc_input.current_supply / supply_after) ** k
    else:
        price_multiplier = 1.0
    
    price_scenarios = {
        "conservative": round(calc_input.nft_price, 2),
        "base": round(calc_input.nft_price * ((calc_input.current_supply / supply_after) ** 0.5), 2),
        "aggressive": round(calc_input.nft_price * price_multiplier, 2)
    }
    
    return CalculatorResult(
        treasury_inflow=round(treasury_inflow, 2),
        buyback_nft_budget=round(buyback_nft_budget, 2),
        buyback_token_budget=round(buyback_token_budget, 2),
        nfts_buyable=round(nfts_buyable, 2),
        nfts_burned=round(nfts_burned, 2),
        supply_after=supply_after,
        supply_reduction_percent=round(supply_reduction, 2),
        value_per_nft=round(value_per_nft, 4),
        price_scenarios=price_scenarios
    )

# CoinGecko Integration
@api_router.get("/crypto/price/{coin_id}")
async def get_crypto_price(coin_id: str):
    try:
        data = cg.get_price(
            ids=coin_id,
            vs_currencies='usd',
            include_24hr_change=True,
            include_market_cap=True,
            include_24hr_vol=True
        )
        
        if coin_id not in data:
            raise HTTPException(status_code=404, detail="Cryptocurrency not found")
        
        return {
            "coin_id": coin_id,
            "price_usd": data[coin_id]['usd'],
            "price_change_24h": data[coin_id].get('usd_24h_change', 0),
            "market_cap": data[coin_id].get('usd_market_cap', 0),
            "volume_24h": data[coin_id].get('usd_24h_vol', 0),
            "last_updated": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API Error: {str(e)}")

# Strategy State Route for Mini-App
@api_router.get("/strategy/state", response_model=StrategyState)
async def get_strategy_state():
    """Get full strategy state from MongoDB or return default"""
    try:
        # Try to get from database
        state = await db.strategy_state.find_one({}, {"_id": 0})
        
        if state:
            return StrategyState(**state)
        
        # Return default state if not in DB
        import time
        return StrategyState(
            timestamp=int(time.time()),
            treasury={
                "eth_balance": 24.73,
                "target_eth_per_buyback": 3.0
            },
            nft_supply={
                "total_minted": 5000,
                "burned": 312,
                "strategy_owned": 148,
                "market_circulating": 4540
            },
            activity={
                "nft_bought_total": 460,
                "nft_sold_total": 312,
                "eth_spent_on_buybacks": 128.4,
                "eth_received_from_sales": 96.1
            },
            market={
                "floor_price_eth": 1.24,
                "strategy_avg_buy_price": 1.05,
                "strategy_avg_sell_price": 1.18
            },
            liquidity={
                "eth_in_lp": 42.0,
                "token_in_lp": 120000
            },
            distribution={
                "buyback_nft_pct": 40,
                "buyback_token_pct": 30,
                "liquidity_pct": 20,
                "dev_pct": 10
            },
            orderbook=[
                {"price": 1.1, "count": 4},
                {"price": 1.15, "count": 7},
                {"price": 1.2, "count": 12}
            ],
            history=[
                {"date": "2024-12-01", "floor": 0.92, "strategy_buy": 0.88, "burned_total": 180, "buyback_event": True},
                {"date": "2024-12-08", "floor": 0.98, "strategy_buy": 0.92, "burned_total": 200, "buyback_event": False},
                {"date": "2024-12-15", "floor": 1.05, "strategy_buy": 0.96, "burned_total": 240, "buyback_event": False},
                {"date": "2024-12-22", "floor": 1.15, "strategy_buy": 1.00, "burned_total": 280, "buyback_event": True},
                {"date": "2024-12-29", "floor": 1.24, "strategy_buy": 1.05, "burned_total": 312, "buyback_event": False}
            ],
            nfts=[
                {"token_id": 124, "price_eth": 1.12, "owner": "strategy", "status": "available", "burn_candidate": False, "image": "https://images.unsplash.com/photo-1764437358350-e324534072d7?w=400"},
                {"token_id": 128, "price_eth": 1.08, "owner": "market", "status": "available", "burn_candidate": True, "image": "https://images.unsplash.com/photo-1759270463164-dcd9af6fc77c?w=400"},
                {"token_id": 135, "price_eth": 1.22, "owner": "strategy", "status": "available", "burn_candidate": False, "image": "https://images.unsplash.com/photo-1763920999620-f76ea1aeb3ac?w=400"},
                {"token_id": 142, "price_eth": 1.15, "owner": "market", "status": "available", "burn_candidate": False, "image": "https://images.unsplash.com/photo-1759270463255-70ef839296bd?w=400"},
                {"token_id": 156, "price_eth": 1.18, "owner": "strategy", "status": "listed", "burn_candidate": False, "image": "https://images.unsplash.com/photo-1764437358350-e324534072d7?w=400"},
                {"token_id": 189, "price_eth": 1.09, "owner": "market", "status": "available", "burn_candidate": True, "image": "https://images.unsplash.com/photo-1759270463164-dcd9af6fc77c?w=400"}
            ]
        )
    except Exception as e:
        logger.error(f"Error fetching strategy state: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()