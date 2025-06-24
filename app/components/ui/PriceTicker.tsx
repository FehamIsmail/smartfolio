"use client";

import React, { useState, useEffect } from 'react';

interface PriceData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  icon: string;
}

// Mock data - in a real app, this would come from an API
const initialPriceData: PriceData[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 60000,
    change24h: 2.5,
    icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=026'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3000,
    change24h: -1.2,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026'
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    price: 120,
    change24h: 5.7,
    icon: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=026'
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.45,
    change24h: 0.8,
    icon: 'https://cryptologos.cc/logos/cardano-ada-logo.svg?v=026'
  }
];

export const PriceTicker: React.FC = () => {
  const [prices, setPrices] = useState<PriceData[]>(initialPriceData);
  
  // Simulate price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(currentPrices => 
        currentPrices.map(coin => ({
          ...coin,
          price: coin.price * (1 + (Math.random() * 0.01 - 0.005)),
          change24h: coin.change24h + (Math.random() * 0.4 - 0.2)
        }))
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden crypto-card py-2">
      <div className="flex animate-marquee">
        {prices.concat(prices).map((coin, index) => (
          <div key={`${coin.symbol}-${index}`} className="flex items-center mx-4 whitespace-nowrap">
            <img 
              src={coin.icon} 
              alt={coin.name} 
              className="w-5 h-5 mr-2"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="font-medium">{coin.symbol}</span>
            <span className="ml-2">${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            <span 
              className={`ml-2 ${
                coin.change24h >= 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}
            >
              {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTicker; 