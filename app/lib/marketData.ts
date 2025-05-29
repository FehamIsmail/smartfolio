import { MarketData } from '../types/portfolio';

// Cache settings
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cachedMarketData: MarketData | null = null;
let cacheTimestamp = 0;

/**
 * Fetch current cryptocurrency prices from CoinGecko API
 */
async function fetchCurrentPrices(): Promise<{ btcPrice: number; ethPrice: number }> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching prices: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      btcPrice: data.bitcoin.usd,
      ethPrice: data.ethereum.usd
    };
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    // Return some fallback values in case of API failure
    return {
      btcPrice: 60000,
      ethPrice: 3000
    };
  }
}

/**
 * Fetch historical price data for volatility calculation
 * Returns daily closing prices for the past 30 days
 */
async function fetchHistoricalPrices(): Promise<{
  btcPrices: number[];
  ethPrices: number[];
}> {
  try {
    // Get 30 days of daily data
    const endDate = Math.floor(Date.now() / 1000);
    const startDate = endDate - (30 * 24 * 60 * 60); // 30 days ago
    
    // Fetch BTC historical data
    const btcResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=${startDate}&to=${endDate}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    // Fetch ETH historical data
    const ethResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=${startDate}&to=${endDate}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!btcResponse.ok || !ethResponse.ok) {
      throw new Error(`Error fetching historical data`);
    }

    const btcData = await btcResponse.json();
    const ethData = await ethResponse.json();
    
    // Extract daily closing prices
    const btcPrices = btcData.prices.map((price: [number, number]) => price[1]);
    const ethPrices = ethData.prices.map((price: [number, number]) => price[1]);
    
    return {
      btcPrices,
      ethPrices
    };
  } catch (error) {
    console.error('Failed to fetch historical prices:', error);
    // Return some mock data in case of API failure
    return {
      btcPrices: Array(30).fill(0).map((_, i) => 60000 + (Math.random() * 5000 - 2500)),
      ethPrices: Array(30).fill(0).map((_, i) => 3000 + (Math.random() * 300 - 150))
    };
  }
}

/**
 * Calculate daily returns from price series
 */
function calculateDailyReturns(prices: number[]): number[] {
  const returns: number[] = [];
  
  for (let i = 1; i < prices.length; i++) {
    const dailyReturn = (prices[i] - prices[i - 1]) / prices[i - 1];
    returns.push(dailyReturn);
  }
  
  return returns;
}

/**
 * Calculate volatility (standard deviation of returns)
 */
function calculateVolatility(returns: number[]): number {
  // Calculate mean return
  const mean = returns.reduce((sum, return_) => sum + return_, 0) / returns.length;
  
  // Calculate sum of squared differences
  const squaredDiffs = returns.map(return_ => Math.pow(return_ - mean, 2));
  const sumSquaredDiffs = squaredDiffs.reduce((sum, diff) => sum + diff, 0);
  
  // Calculate standard deviation
  const standardDeviation = Math.sqrt(sumSquaredDiffs / returns.length);
  
  // Annualize (assuming daily returns, multiply by sqrt of 365)
  return standardDeviation * Math.sqrt(365);
}

/**
 * Calculate correlation coefficient between two return series
 */
function calculateCorrelation(returnsA: number[], returnsB: number[]): number {
  const n = Math.min(returnsA.length, returnsB.length);
  
  // Calculate means
  const meanA = returnsA.reduce((sum, val) => sum + val, 0) / n;
  const meanB = returnsB.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate covariance and variances
  let covariance = 0;
  let varianceA = 0;
  let varianceB = 0;
  
  for (let i = 0; i < n; i++) {
    const diffA = returnsA[i] - meanA;
    const diffB = returnsB[i] - meanB;
    
    covariance += diffA * diffB;
    varianceA += diffA * diffA;
    varianceB += diffB * diffB;
  }
  
  covariance /= n;
  varianceA /= n;
  varianceB /= n;
  
  // Calculate correlation coefficient
  return covariance / (Math.sqrt(varianceA) * Math.sqrt(varianceB));
}

/**
 * Main function to get market data, using cache if available
 */
