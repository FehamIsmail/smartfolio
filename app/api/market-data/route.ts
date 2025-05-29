import { NextResponse } from 'next/server';
import { getMarketData } from '@/app/lib/marketData';

/**
 * GET handler for market data
 * Fetches current crypto prices, volatility, and correlation data
 */
export async function GET() {
  try {
    // Get market data
    const marketData = await getMarketData();
    
    // Return market data
    return NextResponse.json(marketData);
  } catch (error) {
    console.error('Error in market data API:', error);
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
} 