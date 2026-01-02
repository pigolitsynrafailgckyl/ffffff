import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Repeat, Flame, BarChart3 } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Trade & Collect Fees",
      description: "10% of each trade is collected as fees and stored in the protocol treasury (minus 2% rake)"
    },
    {
      icon: <Repeat className="w-12 h-12" />,
      title: "Buyback Mechanism",
      description: "When treasury reaches threshold, the machine automatically buys floor NFTs"
    },
    {
      icon: <Flame className="w-12 h-12" />,
      title: "List & Burn",
      description: "NFTs are listed at 1.2x price. When sold, all ETH buys and burns $FORMA tokens"
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Supply Reduction",
      description: "Token burning reduces supply, creating upward pressure on price while supporting NFT value"
    }
  ];

  return (
    <section id="how-it-works" className="bg-zinc-50 border-y-2 border-black py-16" data-testid="how-it-works-section">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-6xl font-unbounded font-black uppercase mb-4 tracking-tighter text-center">
            How It <span className="text-green-500">Works</span>
          </h2>
          <p className="text-zinc-600 mb-12 text-lg text-center max-w-2xl mx-auto">
            The Yoyo™ - A simple mechanism for buying and selling NFTs while burning token supply, forever.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-brutal bg-white p-6"
                data-testid={`how-it-works-step-${index + 1}`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 text-green-500">{step.icon}</div>
                  <div className="inline-block px-3 py-1 bg-black text-white font-mono text-xs mb-4">
                    STEP {index + 1}
                  </div>
                  <h3 className="font-unbounded font-bold text-xl mb-3 uppercase">{step.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 card-brutal bg-green-50 p-8 text-center">
            <h3 className="font-unbounded font-bold text-2xl uppercase mb-4">Why This Matters</h3>
            <p className="text-zinc-700 max-w-3xl mx-auto leading-relaxed">
              This perpetual machine creates a self-sustaining ecosystem where trading volume directly benefits NFT holders and token holders. 
              The more activity, the more buybacks and burns, creating a virtuous cycle of value creation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};