export async function getMarketData(): Promise<MarketData> {
  const currentTime = Date.now();
  
  // Return cached data if available and not expired
  if (cachedMarketData && (currentTime - cacheTimestamp < CACHE_DURATION)) {
    return cachedMarketData;
  }
  
  try {
    // Fetch current and historical price data
    const [currentPrices, historicalPrices] = await Promise.all([
      fetchCurrentPrices(),
      fetchHistoricalPrices()
    ]);
    
    // Calculate returns
    const btcReturns = calculateDailyReturns(historicalPrices.btcPrices);
    const ethReturns = calculateDailyReturns(historicalPrices.ethPrices);
    
    // Calculate volatilities
    const btcVolatility = calculateVolatility(btcReturns);
    const ethVolatility = calculateVolatility(ethReturns);
    
    // Calculate correlation
    const correlation = calculateCorrelation(btcReturns, ethReturns);
    
    // Create market data object
    const marketData: MarketData = {
      btcPrice: currentPrices.btcPrice,
      ethPrice: currentPrices.ethPrice,
      btcVolatility,
      ethVolatility,
      correlation,
      timestamp: currentTime
    };
    
    // Update cache
    cachedMarketData = marketData;
    cacheTimestamp = currentTime;
    
    return marketData;
  } catch (error) {
    console.error('Error getting market data:', error);
    
    // Return cached data even if expired, or fallback data if no cache exists
    if (cachedMarketData) {
      return cachedMarketData;
    }
    
    // Fallback market data
    return {
      btcPrice: 60000,
      ethPrice: 3000,
      btcVolatility: 0.65, // 65% annual volatility
      ethVolatility: 0.75, // 75% annual volatility
      correlation: 0.7,    // 0.7 correlation
      timestamp: currentTime
    };
  }
}

/**
 * Get current wallet holdings in BTC and ETH
 * This would typically use AgentKit to query blockchain data
 * This is a placeholder that would be implemented using AgentKit
 * 
 * NOTE: In client components, use wagmi hooks like useBalance instead of this function
 * to get real-time wallet balances.
 */
export async function getWalletHoldings(walletAddress: string): Promise<{
  btc: number;
  eth: number;
}> {
  try {
    // This would be implemented using AgentKit wallet tools
    // For now, returning mock data
    return {
      btc: 0.1,  // 0.1 BTC
      eth: 1.5   // 1.5 ETH
    };
  } catch (error) {
    console.error('Error getting wallet holdings:', error);
    return {
      btc: 0,
      eth: 0
    };
  }
}

/**
 * Calculate portfolio value in USD
 */
export function calculatePortfolioValue(
  holdings: { btc: number; eth: number },
  prices: { btcPrice: number; ethPrice: number }
): {
  btc: number;
  eth: number;
  total: number;
} {
  const btcValue = holdings.btc * prices.btcPrice;
  const ethValue = holdings.eth * prices.ethPrice;
  
  return {
    btc: btcValue,
    eth: ethValue,
    total: btcValue + ethValue
  };
}

/**
 * Calculate current portfolio allocation
 */
export function calculateCurrentAllocation(
  value: { btc: number; eth: number; total: number }
): { btc: number; eth: number } {
  if (value.total === 0) {
    return { btc: 0.5, eth: 0.5 }; // Default 50/50 if no holdings
  }
  
  return {
    btc: value.btc / value.total,
    eth: value.eth / value.total
  };
}

/**
 * Calculate transactions needed to rebalance portfolio
 */
export function calculateRebalanceTransactions(
  currentValue: { btc: number; eth: number; total: number },
  targetAllocation: { btc: number; eth: number },
  prices: { btcPrice: number; ethPrice: number }
): {
  sell?: { asset: 'btc' | 'eth'; amount: number; valueUSD: number };
  buy?: { asset: 'btc' | 'eth'; amount: number; valueUSD: number };
} {
  // Calculate target values
  const targetBtcValue = currentValue.total * targetAllocation.btc;
  const targetEthValue = currentValue.total * targetAllocation.eth;
  
  // Calculate differences
  const btcDiff = currentValue.btc - targetBtcValue;
  const ethDiff = currentValue.eth - targetEthValue;
  
  const result: {
    sell?: { asset: 'btc' | 'eth'; amount: number; valueUSD: number };
    buy?: { asset: 'btc' | 'eth'; amount: number; valueUSD: number };
  } = {};
  
  // Determine which asset to sell and which to buy
  if (btcDiff > 0) {
    // Sell BTC, buy ETH
    const btcAmountToSell = btcDiff / prices.btcPrice;
    const ethAmountToBuy = ethDiff / prices.ethPrice;
    
    result.sell = {
      asset: 'btc',
      amount: btcAmountToSell,
      valueUSD: btcDiff
    };
    
    result.buy = {
      asset: 'eth',
      amount: ethAmountToBuy,
      valueUSD: ethDiff
    };
  } else if (ethDiff > 0) {
    // Sell ETH, buy BTC
    const ethAmountToSell = ethDiff / prices.ethPrice;
    const btcAmountToBuy = btcDiff / prices.btcPrice;
    
    result.sell = {
      asset: 'eth',
      amount: ethAmountToSell,
      valueUSD: ethDiff
    };
    
    result.buy = {
      asset: 'btc',
      amount: Math.abs(btcAmountToBuy),
      valueUSD: Math.abs(btcDiff)
    };
  }
  
  return result;
} 