import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Home, BarChart3, ShoppingBag, Trophy, Info, Flame, TrendingUp, Wallet, ExternalLink, RefreshCw } from 'lucide-react';
import strategyData from '../data/strategy_state.json';
import { ethers } from 'ethers';

const StrategyMiniApp = () => {
  const [activeView, setActiveView] = useState('home'); // home, stats, nfts, leaderboard
  const [data] = useState(strategyData);
  const [derived, setDerived] = useState({});
  
  // MetaMask wallet state
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletError, setWalletError] = useState(null);

  useEffect(() => {
    calculateMetrics();
    checkWalletConnection();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Check if wallet was previously connected
  const checkWalletConnection = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
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
        setWalletAddress(accounts[0]);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (newAccounts) => {
          if (newAccounts.length === 0) {
            setWalletAddress(null);
          } else {
            setWalletAddress(newAccounts[0]);
          }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
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
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setWalletError(null);
  }, []);

  // Format address for display
  const formatAddress = useCallback((address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  }, []);

  const calculateMetrics = () => {
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
    { id: 'nfts', icon: ShoppingBag, label: 'NFTs' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' }
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
            
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeView === item.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    data-testid={`nav-${item.id}`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
              
              {/* Wallet Connect Button */}
              {walletAddress ? (
                <div className="flex items-center gap-2 ml-2">
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-md">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-800 font-mono">
                      {formatAddress(walletAddress)}
                    </span>
                  </div>
                  <button 
                    onClick={disconnectWallet}
                    className="text-gray-500 hover:text-gray-700 px-2 py-2 rounded-md hover:bg-gray-100 transition-all"
                    title="Отключить кошелёк"
                    data-testid="disconnect-wallet-btn"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-green-500 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-green-600 transition-all shadow-sm hover:shadow-md ml-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="connect-wallet-btn"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
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
        {activeView === 'home' && <HomeView data={data} derived={derived} />}
        {activeView === 'stats' && <StatsView data={data} derived={derived} />}
        {activeView === 'nfts' && <NFTsView data={data} />}
        {activeView === 'leaderboard' && <LeaderboardView />}
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
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">FORMA Strategy</h1>
        <p className="text-gray-600 leading-relaxed">NFT buyback and burn mechanism for sustainable value</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Members" value="11" />
        <StatCard label="Total NFTs" value={data.nft_supply.strategy_owned} />
        <StatCard label="Burned" value={data.nft_supply.burned} />
        <StatCard label="Buybacks" value={data.activity.nft_bought_total} />
      </div>

      {/* Progress to Buyback */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-semibold text-gray-900">Progress to Next Buyback</h3>
          <span className="text-sm text-gray-500 ml-auto font-medium">{derived.buybackProgressPercent}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${derived.buybackProgressPercent || 0}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 font-medium">{data.treasury.eth_balance} / {data.treasury.target_eth_per_buyback} ETH</p>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Info className="w-5 h-5 text-gray-600" />
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
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-md border border-green-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Join the Strategy</h3>
        <p className="text-gray-700 text-sm mb-4 leading-relaxed">Start participating in the perpetual buyback machine</p>
        <a
          href="https://www.fomo.cx"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-green-600 transition-all shadow-sm hover:shadow-md"
        >
          Go to FOMO.cx →
        </a>
      </div>
    </motion.div>
  );
};

// Stats View
const StatsView = ({ data, derived }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      data-testid="stats-view"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-500 mb-2 font-medium">ETH in Treasury</p>
          <p className="text-3xl font-bold text-gray-900">{data.treasury.eth_balance} ETH</p>
        </div>
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-500 mb-2 font-medium">Market Gap</p>
          <p className="text-3xl font-bold text-green-600">+{derived.gapETH?.toFixed(3)} ETH</p>
          <p className="text-xs text-gray-500 mt-1">{derived.gapPercent?.toFixed(1)}% below floor</p>
        </div>
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-500 mb-2 font-medium flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" /> Burned
          </p>
          <p className="text-3xl font-bold text-gray-900">{data.nft_supply.burned}</p>
          <p className="text-xs text-gray-500 mt-1">{derived.burnRatio?.toFixed(1)}% of supply</p>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Price History</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.history}>
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '11px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
            <RechartsTooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', padding: '8px' }}
            />
            <Line type="monotone" dataKey="floor" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="strategy_buy" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Orderbook */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Orderbook</h3>
        <div className="space-y-0 divide-y divide-gray-100">
          {data.orderbook.map((order, idx) => (
            <div key={idx} className="flex justify-between items-center py-3 hover:bg-gray-50 transition-colors">
              <span className="text-sm text-gray-600 font-medium">{order.price} ETH</span>
              <span className="text-sm font-semibold text-gray-900">{order.count} NFTs</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// NFTs View
const NFTsView = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      data-testid="nfts-view"
    >
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-md border border-green-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Buy NFTs on FOMO.cx</h3>
        <p className="text-gray-700 text-sm mb-4 leading-relaxed">Explore our full marketplace with hundreds of NFTs</p>
        <a
          href="https://www.fomo.cx"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-green-600 transition-all shadow-sm hover:shadow-md"
        >
          Visit Marketplace →
        </a>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.nfts.map((nft) => (
          <div key={nft.token_id} className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
            <img src={nft.image} alt={`NFT #${nft.token_id}`} className="w-full aspect-square object-cover" />
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1 font-medium">#{nft.token_id}</p>
              <p className="text-base font-bold text-gray-900 mb-2">{nft.price_eth} ETH</p>
              {nft.price_eth < data.market.floor_price_eth && (
                <span className="inline-block text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-md font-medium">Below Floor</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Leaderboard View
const LeaderboardView = () => {
  const leaderboard = [
    { rank: 1, name: 'Demo User', xp: 2650, badges: 3 },
    { rank: 2, name: 'Demo User', xp: 510, badges: 2 },
    { rank: 3, name: 'User 0x3c23', xp: 0, badges: 1 },
    { rank: 4, name: 'User 0x974d', xp: 0, badges: 1 },
    { rank: 5, name: 'User 0x578b', xp: 0, badges: 1 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      data-testid="leaderboard-view"
    >
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Top Members</h3>
        <div className="space-y-2">
          {leaderboard.map((user) => (
            <div key={user.rank} className="flex items-center gap-4 p-3 rounded-md hover:bg-gray-50 transition-colors">
              <span className="text-sm font-semibold text-gray-500 w-7">{user.rank}</span>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-600">{user.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.xp} XP</p>
              </div>
              <span className="text-sm font-semibold text-gray-600">{user.badges} 🏆</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Helper Components
const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-md shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

const Step = ({ number, title, description }) => (
  <div className="flex gap-4 items-start">
    <div className="flex-shrink-0 w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
      {number}
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default StrategyMiniApp;