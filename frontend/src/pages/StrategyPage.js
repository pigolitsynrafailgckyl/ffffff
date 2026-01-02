import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Info, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import strategyData from '../data/strategy_state.json';

const StrategyPage = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'stats'
  const [data] = useState(strategyData);

  return (
    <div className="min-h-screen bg-zinc-950 text-white" data-testid="strategy-page">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight" data-testid="logo">
                FORMA <span className="text-green-500">STRATEGY</span>
              </h1>
              <p className="text-xs text-zinc-500 mt-1">Perpetual NFT Machine</p>
            </div>
            <a href="/" className="text-sm hover:text-green-500 transition-colors border border-zinc-700 px-4 py-2 rounded-lg hover:border-green-500 hover:bg-green-500/10">
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-zinc-800/50 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${
                activeTab === 'overview' 
                  ? 'bg-zinc-900 text-green-500 border-t-2 border-green-500' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
              }`}
              data-testid="overview-tab"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${
                activeTab === 'stats' 
                  ? 'bg-zinc-900 text-green-500 border-t-2 border-green-500' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
              }`}
              data-testid="stats-tab"
            >
              Statistics
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <OverviewTab key="overview" />
        ) : (
          <StatsTab key="stats" data={data} />
        )}
      </AnimatePresence>
    </div>
  );
};

