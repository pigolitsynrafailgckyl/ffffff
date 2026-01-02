#!/usr/bin/env python3
"""Initialize mock data for Forma Strategy"""
import sys
import os
from pymongo import MongoClient
from datetime import datetime, timezone, timedelta
import random

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

client = MongoClient(mongo_url)
db = client[db_name]

# Clear existing data
print("Clearing existing data...")
db.nfts.delete_many({})
db.transactions.delete_many({})

# Mock NFT images
nft_images = [
    "https://images.unsplash.com/photo-1764437358350-e324534072d7?crop=entropy&cs=srgb&fm=jpg&q=85",
    "https://images.unsplash.com/photo-1759270463164-dcd9af6fc77c?crop=entropy&cs=srgb&fm=jpg&q=85",
    "https://images.unsplash.com/photo-1763920999620-f76ea1aeb3ac?crop=entropy&cs=srgb&fm=jpg&q=85",
    "https://images.unsplash.com/photo-1759270463255-70ef839296bd?crop=entropy&cs=srgb&fm=jpg&q=85",
]

# Create NFTs
print("Creating NFTs...")
nfts = []
for i in range(1, 25):
    nft = {
        "id": f"nft-{i}",
        "token_id": 5000 + i,
        "name": f"Forma #{5000 + i}",
        "image_url": random.choice(nft_images),
        "purchase_price": round(random.uniform(40.0, 45.0), 2),
        "current_price": round(random.uniform(42.0, 48.0), 2),
        "purchase_date": (datetime.now(timezone.utc) - timedelta(days=random.randint(1, 60))).isoformat(),
        "status": "owned"
    }
    nfts.append(nft)

db.nfts.insert_many(nfts)
print(f"Created {len(nfts)} NFTs")

# Create transactions
print("Creating transactions...")
transactions = []
tx_types = ["buy", "sell", "burn"]
descriptions = {
    "buy": lambda i: f"NFT #{5000 + i} acquired via buyback",
    "sell": lambda i: f"NFT #{5000 + i} sold at 1.2x",
    "burn": lambda: f"Token burn from NFT sale proceeds"
}

for i in range(1, 51):
    tx_type = random.choice(tx_types)
    tx = {
        "id": f"tx-{i}",
        "type": tx_type,
        "nft_token_id": 5000 + random.randint(1, 24) if tx_type in ["buy", "sell"] else None,
        "amount": round(random.uniform(1, 10000), 2) if tx_type == "burn" else 1,
        "price": round(random.uniform(0.020, 0.030), 4) if tx_type == "burn" else round(random.uniform(40.0, 50.0), 2),
        "timestamp": (datetime.now(timezone.utc) - timedelta(hours=random.randint(1, 720))).isoformat(),
        "description": descriptions[tx_type](random.randint(1, 24)) if tx_type != "burn" else descriptions[tx_type]()
    }
    transactions.append(tx)

db.transactions.insert_many(transactions)
print(f"Created {len(transactions)} transactions")

print("\\nMock data initialization complete!")
print(f"- NFTs: {len(nfts)}")
print(f"- Transactions: {len(transactions)}")
