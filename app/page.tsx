"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import AgentChat from "./components/AgentChat";
import PortfolioRebalancer from "./components/portfolio/PortfolioRebalancer";
import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * Home page for SmartFolio that includes both AgentChat and PortfolioRebalancer
 * with a toggle between them
 *
 * @returns {React.ReactNode} The home page
 */
export default function Home() {
  const { chainId, chain } = useAccount();
  const [activeTab, setActiveTab] = useState<'chat' | 'rebalancer'>('chat');

  return (
    <div className="flex flex-col flex-grow items-center justify-start text-black w-full h-full">
      {/* Header with wallet connection */}
      <div className="w-full max-w-4xl px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">SmartFolio</h1>
        <ConnectButton />
      </div>
      
      {/* Tab Selector */}
      <div className="w-full max-w-4xl px-4 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 text-center font-medium text-sm ${
              activeTab === 'chat'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('chat')}
          >
            Agent Chat
          </button>
          <button
            className={`py-2 px-4 text-center font-medium text-sm ${
              activeTab === 'rebalancer'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('rebalancer')}
          >
            Portfolio Rebalancer
          </button>
        </div>
      </div>
      
      {/* Content based on active tab */}
      <div className="w-full max-w-4xl px-4">
        {activeTab === 'chat' ? (
          <AgentChat />
        ) : (
          <PortfolioRebalancer />
        )}
      </div>
      
      {/* Network info footer */}
      <div className="w-full max-w-4xl px-4 py-4 mt-8 text-center text-sm text-gray-500">
        <p>Network ID: {chainId || 'Not connected'}</p>
        <p>Network Name: {chain?.name || 'Not connected'}</p>
      </div>
    </div>
  );
}
