import requests
import sys
import json
from datetime import datetime

class FormaStrategyAPITester:
    def __init__(self, base_url="https://strategy-platform.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": "Request timeout"
            })
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": "Connection error"
            })
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "api/", 200)

    def test_statistics_endpoint(self):
        """Test statistics endpoint"""
        success, response = self.run_test("Statistics", "GET", "api/statistics", 200)
        if success:
            required_fields = ['nft_floor_price', 'token_price', 'market_cap', 'total_volume_24h', 
                             'total_nfts_owned', 'total_buybacks', 'total_burned', 'treasury_balance']
            for field in required_fields:
                if field not in response:
                    print(f"⚠️  Warning: Missing field '{field}' in statistics response")
        return success, response

    def test_nfts_endpoint(self):
        """Test NFTs endpoint"""
        success, response = self.run_test("Get NFTs", "GET", "api/nfts", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} NFTs")
            if len(response) > 0:
                nft = response[0]
                required_fields = ['id', 'token_id', 'name', 'image_url', 'purchase_price', 'current_price']
                for field in required_fields:
                    if field not in nft:
                        print(f"⚠️  Warning: Missing field '{field}' in NFT response")
        return success, response

    def test_transactions_endpoint(self):
        """Test transactions endpoint"""
        success, response = self.run_test("Get Transactions", "GET", "api/transactions", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} transactions")
            if len(response) > 0:
                tx = response[0]
                required_fields = ['id', 'type', 'amount', 'price', 'timestamp', 'description']
                for field in required_fields:
                    if field not in tx:
                        print(f"⚠️  Warning: Missing field '{field}' in transaction response")
        return success, response

    def test_calculator_endpoint(self):
        """Test calculator endpoint"""
        calculator_data = {
            "nft_price": 42.5,
            "time_horizon": 30,
            "daily_volume": 50000,
            "fee_percentage": 1.0,
            "buyback_nft_percentage": 40.0,
            "buyback_token_percentage": 30.0,
            "lp_percentage": 20.0,
            "dev_percentage": 10.0,
            "current_supply": 10000,
            "burn_percentage": 70.0,
            "impact_strength": 0.5
        }
        
        success, response = self.run_test("Calculator", "POST", "api/calculator", 200, calculator_data)
        if success:
            required_fields = ['treasury_inflow', 'buyback_nft_budget', 'buyback_token_budget', 
                             'nfts_buyable', 'nfts_burned', 'supply_after', 'supply_reduction_percent',
                             'value_per_nft', 'price_scenarios']
            for field in required_fields:
                if field not in response:
                    print(f"⚠️  Warning: Missing field '{field}' in calculator response")
            
            if 'price_scenarios' in response:
                scenarios = response['price_scenarios']
                for scenario in ['conservative', 'base', 'aggressive']:
                    if scenario not in scenarios:
                        print(f"⚠️  Warning: Missing scenario '{scenario}' in price_scenarios")
        
        return success, response

    def test_crypto_price_endpoint(self):
        """Test crypto price endpoint"""
        success, response = self.run_test("Crypto Price (Bitcoin)", "GET", "api/crypto/price/bitcoin", 200)
        if success:
            required_fields = ['coin_id', 'price_usd', 'price_change_24h', 'market_cap', 'volume_24h', 'last_updated']
            for field in required_fields:
                if field not in response:
                    print(f"⚠️  Warning: Missing field '{field}' in crypto price response")
        return success, response

    def test_create_nft(self):
        """Test creating a new NFT"""
        nft_data = {
            "token_id": 9999,
            "name": "Test NFT #9999",
            "image_url": "https://images.unsplash.com/photo-1764437358350-e324534072d7?crop=entropy&cs=srgb&fm=jpg&q=85",
            "purchase_price": 45.0,
            "current_price": 47.5
        }
        
        return self.run_test("Create NFT", "POST", "api/nfts", 200, nft_data)

    def test_create_transaction(self):
        """Test creating a new transaction"""
        tx_data = {
            "type": "buy",
            "nft_token_id": 9999,
            "amount": 1,
            "price": 45.0,
            "description": "Test NFT purchase"
        }
        
        return self.run_test("Create Transaction", "POST", "api/transactions", 200, tx_data)

def main():
    print("🚀 Starting Forma Strategy API Tests")
    print("=" * 50)
    
    tester = FormaStrategyAPITester()
    
    # Test all endpoints
    print("\n📊 Testing Core Endpoints...")
    tester.test_root_endpoint()
    tester.test_statistics_endpoint()
    tester.test_nfts_endpoint()
    tester.test_transactions_endpoint()
    
    print("\n🧮 Testing Calculator...")
    tester.test_calculator_endpoint()
    
    print("\n💰 Testing Crypto Price API...")
    tester.test_crypto_price_endpoint()
    
    print("\n📝 Testing Data Creation...")
    tester.test_create_nft()
    tester.test_create_transaction()
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Summary:")
    print(f"   Tests run: {tester.tests_run}")
    print(f"   Tests passed: {tester.tests_passed}")
    print(f"   Tests failed: {tester.tests_run - tester.tests_passed}")
    print(f"   Success rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests:")
        for test in tester.failed_tests:
            print(f"   - {test['test']}: {test.get('error', f'Expected {test.get(\"expected\")}, got {test.get(\"actual\")}')}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())