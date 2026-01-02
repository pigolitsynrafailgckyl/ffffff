import React from 'react';
import { motion } from 'framer-motion';

const Marquee = () => {
  const content = 'LIVE TRANSACTIONS • BUYBACK EXECUTED • YIELD UPDATED • NFT ACQUIRED • SUPPLY BURNED • ';
  
  return (
    <div className="bg-black text-white py-3 font-mono text-sm uppercase tracking-widest border-y-2 border-black overflow-hidden">
      <div className="flex">
        <div className="marquee-content">
          {content.repeat(3)}
        </div>
        <div className="marquee-content">
          {content.repeat(3)}
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ onConnectWallet, walletAddress }) => {
  return (
    <nav className="border-b-2 border-black bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-unbounded font-black uppercase tracking-tight" data-testid="logo">
            Forma <span className="text-green-500">Strategy</span>
          </h1>
        </div>
        <div className="flex gap-6 items-center">
          <a href="/#calculator" className="font-bold uppercase text-sm hover:text-green-500 transition-colors">Calculator</a>
          <a href="/#how-it-works" className="font-bold uppercase text-sm hover:text-green-500 transition-colors">How It Works</a>
          <a href="/#nfts" className="font-bold uppercase text-sm hover:text-green-500 transition-colors">NFTs</a>
          <a href="/dashboard" className="font-bold uppercase text-sm hover:text-green-500 transition-colors">Dashboard</a>
          <button 
            onClick={onConnectWallet}
            data-testid="connect-wallet-button"
            className="btn-primary px-6 py-3 rounded-none"
          >
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export const Layout = ({ children, onConnectWallet, walletAddress }) => {
  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Navbar onConnectWallet={onConnectWallet} walletAddress={walletAddress} />
      <main>{children}</main>
      <footer className="border-t-2 border-black bg-zinc-50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-mono text-sm text-zinc-500">© 2025 Forma Strategy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};