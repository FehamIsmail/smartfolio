"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import AgentChat from "./components/AgentChat";
import PortfolioRebalancer from "./components/portfolio/PortfolioRebalancer";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Logo from "./components/ui/Logo";
import PriceTicker from "./components/ui/PriceTicker";

/**
 * Home page for SmartFolio that includes both AgentChat and PortfolioRebalancer
 * with a toggle between them
 *
 * @returns {React.ReactNode} The home page
 */
export default function Home() {
  const { chainId, chain } = useAccount();
  const [activeTab, setActiveTab] = useState<'chat' | 'rebalancer'>('chat');
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col flex-grow items-center justify-start w-full h-full">
      {/* Header with wallet connection */}
      <div className="w-full max-w-4xl px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <Logo />
        <div className="crypto-card p-1">
          <ConnectButton />
        </div>
      </div>
      
      {/* Price Ticker */}
      <div className="w-full max-w-4xl px-6 mt-2 mb-4">
        <PriceTicker />
      </div>
      
      {/* Main content card with glow effect */}
      <div className="w-full max-w-4xl px-6 mt-4">
        <div className="crypto-card glow p-6">
          {/* Tab Selector */}
          <div className="mb-6 border-b border-white/10">
            <div className="flex">
              <button
                className={`py-3 px-6 text-center font-medium text-sm transition-all duration-300 ${
                  activeTab === 'chat'
                    ? 'tab-active'
                    : 'tab-inactive'
                }`}
                onClick={() => setActiveTab('chat')}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  Agent Chat
                </div>
              </button>
              <button
                className={`py-3 px-6 text-center font-medium text-sm transition-all duration-300 ${
                  activeTab === 'rebalancer'
                    ? 'tab-active'
                    : 'tab-inactive'
                }`}
                onClick={() => setActiveTab('rebalancer')}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Portfolio Rebalancer
                </div>
              </button>
            </div>
          </div>
          
          {/* Content based on active tab */}
          <div className="min-h-[500px]">
            {activeTab === 'chat' ? (
              <AgentChat />
            ) : (
              <PortfolioRebalancer />
            )}
          </div>
        </div>
      </div>
      
      {/* Network info footer */}
      <div className="w-full max-w-4xl px-6 py-4 mt-8 text-center text-sm text-text-secondary">
        {chain && chainId ? (
          <div className="crypto-card p-3 inline-block">
            <div className="flex items-center gap-2 justify-center">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <p>Connected to {chain?.name} (ID: {chainId})</p>
            </div>
          </div>
        ) : (
          <div className="crypto-card p-3 inline-block">
            <div className="flex items-center gap-2 justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p>Not connected to any network</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
