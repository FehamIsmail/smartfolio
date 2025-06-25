"use client";

import React, { useState, useEffect } from 'react';

interface PriceData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  icon: string;
}

// List of tokens to fetch prices for
const tokens = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=026'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=026'
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    icon: 'https://cryptologos.cc/logos/cardano-ada-logo.svg?v=026'
  }
];

export const PriceTicker: React.FC = () => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch prices from our API route
  const fetchPrices = async () => {
    try {
      // Get comma-separated list of token IDs
      const ids = tokens.map(token => token.id).join(',');
      
      // Fetch price data from our internal API route
      const response = await fetch(`/api/crypto-prices?ids=${ids}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cryptocurrency data');
      }
      
      const data = await response.json();
      
      // Map the API response to our PriceData format
      const priceData: PriceData[] = tokens.map(token => {
        const coinData = data.find((coin: any) => coin.id === token.id);
        return {
          name: token.name,
          symbol: token.symbol,
          price: coinData?.current_price || 0,
          change24h: coinData?.price_change_percentage_24h || 0,
          icon: token.icon
        };
      });
      
      setPrices(priceData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cryptocurrency prices:', err);
      setError('Failed to fetch prices');
      setLoading(false);
    }
  };
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchPrices();
    
    // Refresh prices every 60 seconds
    const interval = setInterval(() => {
      fetchPrices();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Show loading state
  if (loading && prices.length === 0) {
    return <div className="w-full py-2 text-center">Loading prices...</div>;
  }
  
  // Show error state
  if (error && prices.length === 0) {
    return <div className="w-full py-2 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full overflow-hidden crypto-card py-2">
      <div className="flex animate-marquee">
        {/* Duplicate the array to create a continuous scrolling effect */}
        {[...prices, ...prices].map((coin, index) => (
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