// Overview Tab - Landing/Explanation
const OverviewTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-12"
      data-testid="overview-content"
    >
      <div className="max-w-3xl">
        <h2 className="text-4xl font-bold mb-6">The Perpetual Machine</h2>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
          An automated protocol designed to create sustainable value through NFT buybacks and token burns. 
          The Yoyo™ mechanism ensures continuous support for both NFT floor prices and token value.
        </p>

        {/* How it works */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 border border-zinc-700/50 hover:border-zinc-600 transition-colors">
            <div className="flex items-start gap-6">
              <div className="bg-green-500 text-black font-bold px-4 py-2 rounded-lg text-lg">01</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">Trade & Collect Fees</h3>
                <p className="text-zinc-400 leading-relaxed">Every NFT trade generates fees that flow into the protocol treasury. This creates a continuous revenue stream independent of market conditions.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 border border-zinc-700/50 hover:border-zinc-600 transition-colors">
            <div className="flex items-start gap-6">
              <div className="bg-green-500 text-black font-bold px-4 py-2 rounded-lg text-lg">02</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">Automated Buyback</h3>
                <p className="text-zinc-400 leading-relaxed">When treasury reaches threshold (3 ETH), the machine automatically buys floor NFTs. This provides natural price support and accumulates strategic assets.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 border border-zinc-700/50 hover:border-zinc-600 transition-colors">
            <div className="flex items-start gap-6">
              <div className="bg-green-500 text-black font-bold px-4 py-2 rounded-lg text-lg">03</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">List & Burn</h3>
                <p className="text-zinc-400 leading-relaxed">Acquired NFTs are listed at 1.2x price. When sold, proceeds buy and burn $FORMA tokens, reducing supply and creating upward pressure on price.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 border border-zinc-700/50 hover:border-zinc-600 transition-colors">
            <div className="flex items-start gap-6">
              <div className="bg-green-500 text-black font-bold px-4 py-2 rounded-lg text-lg">04</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">Supply Reduction</h3>
                <p className="text-zinc-400 leading-relaxed">Continuous token burning reduces circulating supply. Combined with NFT buybacks, this creates a virtuous cycle of value accrual for both assets.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mt-12 bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-2xl p-8 border border-green-500/30">
          <h3 className="text-2xl font-bold mb-6 text-green-400">Why This Works</h3>
          <ul className="space-y-4 text-zinc-300">
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1 text-xl">✓</span>
              <span>Trading volume directly benefits NFT and token holders through buybacks and burns</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1 text-xl">✓</span>
              <span>Floor price support prevents downside crashes during market uncertainty</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1 text-xl">✓</span>
              <span>Token supply reduction creates scarcity and potential for appreciation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1 text-xl">✓</span>
              <span>Fully automated - no human intervention required</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

// Stats Tab - Dashboard with Statistics
const StatsTab = ({ data }) => {
  const [derived, setDerived] = React.useState({});

  React.useEffect(() => {
    calculateMetrics();
  }, []);

  const calculateMetrics = () => {
    // Buyback Progress
    const buybackProgress = Math.min(1, Math.max(0, data.treasury.eth_balance / data.treasury.target_eth_per_buyback));
    const buybackProgressPercent = (buybackProgress * 100).toFixed(1);
    
    // Market Gap
    const gapETH = data.market.floor_price_eth - data.market.strategy_avg_buy_price;
    const gapPercent = (gapETH / data.market.floor_price_eth) * 100;
    
    // Supply metrics
    const effectiveSupply = data.nft_supply.total_minted - data.nft_supply.burned;
    const burnRatio = (data.nft_supply.burned / data.nft_supply.total_minted) * 100;
    const strategyControl = (data.nft_supply.strategy_owned / effectiveSupply) * 100;
    
    // Market depth
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-8"
      data-testid="stats-content"
    >
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="ETH on Strategy" value={`${data.treasury.eth_balance}`} unit="ETH" />
        <StatCard label="NFTs Owned" value={data.nft_supply.strategy_owned} subtitle={`${derived.strategyControl?.toFixed(1)}% control`} />
        <StatCard label="Total NFT Purchases" value={data.activity.nft_bought_total} />
        <StatCard label="Total ETH Spent" value={data.activity.eth_spent_on_buybacks} unit="ETH" />
        <StatCard label="% Token in LP" value="8.01" unit="%" subtitle="Pancake V2" />
      </div>

      {/* Buyback Progress */}
      <div className="border border-zinc-800 p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-medium text-zinc-400">Progress to Next NFT Buyback</h3>
            <p className="text-xs text-zinc-600 mt-1">
              Status: {derived.buybackProgress >= 1 ? (
                <span className="text-green-500">Buyback Ready</span>
              ) : (
                <span className="text-yellow-500">Accumulating</span>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-mono font-bold">{derived.buybackProgressPercent}%</p>
            <p className="text-xs text-zinc-500">{data.treasury.eth_balance} / {data.treasury.target_eth_per_buyback} ETH</p>
          </div>
        </div>
        <div className="relative h-2 bg-zinc-900 border border-zinc-800">
          <motion.div
            className="absolute h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${derived.buybackProgressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Market Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Market Gap */}
        <div className="border border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">Market Gap Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-zinc-500">Market Floor</span>
              <span className="font-mono font-bold">{data.market.floor_price_eth} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-zinc-500">Strategy Avg Buy</span>
              <span className="font-mono font-bold">{data.market.strategy_avg_buy_price} ETH</span>
            </div>
            <div className="border-t border-zinc-800 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">Gap</span>
                <div className="text-right">
                  <p className={`font-mono font-bold ${derived.gapETH > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {derived.gapETH > 0 ? '+' : ''}{derived.gapETH?.toFixed(3)} ETH
                  </p>
                  <p className="text-xs text-zinc-600">{derived.gapPercent?.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Supply */}
        <div className="border border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
            NFT Supply Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-zinc-500">Total Minted</span>
              <span className="font-mono font-bold">{data.nft_supply.total_minted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" /> Burned
              </span>
              <span className="font-mono font-bold">{data.nft_supply.burned} ({derived.burnRatio?.toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-zinc-500">Strategy Owned</span>
              <span className="font-mono font-bold">{data.nft_supply.strategy_owned}</span>
            </div>
            <div className="border-t border-zinc-800 pt-3">
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500">Effective Supply</span>
                <span className="font-mono font-bold">{derived.effectiveSupply}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Depth */}
        <div className="border border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">Market Depth</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-zinc-500">NFTs to Floor</p>
              <p className="font-mono font-bold text-2xl">{derived.nftToFloor}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">ETH Needed</p>
              <p className="font-mono font-bold text-xl">{derived.ethToFloor?.toFixed(2)} ETH</p>
            </div>
            <div className="border-t border-zinc-800 pt-2 space-y-1">
              {data.orderbook.map((order, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-zinc-600">{order.price} ETH</span>
                  <span className="font-mono text-zinc-400">{order.count} NFTs</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="border border-zinc-800 p-6 mb-8">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">Price History</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.history}>
            <XAxis dataKey="date" stroke="#52525b" style={{ fontSize: '11px' }} />
            <YAxis stroke="#52525b" style={{ fontSize: '11px' }} />
            <RechartsTooltip
              contentStyle={{ backgroundColor: '#000', border: '1px solid #27272a' }}
              labelStyle={{ color: '#71717a' }}
            />
            <Line type="monotone" dataKey="floor" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Market Floor" />
            <Line type="monotone" dataKey="strategy_buy" stroke="#10b981" strokeWidth={1.5} dot={false} name="Strategy Buy" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span className="text-zinc-500">Market Floor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-green-500"></div>
            <span className="text-zinc-500">Strategy Buy</span>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Cheapest NFT not listed by Strategy</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {data.nfts.slice(0, 6).map((nft) => (
            <NFTCard key={nft.token_id} nft={nft} floorPrice={data.market.floor_price_eth} />
          ))}
        </div>
      </div>

      {/* CoinGecko Terminal Placeholder */}
      <div className="border border-zinc-800 p-6">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">Token Price Chart (CoinGecko)</h3>
        <div className="flex items-center justify-center h-64 bg-zinc-900 border border-zinc-800">
          <p className="text-zinc-600 text-sm">Connect CoinGecko API to display live token prices</p>
        </div>
      </div>
    </motion.div>
  );
};

// Stat Card (Rounded Design)
const StatCard = ({ label, value, unit, subtitle }) => (
  <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-5 border border-zinc-800/50 hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-green-500/5">
    <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">{label}</p>
    <p className="text-2xl font-mono font-bold">
      {value}{unit && <span className="text-sm text-zinc-500 ml-1">{unit}</span>}
    </p>
    {subtitle && <p className="text-xs text-zinc-600 mt-1">{subtitle}</p>}
  </div>
);

// NFT Card (Rounded Design)
const NFTCard = ({ nft, floorPrice }) => {
  const isBelowFloor = nft.price_eth < floorPrice;
  const discount = isBelowFloor ? ((floorPrice - nft.price_eth) / floorPrice) * 100 : 0;

  return (
    <div className="bg-zinc-900/70 backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-800/50 hover:border-zinc-700 transition-all group hover:shadow-lg hover:shadow-green-500/10">
      <div className="aspect-square bg-zinc-800 overflow-hidden relative">
        <img src={nft.image} alt={`NFT #${nft.token_id}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        {nft.burn_candidate && (
          <div className="absolute top-3 left-3 bg-orange-500/90 backdrop-blur-sm rounded-lg p-1.5">
            <Flame className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <div className="p-4 border-t border-zinc-800/50">
        <p className="text-xs font-mono text-zinc-500 mb-1">#{nft.token_id}</p>
        <p className="font-mono font-bold text-lg">{nft.price_eth} ETH</p>
        {isBelowFloor && (
          <p className="text-xs text-green-400 mt-1 bg-green-500/10 px-2 py-1 rounded-md inline-block">-{discount.toFixed(1)}% floor</p>
        )}
        <button
          className={`w-full mt-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
            isBelowFloor
              ? 'bg-green-500 text-black hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/50'
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
          disabled={!isBelowFloor}
        >
          {isBelowFloor ? 'BUY NOW' : 'ABOVE FLOOR'}
        </button>
      </div>
    </div>
  );
};

export default StrategyPage;