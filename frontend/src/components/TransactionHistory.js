import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/transactions?limit=10`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Mock data
      setTransactions([
        { id: '1', type: 'buy', amount: 1, price: 42.5, description: 'NFT #5954 acquired', timestamp: new Date().toISOString() },
        { id: '2', type: 'burn', amount: 5000, price: 0.024, description: 'Token burn from sale', timestamp: new Date().toISOString() },
        { id: '3', type: 'buy', amount: 1, price: 41.8, description: 'NFT #6595 acquired', timestamp: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'buy': return 'bg-green-100 text-green-800';
      case 'sell': return 'bg-blue-100 text-blue-800';
      case 'burn': return 'bg-red-100 text-red-800';
      default: return 'bg-zinc-100 text-zinc-800';
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16" data-testid="transaction-history-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl md:text-6xl font-unbounded font-black uppercase mb-4 tracking-tighter">
          Recent <span className="text-green-500">Activity</span>
        </h2>
        <p className="text-zinc-600 mb-12 text-lg">Latest buybacks, sales, and burns</p>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-green-500"></div>
          </div>
        ) : (
          <div className="card-brutal p-6">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="transactions-table">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left py-4 px-2 font-bold uppercase text-sm">Type</th>
                    <th className="text-left py-4 px-2 font-bold uppercase text-sm">Description</th>
                    <th className="text-right py-4 px-2 font-bold uppercase text-sm">Amount</th>
                    <th className="text-right py-4 px-2 font-bold uppercase text-sm">Price</th>
                    <th className="text-right py-4 px-2 font-bold uppercase text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-zinc-200 hover:bg-zinc-50 transition-colors"
                      data-testid={`transaction-row-${index}`}
                    >
                      <td className="py-4 px-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${getTypeColor(tx.type)}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-sm">{tx.description}</td>
                      <td className="py-4 px-2 text-right font-mono font-bold">{tx.amount}</td>
                      <td className="py-4 px-2 text-right font-mono">
                        {tx.type === 'burn' ? `$${tx.price}` : `${tx.price} ETH`}
                      </td>
                      <td className="py-4 px-2 text-right text-sm text-zinc-500">
                        {format(new Date(tx.timestamp), 'MMM dd, HH:mm')}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
};