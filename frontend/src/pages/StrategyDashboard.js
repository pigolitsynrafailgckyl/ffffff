import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Flame, TrendingUp, TrendingDown, Info } from 'lucide-react';
import strategyData from '../data/strategy_state.json';

const StrategyDashboard = () => {
  const [data, setData] = useState(null);
  const [derived, setDerived] = useState({});

  useEffect(() => {
    setData(strategyData);
    calculateDerivedMetrics(strategyData);
  }, []);

  // Calculate all derived metrics on the frontend
  const calculateDerivedMetrics = (data) => {
    if (!data) return;

    // 1. Buyback Progress (0-1, clamped)
    const buybackProgress = Math.min(1, Math.max(0, data.treasury.eth_balance / data.treasury.target_eth_per_buyback));
    const buybackProgressPercent = (buybackProgress * 100).toFixed(1);
    const buybackStatus = buybackProgress >= 1 ? 'Buyback Ready' : 'Accumulating';

    // 2. Market Gap
    const gapETH = data.market.floor_price_eth - data.market.strategy_avg_buy_price;
    const gapPercent = (gapETH / data.market.floor_price_eth) * 100;

    // 3. Effective Supply
    const effectiveSupply = data.nft_supply.total_minted - data.nft_supply.burned;

    // 4. Burn Ratio
    const burnRatio = (data.nft_supply.burned / data.nft_supply.total_minted) * 100;

    // 5. Strategy Control %
    const strategyControl = (data.nft_supply.strategy_owned / effectiveSupply) * 100;

    // 6. NFT to Floor
    const nftToFloor = data.orderbook.reduce((sum, order) => sum + order.count, 0);
    const ethToFloor = data.orderbook.reduce((sum, order) => sum + (order.price * order.count), 0);

    // 7. Liquidity % of total supply
    const totalTokenSupply = data.liquidity.token_in_lp * 100 / 8.01; // Reverse calculate from 8.01%
    const burnedTokens = totalTokenSupply * (3.55 / 100);
    const liquidityPercent = 8.01;
    const burnedPercent = 3.55;

    setDerived({
      buybackProgress,
      buybackProgressPercent,
      buybackStatus,
      gapETH,
      gapPercent,
      effectiveSupply,
      burnRatio,
      strategyControl,
      nftToFloor,
      ethToFloor,
      liquidityPercent,
      burnedPercent
    });
  };

  if (!data) return <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6" data-testid="strategy-dashboard">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-unbounded font-black uppercase mb-2" data-testid="dashboard-title">Strategy Dashboard</h1>
        <p className="text-zinc-400 font-mono text-sm">Real-time NFT buyback and burn mechanism</p>
      </div>

      {/* A. Header - Strategy State Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard 
          label="ETH in Treasury" 
          value={`${data.treasury.eth_balance} ETH`}
          subtitle={`Target: ${data.treasury.target_eth_per_buyback} ETH`}
          tooltip="Current ETH balance available for next NFT buyback"
        />
        <StatCard 
          label="NFTs Owned" 
          value={data.nft_supply.strategy_owned}
          subtitle={`${derived.strategyControl?.toFixed(1)}% of supply`}
          tooltip="Number of NFTs currently held by the strategy"
        />
        <StatCard 
          label="NFTs Burned" 
          value={data.nft_supply.burned}
          subtitle={`${derived.burnRatio?.toFixed(1)}% of total`}
          tooltip="Total NFTs permanently removed from circulation"
          icon={<Flame className="w-5 h-5 text-orange-500" />}
        />
        <StatCard 
          label="NFTs Sold" 
          value={data.activity.nft_sold_total}
          subtitle={`${data.activity.eth_received_from_sales} ETH received`}
          tooltip="Total NFTs sold by the strategy"
        />
        <StatCard 
          label="ETH from Sales" 
          value={`${data.activity.eth_received_from_sales} ETH`}
          subtitle={`${data.activity.nft_sold_total} sales`}
          tooltip="Total ETH received from NFT sales"
        />
      </div>

      {/* B. Buyback Progress Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div 
          className="bg-zinc-800 rounded-lg p-6 border border-zinc-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          data-testid="buyback-progress-section"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold">Progress to Next NFT Buyback</h3>
              <p className="text-sm text-zinc-400">Status: <span className={derived.buybackStatus === 'Buyback Ready' ? 'text-green-400' : 'text-yellow-400'}>{derived.buybackStatus}</span></p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold">{derived.buybackProgressPercent}%</p>
              <p className="text-sm text-zinc-400">{data.treasury.eth_balance} / {data.treasury.target_eth_per_buyback} ETH</p>
            </div>
          </div>
          <div className="relative h-4 bg-zinc-700 rounded-full overflow-hidden">
            <motion.div 
              className="absolute h-full bg-gradient-to-r from-green-600 to-green-400"
              initial={{ width: 0 }}
              animate={{ width: `${derived.buybackProgressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              data-testid="progress-bar"
            />
            {derived.buybackProgress >= 1 && (
              <motion.div
                className="absolute inset-0 bg-green-400"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* C. Market Gap Block + D. Burn vs Liquidity */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Market Gap */}
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700" data-testid="market-gap-section">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            Market Gap Analysis
            <Tooltip text="Difference between market floor and strategy average buy price" />
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Market Floor:</span>
              <span className="font-mono font-bold text-xl">{data.market.floor_price_eth} ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Strategy Avg Buy:</span>
              <span className="font-mono font-bold text-xl">{data.market.strategy_avg_buy_price} ETH</span>
            </div>
            <div className="border-t border-zinc-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Gap:</span>
                <div className="text-right">
                  <p className={`font-mono font-bold text-xl ${derived.gapETH > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {derived.gapETH > 0 ? '+' : ''}{derived.gapETH?.toFixed(3)} ETH
                  </p>
                  <p className={`text-sm ${derived.gapETH > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {derived.gapETH > 0 ? <TrendingUp className="inline w-4 h-4" /> : <TrendingDown className="inline w-4 h-4" />}
                    {' '}{derived.gapPercent?.toFixed(1)}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                {derived.gapETH > 0 ? '✓ Strategy buying below market (profitable)' : '⚠ Strategy buying above market'}
              </p>
            </div>
          </div>
        </div>

        {/* Burn vs Liquidity Donut Chart */}
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700" data-testid="burn-liquidity-chart">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            Token Distribution
            <Tooltip text="Breakdown of burned tokens vs liquidity pool allocation" />
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Burned', value: derived.burnedPercent, color: '#f97316' },
                    { name: 'Liquidity', value: derived.liquidityPercent, color: '#10b981' },
                    { name: 'Circulating', value: 100 - derived.burnedPercent - derived.liquidityPercent, color: '#3b82f6' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Burned', value: derived.burnedPercent, color: '#f97316' },
                    { name: 'Liquidity', value: derived.liquidityPercent, color: '#10b981' },
                    { name: 'Circulating', value: 100 - derived.burnedPercent - derived.liquidityPercent, color: '#3b82f6' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
              <p className="text-xs text-zinc-400">Burned</p>
              <p className="font-mono font-bold">{derived.burnedPercent}%</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
              <p className="text-xs text-zinc-400">Liquidity</p>
              <p className="font-mono font-bold">{derived.liquidityPercent}%</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
              <p className="text-xs text-zinc-400">Other</p>
              <p className="font-mono font-bold">{(100 - derived.burnedPercent - derived.liquidityPercent).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* E. Market Depth + F. Price Chart */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Market Depth */}
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700" data-testid="market-depth-section">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            Market Depth
            <Tooltip text="NFTs available below current floor price" />
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-zinc-400 text-sm">NFTs to Floor</p>
              <p className="font-mono font-bold text-3xl">{derived.nftToFloor}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">ETH Needed</p>
              <p className="font-mono font-bold text-2xl">{derived.ethToFloor?.toFixed(2)} ETH</p>
            </div>
            <div className="border-t border-zinc-700 pt-3">
              <p className="text-xs text-zinc-500">Orderbook breakdown:</p>
              {data.orderbook.map((order, idx) => (
                <div key={idx} className="flex justify-between text-sm mt-1">
                  <span className="text-zinc-400">{order.price} ETH:</span>
                  <span className="font-mono">{order.count} NFTs</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="lg:col-span-2 bg-zinc-800 rounded-lg p-6 border border-zinc-700" data-testid="price-chart-section">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            Price History
            <Tooltip text="Floor price and strategy buy price over time" />
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.history}>
              <XAxis dataKey="date" stroke="#71717a" style={{ fontSize: '12px' }} />
              <YAxis stroke="#71717a" style={{ fontSize: '12px' }} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px' }}
                labelStyle={{ color: '#a1a1aa' }}
              />
              <Line type="monotone" dataKey="floor" stroke="#3b82f6" strokeWidth={2} name="Market Floor" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="strategy_buy" stroke="#10b981" strokeWidth={2} name="Strategy Buy" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-zinc-400">Market Floor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-zinc-400">Strategy Buy</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-zinc-400">Burn Event</span>
            </div>
          </div>
        </div>
      </div>

      {/* G. NFT Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h3 className="text-2xl font-unbounded font-bold uppercase">Available NFTs</h3>
          <p className="text-zinc-400 text-sm">NFTs available for purchase below market floor</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="nft-grid">
          {data.nfts.map((nft) => (
            <NFTCard key={nft.token_id} nft={nft} floorPrice={data.market.floor_price_eth} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, subtitle, tooltip, icon }) => (
  <motion.div 
    className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 transition-colors"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
  >
    <div className="flex items-start justify-between mb-2">
      <p className="text-xs text-zinc-400 uppercase tracking-wide">{label}</p>
      {icon || <Tooltip text={tooltip} />}
    </div>
    <p className="text-2xl font-mono font-bold mb-1">{value}</p>
    {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
  </motion.div>
);

// Tooltip Component
const Tooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <Info 
        className="w-4 h-4 text-zinc-500 hover:text-zinc-300 cursor-help"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <div className="absolute z-10 w-64 p-2 text-xs bg-zinc-950 border border-zinc-700 rounded-lg shadow-lg -left-32 top-6">
          {text}
        </div>
      )}
    </div>
  );
};

// NFT Card Component
const NFTCard = ({ nft, floorPrice }) => {
  const isBelowFloor = nft.price_eth < floorPrice;
  const discount = isBelowFloor ? ((floorPrice - nft.price_eth) / floorPrice) * 100 : 0;
  
  const getBadge = () => {
    if (nft.owner === 'strategy') return { text: 'Strategy', color: 'bg-green-600' };
    if (nft.burn_candidate) return { text: 'Burn', color: 'bg-orange-600' };
    return { text: 'Market', color: 'bg-blue-600' };
  };
  
  const badge = getBadge();
  
  return (
    <motion.div 
      className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 hover:border-zinc-500 transition-all"
      whileHover={{ y: -4, scale: 1.02 }}
      data-testid={`nft-card-${nft.token_id}`}
    >
      <div className="aspect-square bg-zinc-700 overflow-hidden relative">
        <img src={nft.image} alt={`NFT #${nft.token_id}`} className="w-full h-full object-cover" />
        <div className={`absolute top-2 right-2 ${badge.color} text-white text-xs px-2 py-1 rounded-full font-bold`}>
          {badge.text}
        </div>
        {nft.burn_candidate && (
          <div className="absolute top-2 left-2">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-mono text-zinc-400 mb-1">#{nft.token_id}</p>
        <p className="font-mono font-bold text-lg mb-2">{nft.price_eth} ETH</p>
        {isBelowFloor && (
          <div className="mb-2">
            <p className="text-xs text-green-400">Below floor by {discount.toFixed(1)}%</p>
          </div>
        )}
        <button 
          className={`w-full py-2 rounded font-bold text-sm transition-colors ${
            isBelowFloor 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
          }`}
          disabled={!isBelowFloor}
          data-testid={`buy-button-${nft.token_id}`}
        >
          {isBelowFloor ? 'Buy Now' : 'Above Floor'}
        </button>
      </div>
    </motion.div>
  );
};

export default StrategyDashboard;