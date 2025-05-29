import { NextResponse } from 'next/server';
import { getMarketData } from '@/app/lib/marketData';
import { runMPTAnalysis } from '@/app/lib/mpt';
import { PortfolioAnalysisRequest } from '@/app/types/portfolio';

/**
 * POST handler for portfolio analysis
 * Runs MPT analysis to determine optimal allocation based on risk strategy
 */
export async function POST(
  req: Request & { json: () => Promise<PortfolioAnalysisRequest> }
) {
  try {
    // Parse the request body
    const { riskStrategy, currentHoldings } = await req.json();

    // Validate request
    if (!riskStrategy) {
      return NextResponse.json(
        { error: 'Risk strategy is required' },
        { status: 400 }
      );
    }

    // Get market data
    const marketData = await getMarketData();

    // Run MPT analysis
    const mptResult = runMPTAnalysis(marketData, riskStrategy);

    // Return analysis result
    return NextResponse.json({
      marketData,
      currentHoldings,
      analysisResult: mptResult
    });
  } catch (error) {
    console.error('Error in portfolio analysis API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze portfolio' },
      { status: 500 }
    );
  }
} 