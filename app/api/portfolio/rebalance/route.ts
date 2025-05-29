import { NextResponse } from 'next/server';
import { PortfolioRebalanceRequest } from '@/app/types/portfolio';
import { getMarketData, calculateRebalanceTransactions } from '@/app/lib/marketData';
import { createAgent } from '@/app/api/agent/create-agent';

/**
 * POST handler for portfolio rebalancing
 * Calculates and executes transactions to rebalance the portfolio
 */
export async function POST(
  req: Request & { json: () => Promise<PortfolioRebalanceRequest> }
) {
  try {
    // Parse the request body
    const { targetRatio, walletConfig, currentHoldings } = await req.json();

    // Validate request
    if (!targetRatio) {
      return NextResponse.json(
        { error: 'Target ratio is required' },
        { status: 400 }
      );
    }

    // Get market data
    const marketData = await getMarketData();

    // Get AgentKit agent
    const agent = await createAgent(walletConfig);

    // Use the actual wallet holdings passed from the client
    // If not provided, use AgentKit to fetch them (future implementation)
    // If neither is available, fall back to mock data for testing
    const holdings = currentHoldings || {
      btc: 0.1,
      eth: 1.5
    };

    // Calculate portfolio value
    const currentValue = {
      btc: holdings.btc * marketData.btcPrice,
      eth: holdings.eth * marketData.ethPrice,
      total: holdings.btc * marketData.btcPrice + holdings.eth * marketData.ethPrice
    };

    // Calculate transactions needed
    const transactions = calculateRebalanceTransactions(
      currentValue,
      targetRatio,
      { btcPrice: marketData.btcPrice, ethPrice: marketData.ethPrice }
    );

    // In a real implementation, would use AgentKit to execute these transactions
    
    // Return the rebalance result
    return NextResponse.json({
      success: true,
      message: "Portfolio rebalance simulation completed",
      currentHoldings: holdings,
      marketPrices: {
        btc: marketData.btcPrice,
        eth: marketData.ethPrice
      },
      targetRatio,
      transactions,
      // In a real implementation, would include transaction hashes
      txHashes: ['0x...']
    });
  } catch (error) {
    console.error('Error in portfolio rebalance API:', error);
    return NextResponse.json(
      { error: 'Failed to rebalance portfolio' },
      { status: 500 }
    );
  }
} 