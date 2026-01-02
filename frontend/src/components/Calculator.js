import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import CountUp from 'react-countup';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Calculator = () => {
  const [inputs, setInputs] = useState({
    nft_price: 42.5,
    time_horizon: 30,
    daily_volume: 50000,
    fee_percentage: 1.0,
    buyback_nft_percentage: 40.0,
    buyback_token_percentage: 30.0,
    lp_percentage: 20.0,
    dev_percentage: 10.0,
    current_supply: 10000,
    burn_percentage: 70.0,
    impact_strength: 0.5
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/calculator`, inputs);
      setResult(response.data);
    } catch (error) {
      console.error('Calculator error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  return (
    <section id="calculator" className="max-w-7xl mx-auto px-6 py-16" data-testid="calculator-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl md:text-6xl font-unbounded font-black uppercase mb-4 tracking-tighter">
          Yield <span className="text-green-500">Calculator</span>
        </h2>
        <p className="text-zinc-600 mb-12 text-lg">Simulate your potential returns based on market conditions</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 card-brutal p-8">
            <h3 className="text-xl font-unbounded font-bold uppercase mb-6">Input Parameters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">NFT Price (ETH)</label>
                <input
                  type="number"
                  value={inputs.nft_price}
                  onChange={(e) => handleInputChange('nft_price', e.target.value)}
                  className="input-brutal w-full px-4 py-3 rounded-none"
                  data-testid="nft-price-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">Time Horizon (days)</label>
                <select
                  value={inputs.time_horizon}
                  onChange={(e) => handleInputChange('time_horizon', e.target.value)}
                  className="input-brutal w-full px-4 py-3 rounded-none"
                  data-testid="time-horizon-select"
                >
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">Daily Volume (USD)</label>
                <select
                  value={inputs.daily_volume}
                  onChange={(e) => handleInputChange('daily_volume', e.target.value)}
                  className="input-brutal w-full px-4 py-3 rounded-none"
                  data-testid="daily-volume-select"
                >
                  <option value="10000">Low ($10,000)</option>
                  <option value="50000">Base ($50,000)</option>
                  <option value="100000">High ($100,000)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">Fee (%)</label>
                <input
                  type="number"
                  value={inputs.fee_percentage}
                  onChange={(e) => handleInputChange('fee_percentage', e.target.value)}
                  className="input-brutal w-full px-4 py-3 rounded-none"
                  step="0.1"
                  data-testid="fee-input"
                />
              </div>
              
              <div className="md:col-span-2">
                <h4 className="text-sm font-bold uppercase tracking-wide mb-4 text-green-600">Treasury Distribution</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase mb-2">NFT Buyback (%)</label>
                    <input
                      type="number"
                      value={inputs.buyback_nft_percentage}
                      onChange={(e) => handleInputChange('buyback_nft_percentage', e.target.value)}
                      className="input-brutal w-full px-3 py-2 text-base rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase mb-2">Token Buyback (%)</label>
                    <input
                      type="number"
                      value={inputs.buyback_token_percentage}
                      onChange={(e) => handleInputChange('buyback_token_percentage', e.target.value)}
                      className="input-brutal w-full px-3 py-2 text-base rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase mb-2">LP (%)</label>
                    <input
                      type="number"
                      value={inputs.lp_percentage}
                      onChange={(e) => handleInputChange('lp_percentage', e.target.value)}
                      className="input-brutal w-full px-3 py-2 text-base rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase mb-2">Dev/Growth (%)</label>
                    <input
                      type="number"
                      value={inputs.dev_percentage}
                      onChange=(e) => handleInputChange('dev_percentage', e.target.value)}
                      className="input-brutal w-full px-3 py-2 text-base rounded-none"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">Burn Rate (%)</label>
                <input
                  type="number"
                  value={inputs.burn_percentage}
                  onChange={(e) => handleInputChange('burn_percentage', e.target.value)}
                  className="input-brutal w-full px-4 py-3 rounded-none"
                  data-testid="burn-rate-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">Price Impact (0-1)</label>
                <input
                  type="number"
                  value={inputs.impact_strength}
                  onChange={(e) => handleInputChange('impact_strength', e.target.value)}
                  className="input-brutal w-full px-4 py-3 rounded-none"
                  step="0.1"
                  min="0"
                  max="1"
                  data-testid="impact-strength-input"
                />
              </div>
            </div>
            
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="btn-primary w-full mt-8 px-8 py-4 rounded-none"
              data-testid="calculate-button"
            >
              {loading ? 'Calculating...' : 'Run Simulation'}
            </button>
          </div>
          
          {/* Results */}
          <div className="space-y-6">
            {result ? (
              <>
                <div className="card-brutal p-6" data-testid="treasury-result">
                  <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Treasury Inflow</div>
                  <div className="font-mono text-4xl font-bold text-green-600">
                    $<CountUp end={result.treasury_inflow} separator="," duration={1} />
                  </div>
                </div>
                
                <div className="card-brutal p-6" data-testid="buyback-result">
                  <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">NFT Buyback Budget</div>
                  <div className="font-mono text-3xl font-bold">
                    $<CountUp end={result.buyback_nft_budget} separator="," duration={1} />
                  </div>
                </div>
                
                <div className="card-brutal p-6" data-testid="nfts-buyable-result">
                  <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">NFTs Buyable</div>
                  <div className="font-mono text-3xl font-bold text-green-600">
                    <CountUp end={result.nfts_buyable} decimals={2} duration={1} />
                  </div>
                </div>
                
                <div className="card-brutal p-6" data-testid="supply-reduction-result">
                  <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Supply Reduction</div>
                  <div className="font-mono text-3xl font-bold">
                    <CountUp end={result.supply_reduction_percent} decimals={2} suffix="%" duration={1} />
                  </div>
                </div>
                
                <div className="card-brutal p-6 bg-green-50" data-testid="price-scenarios">
                  <div className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Price Scenarios</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Conservative:</span>
                      <span className="font-mono font-bold">${result.price_scenarios.conservative}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Base:</span>
                      <span className="font-mono font-bold text-green-600">${result.price_scenarios.base}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Aggressive:</span>
                      <span className="font-mono font-bold">${result.price_scenarios.aggressive}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="card-brutal p-6 text-center text-zinc-400">
                <p className="font-mono text-sm">Run simulation to see results</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};