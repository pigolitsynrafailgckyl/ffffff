import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Home, BarChart3, ShoppingBag, Info, Flame, TrendingUp, Wallet, ExternalLink, RefreshCw, AlertCircle, LogOut, CheckCircle, Star, Eye, ChevronRight, Search, Filter, ArrowUpRight, ArrowDownRight, Zap, Target, Activity, X, DollarSign, Layers, TrendingDown, Clock, ShoppingCart, Package, BarChart2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// Strategy Detail Modal Component
const StrategyDetailModal = ({ isOpen, onClose, nft, strategyData }) => {
  const [buyAmount, setBuyAmount] = useState('');
  const [activeTab, setActiveTab] = useState('holdings');
  
  if (!isOpen || !nft) return null;

  const progressToNextBuy = 15.7; // % progress to next buyback
  const ethNeeded = 0.067; // ETH needed to trigger buyback
  const burnedPercent = 22.55;
  const burnedTokens = 225495742;
  
  // Mock sales data
  const salesHistory = [
    { id: 2702, paid: 0.083, sold: 0.100, profit: 0.017 },
    { id: 3655, paid: 0.084, sold: 0.101, profit: 0.017 },
    { id: 9366, paid: 0.098, sold: 0.118, profit: 0.020 },
    { id: 6283, paid: 0.110, sold: 0.132, profit: 0.022 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl my-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <img src={nft.image} alt={nft.project} className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">FORMA Strategy</h2>
                <p className="text-sm text-gray-500">$FORMA • Perpetual NFT Machine</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            
            {/* Left Column - NFT Info & Chart */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Token Price Section */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">$FORMA Price</p>
                    <div className="flex items-center gap-3">
                      <p className="text-3xl font-bold text-gray-900">$0.000400</p>
                      <span className="text-sm font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+3.23%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Market Cap</p>
                    <p className="text-lg font-bold text-gray-900">$406.35K</p>
                  </div>
                </div>
                
                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-400">24h Volume</p>
                    <p className="text-sm font-semibold text-gray-900">$405.00</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Liquidity</p>
                    <p className="text-sm font-semibold text-gray-900">$288.1K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Holders</p>
                    <p className="text-sm font-semibold text-gray-900">943</p>
                  </div>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">FORMA/ETH Chart</h3>
                  <div className="flex gap-1">
                    {['1h', '4h', 'D', 'W'].map(tf => (
                      <button key={tf} className="px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-200 rounded-full transition-all">
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={strategyData?.history || []}>
                    <defs>
                      <linearGradient id="modalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '10px' }} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} tickLine={false} axisLine={false} />
                    <Area type="monotone" dataKey="floor" stroke="#10b981" strokeWidth={2} fill="url(#modalGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Holdings & Sales Tabs */}
              <div className="bg-gray-50 rounded-2xl overflow-hidden">
                <div className="flex border-b border-gray-200">
                  <button 
                    onClick={() => setActiveTab('holdings')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${activeTab === 'holdings' ? 'bg-white text-gray-900 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Holdings • {strategyData?.nft_supply?.strategy_owned || 148} NFTs
                  </button>
                  <button 
                    onClick={() => setActiveTab('sales')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${activeTab === 'sales' ? 'bg-white text-gray-900 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Sales • {strategyData?.activity?.nft_sold_total || 312} Sold
                  </button>
                </div>
                
                <div className="p-4 max-h-64 overflow-y-auto">
                  {activeTab === 'holdings' ? (
                    <div className="grid grid-cols-4 gap-3">
                      {strategyData?.nfts?.slice(0, 8).map((nft, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-2 border border-gray-100">
                          <img src={nft.image} alt={`#${nft.token_id}`} className="w-full aspect-square object-cover rounded-lg mb-2" />
                          <p className="text-xs font-bold text-gray-900">#{nft.token_id}</p>
                          <p className="text-xs text-gray-500">{nft.price_eth} ETH</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {salesHistory.map((sale, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">#{sale.id}</p>
                              <p className="text-xs text-gray-500">Paid: {sale.paid} ETH</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{sale.sold} ETH</p>
                            <p className="text-xs text-emerald-500 font-medium">+{sale.profit} ETH</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Buy Form & Stats */}
            <div className="space-y-5">
              
              {/* Swap/Buy Form */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Swap</h3>
                
                {/* Selling */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Selling</span>
                    <span>Balance: 0.0000 ETH</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      placeholder="0.0"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      className="flex-1 text-2xl font-bold bg-transparent focus:outline-none"
                    />
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
                      <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">ETH</span>
                    </div>
                  </div>
                </div>

                {/* Buying */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Buying</span>
                    <span>Balance: 0 FORMA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      placeholder="0.0"
                      className="flex-1 text-2xl font-bold bg-transparent focus:outline-none"
                      readOnly
                    />
                    <div className="flex items-center gap-2 bg-emerald-100 px-3 py-2 rounded-full">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium text-emerald-700">FORMA</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4">Protocol fee: 10% on all swaps</p>

                <button className="w-full bg-emerald-500 text-white py-3 rounded-full font-semibold hover:bg-emerald-600 transition-all hover:shadow-lg hover:shadow-emerald-500/25">
                  Connect Wallet to Swap
                </button>
              </div>

              {/* Fundings */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">FORMA™ is currently holding</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{strategyData?.treasury?.eth_balance || 24.73} ETH</p>
                    <p className="text-xs text-gray-500">+ {strategyData?.nft_supply?.strategy_owned || 148} NFTs</p>
                  </div>
                </div>

                {/* Cheapest on Market */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                  <p className="text-xs text-gray-500 mb-2">Cheapest NFT on Market</p>
                  <div className="flex items-center gap-3">
                    <img src={nft.image} className="w-12 h-12 rounded-lg object-cover" alt="Cheapest" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">#{nft.token_id}</p>
                      <p className="text-lg font-bold text-emerald-500">{strategyData?.market?.floor_price_eth || 1.24} ETH</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>{progressToNextBuy}% Progress</span>
                    <span>{strategyData?.nft_supply?.strategy_owned || 148} NFTs Held</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressToNextBuy}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Burned */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5" />
                  <h3 className="text-sm font-semibold">$FORMA Burned</h3>
                </div>
                <p className="text-3xl font-bold mb-1">{burnedPercent}%</p>
                <p className="text-sm opacity-80">of supply</p>
                <p className="text-xs opacity-60 mt-2">{burnedTokens.toLocaleString()} tokens</p>
              </div>

              {/* Mechanics */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Mechanics</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg h-fit">
                      <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Buy</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        When the machine acquires the missing {ethNeeded} ETH, it will purchase the cheapest available listing from the market.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg h-fit">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Sell</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Purchased NFTs are automatically relisted at 20% increase. Profits are distributed to protocol and liquidity providers.
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 py-2.5 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-all">
                  Need {ethNeeded} more ETH
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const StrategyMiniApp = () => {
  const [activeView, setActiveView] = useState('home'); // home, stats, nfts, leaderboard
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [derived, setDerived] = useState({});
  
  // MetaMask wallet state
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch strategy data from backend API
  const fetchStrategyData = useCallback(async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
      const response = await fetch(`${BACKEND_URL}/api/strategy/state`, { headers });
      
      if (!response.ok) {
        throw new Error('Failed to fetch strategy data');
      }
      
      const strategyData = await response.json();
      setData(strategyData);
    } catch (err) {
      console.error('Error fetching strategy data:', err);
      setApiError('Не удалось загрузить данные стратегии');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchStrategyData();
    checkWalletConnection();
    // Check for saved auth token
    const savedToken = localStorage.getItem('forma_auth_token');
    const savedWallet = localStorage.getItem('forma_wallet_address');
    if (savedToken && savedWallet) {
      setAuthToken(savedToken);
      setWalletAddress(savedWallet);
      setIsAuthenticated(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data) {
      calculateMetrics();
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check if wallet was previously connected
  const checkWalletConnection = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0 && !walletAddress) {
          // Only set address if not already authenticated
          const savedWallet = localStorage.getItem('forma_wallet_address');
          if (!savedWallet) {
            setWalletAddress(accounts[0]);
          }
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    }
  }, [walletAddress]);

  // Authenticate with backend using signature
  const authenticateWallet = useCallback(async (address) => {
    try {
      // Step 1: Get nonce from backend
      const nonceResponse = await fetch(`${BACKEND_URL}/api/auth/nonce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: address })
      });
      
      if (!nonceResponse.ok) {
        throw new Error('Failed to get nonce');
      }
      
      const { message } = await nonceResponse.json();
      
      // Step 2: Sign message with MetaMask
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address]
      });
      
      // Step 3: Verify signature with backend
      const verifyResponse = await fetch(`${BACKEND_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: address,
          signature: signature,
          message: message
        })
      });
      
      if (!verifyResponse.ok) {
        throw new Error('Signature verification failed');
      }
      
      const { token, wallet_address } = await verifyResponse.json();
      
      // Save token and wallet
      localStorage.setItem('forma_auth_token', token);
      localStorage.setItem('forma_wallet_address', wallet_address);
      setAuthToken(token);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      console.error('Authentication error:', err);
      if (err.code === 4001) {
        setWalletError('Подпись отклонена пользователем.');
      } else {
        setWalletError('Ошибка аутентификации.');
      }
      return false;
    }
  }, []);

  // Connect MetaMask wallet
  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      setWalletError('MetaMask не установлен. Пожалуйста, установите MetaMask.');
      return;
    }

    setIsConnecting(true);
    setWalletError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);

        // Authenticate with backend
        const authenticated = await authenticateWallet(address);
        
        if (authenticated) {
          // Listen for account changes
          window.ethereum.on('accountsChanged', async (newAccounts) => {
            if (newAccounts.length === 0) {
              disconnectWallet();
            } else if (newAccounts[0].toLowerCase() !== walletAddress?.toLowerCase()) {
              // New account - re-authenticate
              setWalletAddress(newAccounts[0]);
              setIsAuthenticated(false);
              setAuthToken(null);
              localStorage.removeItem('forma_auth_token');
              localStorage.removeItem('forma_wallet_address');
              await authenticateWallet(newAccounts[0]);
            }
          });

          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        }
      }
    } catch (err) {
      if (err.code === 4001) {
        setWalletError('Подключение отклонено пользователем.');
      } else {
        setWalletError('Ошибка подключения кошелька.');
      }
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [authenticateWallet, walletAddress]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    // Logout from backend
    if (authToken) {
      try {
        await fetch(`${BACKEND_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    
    // Clear local state
    setWalletAddress(null);
    setWalletError(null);
    setAuthToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('forma_auth_token');
    localStorage.removeItem('forma_wallet_address');
  }, [authToken]);

  // Format address for display
  const formatAddress = useCallback((address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  }, []);

  const calculateMetrics = () => {
    if (!data) return;
    
    const buybackProgress = Math.min(1, Math.max(0, data.treasury.eth_balance / data.treasury.target_eth_per_buyback));
    const buybackProgressPercent = (buybackProgress * 100).toFixed(1);
    const gapETH = data.market.floor_price_eth - data.market.strategy_avg_buy_price;
    const gapPercent = (gapETH / data.market.floor_price_eth) * 100;
    const effectiveSupply = data.nft_supply.total_minted - data.nft_supply.burned;
    const burnRatio = (data.nft_supply.burned / data.nft_supply.total_minted) * 100;
    const strategyControl = (data.nft_supply.strategy_owned / effectiveSupply) * 100;
    const nftToFloor = data.orderbook.reduce((sum, order) => sum + order.count, 0);
    const ethToFloor = data.orderbook.reduce((sum, order) => sum + (order.price * order.count), 0);

    setDerived({
      buybackProgress,
      buybackProgressPercent,
      gapETH,
      gapPercent,
      effectiveSupply,
      burnRatio,
      strategyControl,
      nftToFloor,
      ethToFloor
    });
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'stats', icon: BarChart3, label: 'Stats' },
    { id: 'nfts', icon: ShoppingBag, label: 'NFTs' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans" data-testid="strategy-mini-app">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/logo.svg" alt="FORMA Strategy" className="h-10" />
            </div>
            
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeView === item.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                    data-testid={`nav-${item.id}`}
                  >
                    <Icon className="w-[18px] h-[18px] stroke-[1.5]" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
              
              {/* Wallet Connect Button */}
              {walletAddress ? (
                <div className="flex items-center gap-2 ml-3">
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full border ${
                    isAuthenticated 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    {isAuthenticated ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 stroke-[1.5]" />
                    ) : (
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    )}
                    <span className={`text-sm font-medium font-mono ${
                      isAuthenticated ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {formatAddress(walletAddress)}
                    </span>
                  </div>
                  <button 
                    onClick={disconnectWallet}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all duration-200"
                    title="Отключить кошелёк"
                    data-testid="disconnect-wallet-btn"
                  >
                    <LogOut className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-emerald-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-600 transition-all duration-200 ml-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25"
                  data-testid="connect-wallet-btn"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin stroke-[1.5]" />
                      <span className="hidden sm:inline">Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 stroke-[1.5]" />
                      <span className="hidden sm:inline">Connect Wallet</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {walletError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {walletError}
          </div>
        )}
        {apiError && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {apiError}
            <button onClick={fetchStrategyData} className="ml-auto text-yellow-800 hover:text-yellow-900 underline text-sm">
              Повторить
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : data ? (
          <>
            {activeView === 'home' && <HomeView data={data} derived={derived} />}
            {activeView === 'stats' && <StatsView data={data} derived={derived} />}
            {activeView === 'nfts' && <NFTsView data={data} />}
          </>
        ) : null}
      </main>
    </div>
  );
};

// Home View
const HomeView = ({ data, derived }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      data-testid="home-view"
    >
      {/* Hero */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">FORMA Strategy</h1>
        <p className="text-gray-500 leading-relaxed">NFT buyback and burn mechanism for sustainable value</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Members" value="11" />
        <StatCard label="Total NFTs" value={data.nft_supply.strategy_owned} />
        <StatCard label="Burned" value={data.nft_supply.burned} />
        <StatCard label="Buybacks" value={data.activity.nft_bought_total} />
      </div>

      {/* Progress to Buyback */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-semibold text-gray-900">Progress to Next Buyback</h3>
          <span className="text-sm text-gray-500 ml-auto font-medium">{derived.buybackProgressPercent}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${derived.buybackProgressPercent || 0}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 font-medium">{data.treasury.eth_balance} / {data.treasury.target_eth_per_buyback} ETH</p>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Info className="w-5 h-5 text-gray-400 stroke-[1.5]" />
          <h3 className="text-lg font-bold text-gray-900">How It Works</h3>
        </div>
        <div className="space-y-5">
          <Step number="1" title="Trade & Collect" description="Trading fees flow into treasury" />
          <Step number="2" title="Auto Buyback" description="Machine buys floor NFTs automatically" />
          <Step number="3" title="List & Burn" description="Proceeds burn $FORMA tokens" />
          <Step number="4" title="Supply Reduction" description="Continuous value creation" />
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Join the Strategy</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">Start participating in the perpetual buyback machine</p>
        <a
          href="https://www.fomo.cx"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-600 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
        >
          Go to FOMO.cx
          <ExternalLink className="w-4 h-4 stroke-[1.5]" />
        </a>
      </div>
    </motion.div>
  );
};

// CoinGecko Terminal Component
const CoinGeckoTerminal = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchCryptoData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum,bitcoin,solana&order=market_cap_desc&sparkline=false&price_change_percentage=24h'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data');
      }
      
      const data = await response.json();
      setCryptoData(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить данные');
      console.error('CoinGecko API error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [fetchCryptoData]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatMarketCap = (cap) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    return `$${(cap / 1e6).toFixed(2)}M`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="coingecko-terminal">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500 stroke-[1.5]" />
          <h3 className="text-sm font-semibold text-gray-900">Market Terminal</h3>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-xs text-gray-400">
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={fetchCryptoData}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 stroke-[1.5] ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="text-center py-4 text-gray-500 text-sm">{error}</div>
      ) : isLoading && cryptoData.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="space-y-3">
          {cryptoData.map((coin) => (
            <div 
              key={coin.id} 
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all duration-200 rounded-xl px-3 -mx-3"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={coin.image} 
                  alt={coin.name} 
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{coin.name}</p>
                  <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{formatPrice(coin.current_price)}</p>
                <p className={`text-xs font-medium ${
                  coin.price_change_percentage_24h >= 0 ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400">Market Cap</p>
                <p className="text-sm font-medium text-gray-700">{formatMarketCap(coin.market_cap)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <a 
          href="https://www.coingecko.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors duration-200"
        >
          Powered by CoinGecko <ExternalLink className="w-3 h-3 stroke-[1.5]" />
        </a>
      </div>
    </div>
  );
};

// Stats View
const StatsView = ({ data, derived }) => {
  // Generate more detailed history data
  const performanceData = data.history.map((h, idx) => ({
    ...h,
    profit: ((h.floor - h.strategy_buy) * 100 / h.strategy_buy).toFixed(1)
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
      data-testid="stats-view"
    >
      {/* CoinGecko Terminal */}
      <CoinGeckoTerminal />
      
      {/* Key Metrics - Compact Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Wallet className="w-4 h-4 text-blue-500 stroke-[1.5]" />
            </div>
            <p className="text-xs text-gray-400 font-medium">Treasury</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.treasury.eth_balance} ETH</p>
          <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Target: {data.treasury.target_eth_per_buyback} ETH
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-500 stroke-[1.5]" />
            </div>
            <p className="text-xs text-gray-400 font-medium">Market Gap</p>
          </div>
          <p className="text-2xl font-bold text-emerald-500">+{derived.gapETH?.toFixed(3)} ETH</p>
          <p className="text-xs text-gray-400 mt-1">{derived.gapPercent?.toFixed(1)}% below floor</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <Flame className="w-4 h-4 text-orange-500 stroke-[1.5]" />
            </div>
            <p className="text-xs text-gray-400 font-medium">Burned</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.nft_supply.burned}</p>
          <p className="text-xs text-orange-500 mt-1">{derived.burnRatio?.toFixed(1)}% of supply</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-purple-50 rounded-lg">
              <Target className="w-4 h-4 text-purple-500 stroke-[1.5]" />
            </div>
            <p className="text-xs text-gray-400 font-medium">Strategy Control</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{derived.strategyControl?.toFixed(1)}%</p>
          <p className="text-xs text-gray-400 mt-1">{data.nft_supply.strategy_owned} NFTs owned</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Price Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Price History</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Floor</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Strategy Buy</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data.history}>
              <defs>
                <linearGradient id="colorFloor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorStrategy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '10px' }} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} tickLine={false} axisLine={false} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #f3f4f6', borderRadius: '12px', fontSize: '11px', padding: '8px' }}
              />
              <Area type="monotone" dataKey="floor" stroke="#3b82f6" strokeWidth={2} fill="url(#colorFloor)" />
              <Area type="monotone" dataKey="strategy_buy" stroke="#10b981" strokeWidth={2} fill="url(#colorStrategy)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <ArrowUpRight className="w-4 h-4 text-emerald-600 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">NFTs Bought</p>
                  <p className="text-xs text-gray-400">Total acquisitions</p>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900">{data.activity.nft_bought_total}</p>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ArrowDownRight className="w-4 h-4 text-red-600 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">NFTs Sold</p>
                  <p className="text-xs text-gray-400">Total sales</p>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900">{data.activity.nft_sold_total}</p>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-4 h-4 text-blue-600 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">ETH Spent</p>
                  <p className="text-xs text-gray-400">On buybacks</p>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900">{data.activity.eth_spent_on_buybacks} ETH</p>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Zap className="w-4 h-4 text-amber-600 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">ETH Received</p>
                  <p className="text-xs text-gray-400">From sales</p>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900">{data.activity.eth_received_from_sales} ETH</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Orderbook and Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Orderbook */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Orderbook</h3>
          <div className="space-y-2">
            {data.orderbook.map((order, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1 bg-emerald-50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(order.count / Math.max(...data.orderbook.map(o => o.count))) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-20">{order.price} ETH</span>
                <span className="text-sm font-bold text-gray-900 w-16 text-right">{order.count} NFTs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Fee Distribution</h3>
          <div className="space-y-3">
            {[
              { label: 'NFT Buyback', value: data.distribution.buyback_nft_pct, color: 'bg-emerald-500' },
              { label: 'Token Buyback', value: data.distribution.buyback_token_pct, color: 'bg-blue-500' },
              { label: 'Liquidity', value: data.distribution.liquidity_pct, color: 'bg-purple-500' },
              { label: 'Development', value: data.distribution.dev_pct, color: 'bg-amber-500' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-3 h-3 ${item.color} rounded-full`} />
                <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 w-12 text-right">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// NFTs View - Redesigned to match FOMO.cx style
const NFTsView = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [favorites, setFavorites] = useState([]);

  // Enhanced NFT data with rarity and additional info
  const enhancedNfts = data.nfts.map((nft, idx) => {
    const rarities = ['Epic', 'Legendary', 'Rare', 'FOMO Gold'];
    const categories = ['AI & Web3', 'NFT & Collectibles', 'DeFi', 'Gaming'];
    const chains = ['Ethereum', 'Solana', 'BSC', 'Polygon'];
    const rounds = ['Strategic', 'Seed', 'Private', 'Public'];
    
    return {
      ...nft,
      rarity: rarities[idx % 4],
      category: categories[idx % 4],
      chain: chains[idx % 4],
      round: rounds[idx % 4],
      views: Math.floor(Math.random() * 2000) + 100,
      project: `Project ${nft.token_id}`,
      priceUsd: (nft.price_eth * 3100).toFixed(0)
    };
  });

  const toggleFavorite = (tokenId) => {
    setFavorites(prev => 
      prev.includes(tokenId) 
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    );
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'Epic': 'bg-red-500',
      'Legendary': 'bg-purple-500',
      'Rare': 'bg-blue-500',
      'FOMO Gold': 'bg-amber-500'
    };
    return colors[rarity] || 'bg-gray-500';
  };

  const filteredNfts = enhancedNfts.filter(nft => {
    if (searchQuery) {
      return nft.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
             nft.token_id.toString().includes(searchQuery);
    }
    if (activeFilter === 'favorites') return favorites.includes(nft.token_id);
    if (activeFilter === 'below-floor') return nft.price_eth < data.market.floor_price_eth;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
      data-testid="nfts-view"
    >
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 stroke-[1.5]" />
            <input
              type="text"
              placeholder="Search by keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          
          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All' },
              { id: 'below-floor', label: 'Below Floor' },
              { id: 'favorites', label: 'Favorites' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
            
            <button className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-200">
              <Filter className="w-4 h-4 text-gray-600 stroke-[1.5]" />
            </button>
          </div>
          
          {/* CTA */}
          <a
            href="https://www.fomo.cx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-600 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 whitespace-nowrap"
          >
            Visit FOMO.cx
            <ExternalLink className="w-4 h-4 stroke-[1.5]" />
          </a>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Floor Price</p>
          <p className="text-lg font-bold text-gray-900">{data.market.floor_price_eth} ETH</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Strategy Owned</p>
          <p className="text-lg font-bold text-gray-900">{data.nft_supply.strategy_owned}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Below Floor</p>
          <p className="text-lg font-bold text-emerald-500">{filteredNfts.filter(n => n.price_eth < data.market.floor_price_eth).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Total Burned</p>
          <p className="text-lg font-bold text-orange-500">{data.nft_supply.burned}</p>
        </div>
      </div>

      {/* NFT Grid - FOMO.cx Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredNfts.map((nft) => (
          <motion.div 
            key={nft.token_id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-square">
              <img 
                src={nft.image} 
                alt={`NFT #${nft.token_id}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              
              {/* Favorite Star - Top Left */}
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(nft.token_id); }}
                className="absolute top-3 left-3 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-all"
              >
                <Star 
                  className={`w-4 h-4 ${favorites.includes(nft.token_id) ? 'fill-amber-400 text-amber-400' : 'text-white'} stroke-[1.5]`}
                />
              </button>
              
              {/* Rarity Badge - Top Right */}
              <div className={`absolute top-3 right-3 px-3 py-1 ${getRarityColor(nft.rarity)} text-white text-xs font-bold rounded-full`}>
                {nft.rarity}
              </div>
            </div>
            
            {/* Card Content */}
            <div className="p-4">
              {/* NFT ID */}
              <p className="text-xs text-gray-400 font-medium mb-1">#{nft.token_id}</p>
              
              {/* Project Name */}
              <h4 className="text-sm font-bold text-gray-900 mb-1">{nft.project}</h4>
              
              {/* Category */}
              <p className="text-xs text-gray-500 mb-3">{nft.category}</p>
              
              {/* Views */}
              <div className="flex items-center gap-1 mb-3">
                <Eye className="w-3.5 h-3.5 text-gray-400 stroke-[1.5]" />
                <span className="text-xs text-gray-400">{nft.views >= 1000 ? `${(nft.views/1000).toFixed(1)}k` : nft.views}</span>
              </div>
              
              {/* Round & Chain */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                <div>
                  <span className="text-gray-400">Round: </span>
                  <span className="font-medium text-gray-700">{nft.round}</span>
                </div>
                <div>
                  <span className="text-gray-400">Chain: </span>
                  <span className="font-medium text-gray-700">{nft.chain}</span>
                </div>
              </div>
              
              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900">${nft.priceUsd}</p>
                  <p className="text-xs text-gray-400">ETH {nft.price_eth}</p>
                </div>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-200 group/btn">
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover/btn:text-white stroke-[1.5]" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredNfts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400">No NFTs found</p>
        </div>
      )}
    </motion.div>
  );
};

// Helper Components
const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-400 mt-1">{label}</p>
  </div>
);

const Step = ({ number, title, description }) => (
  <div className="flex gap-4 items-start">
    <div className="flex-shrink-0 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
      {number}
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default StrategyMiniApp;