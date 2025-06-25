import { NextResponse } from 'next/server';

// Force dynamic to avoid static rendering issues
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Get the token IDs from the URL query parameters
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    
    if (!ids) {
      return NextResponse.json(
        { error: 'Token IDs are required' },
        { status: 400 }
      );
    }
    
    // Fetch data from CoinGecko API
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cryptocurrency prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency prices' },
      { status: 500 }
    );
  }
} 