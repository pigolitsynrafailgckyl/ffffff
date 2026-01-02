import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const NFTGallery = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/nfts`);
      setNfts(response.data);
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
      // Set mock data if API fails
      setNfts([
        { id: '1', token_id: 5954, name: 'Forma #5954', image_url: 'https://images.unsplash.com/photo-1764437358350-e324534072d7?crop=entropy&cs=srgb&fm=jpg&q=85', purchase_price: 42.5, current_price: 45.2, status: 'owned' },
        { id: '2', token_id: 6595, name: 'Forma #6595', image_url: 'https://images.unsplash.com/photo-1759270463164-dcd9af6fc77c?crop=entropy&cs=srgb&fm=jpg&q=85', purchase_price: 41.8, current_price: 44.9, status: 'owned' },
        { id: '3', token_id: 4919, name: 'Forma #4919', image_url: 'https://images.unsplash.com/photo-1763920999620-f76ea1aeb3ac?crop=entropy&cs=srgb&fm=jpg&q=85', purchase_price: 43.2, current_price: 46.1, status: 'owned' },
        { id: '4', token_id: 3480, name: 'Forma #3480', image_url: 'https://images.unsplash.com/photo-1759270463255-70ef839296bd?crop=entropy&cs=srgb&fm=jpg&q=85', purchase_price: 40.9, current_price: 44.5, status: 'owned' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="nfts" className="max-w-7xl mx-auto px-6 py-16" data-testid="nft-gallery-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl md:text-6xl font-unbounded font-black uppercase mb-4 tracking-tighter">
          Owned <span className="text-green-500">NFTs</span>
        </h2>
        <p className="text-zinc-600 mb-12 text-lg">NFTs acquired through the buyback mechanism</p>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6" data-testid="nft-grid">
            {nfts.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card-brutal card-brutal-hover transition-all cursor-pointer"
                data-testid={`nft-card-${nft.token_id}`}
              >
                <div className="aspect-square bg-zinc-100 overflow-hidden">
                  <img 
                    src={nft.image_url} 
                    alt={nft.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{nft.name}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Purchase:</span>
                    <span className="font-mono font-bold">{nft.purchase_price} ETH</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-zinc-500">Current:</span>
                    <span className="font-mono font-bold text-green-600">{nft.current_price} ETH</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};