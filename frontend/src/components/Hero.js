import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

export const Hero = ({ statistics }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" data-testid="hero-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl md:text-7xl font-unbounded font-black uppercase leading-tight tracking-tighter mb-6">
          The Laboratory
          <br />
          <span className="text-green-500">Of Yield</span>
        </h1>
        <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
          An automated protocol designed to create sustainable value through NFT buybacks and token burns, forever.
        </p>
        <div className="flex gap-4">
          <a href="#calculator" className="btn-primary px-8 py-4 rounded-none" data-testid="calculator-cta">
            Calculate Yield
          </a>
          <a 
            href="https://marketplace.example.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-white text-black border-2 border-black hover:bg-zinc-100 font-bold uppercase tracking-wide px-8 py-4 rounded-none"
            data-testid="marketplace-link"
          >
            View Marketplace →
          </a>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="card-brutal p-6" data-testid="nft-price-card">
          <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">NFT Floor Price</div>
          <div className="font-mono text-3xl font-bold text-green-600">
            <CountUp end={statistics.nft_floor_price} decimals={2} suffix=" ETH" duration={2} />
          </div>
        </div>
        
        <div className="card-brutal p-6" data-testid="token-price-card">
          <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Token Price</div>
          <div className="font-mono text-3xl font-bold text-green-600">
            $<CountUp end={statistics.token_price} decimals={4} duration={2} />
          </div>
        </div>
        
        <div className="card-brutal p-6" data-testid="market-cap-card">
          <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Market Cap</div>
          <div className="font-mono text-2xl font-bold">
            $<CountUp end={statistics.market_cap} separator="," duration={2} />
          </div>
        </div>
        
        <div className="card-brutal p-6" data-testid="volume-card">
          <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">24h Volume</div>
          <div className="font-mono text-2xl font-bold">
            $<CountUp end={statistics.total_volume_24h} separator="," duration={2} />
          </div>
        </div>
      </motion.div>
    </section>
  );
};