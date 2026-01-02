import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import '@/App.css';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Calculator } from './components/Calculator';
import { NFTGallery } from './components/NFTGallery';
import { HowItWorks } from './components/HowItWorks';
import { TransactionHistory } from './components/TransactionHistory';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Home = ({ statistics, walletAddress, onConnectWallet }) => {
  return (
    <div>
      <Hero statistics={statistics} />
      <Calculator />
      <HowItWorks />
      <NFTGallery />
      <TransactionHistory />
    </div>
  );
};

function App() {
  const [statistics, setStatistics] = useState({
    nft_floor_price: 42.5,
    token_price: 0.0245,
    market_cap: 24500000,
    total_volume_24h: 1850000,
    total_nfts_owned: 24,
    total_buybacks: 36,
    total_burned: 18,
    treasury_balance: 125000
  });
  
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    fetchStatistics();
    checkWalletConnection();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/statistics`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Layout onConnectWallet={connectWallet} walletAddress={walletAddress}>
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  statistics={statistics} 
                  walletAddress={walletAddress} 
                  onConnectWallet={connectWallet}
                />
              } 
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;