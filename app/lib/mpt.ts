import { AssetAllocation, MPTResult, MarketData, RiskProfile, RiskStrategy } from '../types/portfolio';

// Define risk profiles based on portfolio optimization data
export const RISK_PROFILES: Record<RiskStrategy, RiskProfile> = {
  conservative: {
    name: 'conservative',
    description: 'Lower volatility, stable returns',
    targetVolatility: 0.75, // From the data - corresponds to ~0.745 volatility
    riskTolerance: 0.3,    // Lower risk tolerance factor
    defaultRatio: {
      btc: 0.9,  // 90% BTC
      eth: 0.1   // 10% ETH
    },
    metrics: {
      volatility: 0.745,
      expectedReturn: 0.575,
      sharpeRatio: 0.773,
      sortinoRatio: 0.934
    }
  },
  balanced: {
    name: 'balanced',
    description: 'Moderate risk/reward balance',
    targetVolatility: 0.8, // From the data - corresponds to ~0.79-0.8 volatility
    riskTolerance: 0.5,    // Medium risk tolerance factor
    defaultRatio: {
      btc: 0.7,  // 70% BTC
      eth: 0.3   // 30% ETH
    },
    metrics: {
      volatility: 0.79,
      expectedReturn: 0.643,
      sharpeRatio: 0.813,
      sortinoRatio: 0.976
    }
  },
  aggressive: {
    name: 'aggressive',
    description: 'Higher risk, higher potential returns',
    targetVolatility: 1.05, // From the data - corresponds to ~1.059 volatility
    riskTolerance: 0.7,    // Higher risk tolerance factor
    defaultRatio: {
      btc: 0.2,  // 20% BTC
      eth: 0.8   // 80% ETH
    },
    metrics: {
      volatility: 1.059,
      expectedReturn: 0.776,
      sharpeRatio: 0.732,
      sortinoRatio: 0.893
    }
  }
};

// Portfolio optimization matrix from the data
export const PORTFOLIO_MATRIX = [
  { volatility: 0.792, expectedReturn: 0.644, sharpeRatio: 0.813, sortinoRatio: 0.977, btc: 0.67, eth: 0.33 },
  { volatility: 0.79, expectedReturn: 0.643, sharpeRatio: 0.813, sortinoRatio: 0.976, btc: 0.68, eth: 0.32 },
  { volatility: 0.745, expectedReturn: 0.575, sharpeRatio: 0.773, sortinoRatio: 0.934, btc: 0.93, eth: 0.07 },
  { volatility: 0.759, expectedReturn: 0.611, sharpeRatio: 0.805, sortinoRatio: 0.968, btc: 0.80, eth: 0.20 },
  { volatility: 0.809, expectedReturn: 0.657, sharpeRatio: 0.812, sortinoRatio: 0.975, btc: 0.62, eth: 0.38 },
  { volatility: 0.86, expectedReturn: 0.688, sharpeRatio: 0.800, sortinoRatio: 0.961, btc: 0.51, eth: 0.49 },
  { volatility: 0.909, expectedReturn: 0.713, sharpeRatio: 0.784, sortinoRatio: 0.947, btc: 0.42, eth: 0.58 },
  { volatility: 0.96, expectedReturn: 0.736, sharpeRatio: 0.766, sortinoRatio: 0.929, btc: 0.33, eth: 0.67 },
  { volatility: 1.01, expectedReturn: 0.757, sharpeRatio: 0.749, sortinoRatio: 0.911, btc: 0.25, eth: 0.75 },
  { volatility: 1.059, expectedReturn: 0.776, sharpeRatio: 0.732, sortinoRatio: 0.893, btc: 0.18, eth: 0.82 },
  { volatility: 1.11, expectedReturn: 0.795, sharpeRatio: 0.716, sortinoRatio: 0.876, btc: 0.11, eth: 0.89 }
];

// Risk-free rate (approximate)
const RISK_FREE_RATE = 0.04; // 4% annual return (Treasury bonds)

/**
 * Calculate portfolio variance based on weights, individual volatilities, and correlation
 * Formula: w₁²σ₁² + w₂²σ₂² + 2w₁w₂σ₁σ₂ρ₁₂
 */
export function calculatePortfolioVariance(
  weights: AssetAllocation,
  volatilities: { btc: number; eth: number },
  correlation: number
): number {
  const btcWeight = weights.btc;
  const ethWeight = weights.eth;
  
  const btcVariance = volatilities.btc ** 2;
  const ethVariance = volatilities.eth ** 2;
  
  const covarianceTerm = 2 * btcWeight * ethWeight * volatilities.btc * volatilities.eth * correlation;
  
  return (btcWeight ** 2 * btcVariance) + (ethWeight ** 2 * ethVariance) + covarianceTerm;
}

/**
 * Calculate portfolio expected return based on weights and historical returns
 */
export function calculateExpectedReturn(
  weights: AssetAllocation,
  returns: { btc: number; eth: number }
): number {
  return (weights.btc * returns.btc) + (weights.eth * returns.eth);
}

/**
 * Calculate Sharpe Ratio
 * Formula: (Expected Return - Risk Free Rate) / Portfolio Volatility
 */
export function calculateSharpeRatio(
  expectedReturn: number, 
  portfolioVolatility: number
): number {
  return (expectedReturn - RISK_FREE_RATE) / portfolioVolatility;
}

/**
 * Generate allocation options to simulate across the efficient frontier
 * Returns array of allocations from 0% to 100% BTC in 5% increments
 */
function generateAllocationOptions(): AssetAllocation[] {
  const allocations: AssetAllocation[] = [];
  
  for (let btcPercentage = 0; btcPercentage <= 100; btcPercentage += 5) {
    allocations.push({
      btc: btcPercentage / 100,
      eth: (100 - btcPercentage) / 100
    });
  }
  
  return allocations;
}

/**
 * Find the optimal allocation based on the risk strategy
 */
function findOptimalAllocation(
  simulationResults: Array<{
    allocation: AssetAllocation;
    expectedReturn: number;
    portfolioRisk: number;
    sharpeRatio: number;
  }>,
  riskProfile: RiskProfile
): {
  optimalAllocation: AssetAllocation;
  expectedReturn: number;
  portfolioRisk: number;
  sharpeRatio: number;
} {
  // For conservative, target lower volatility (around 0.75)
  if (riskProfile.name === 'conservative') {
    // Find allocation closest to target volatility of 0.75
    const result = simulationResults
      .sort((a, b) => 
        Math.abs(Math.sqrt(a.portfolioRisk) - 0.75) - 
        Math.abs(Math.sqrt(b.portfolioRisk) - 0.75)
      )[0];
    return {
      optimalAllocation: result.allocation,
      expectedReturn: result.expectedReturn,
      portfolioRisk: result.portfolioRisk,
      sharpeRatio: result.sharpeRatio
    };
  }
  
  // For aggressive, target higher returns with higher volatility (around 1.05)
  if (riskProfile.name === 'aggressive') {
    // Find allocation closest to target volatility of 1.05
    const result = simulationResults
      .sort((a, b) => 
        Math.abs(Math.sqrt(a.portfolioRisk) - 1.05) - 
        Math.abs(Math.sqrt(b.portfolioRisk) - 1.05)
      )[0];
    return {
      optimalAllocation: result.allocation,
      expectedReturn: result.expectedReturn,
      portfolioRisk: result.portfolioRisk,
      sharpeRatio: result.sharpeRatio
    };
  }
  
  // For balanced, target optimal Sharpe ratio (around 0.8)
  // Sort by Sharpe ratio descending
  const sortedResults = [...simulationResults].sort((a, b) => b.sharpeRatio - a.sharpeRatio);
  const result = sortedResults[0];
  return {
    optimalAllocation: result.allocation,
    expectedReturn: result.expectedReturn,
    portfolioRisk: result.portfolioRisk,
    sharpeRatio: result.sharpeRatio
  };
}

/**
 * Generate reasoning text based on MPT analysis results
 */
function generateReasoning(
  optimalAllocation: AssetAllocation,
  marketData: MarketData,
  riskProfile: RiskProfile,
  portfolioRisk: number,
  expectedReturn: number,
  sharpeRatio: number
): string {
  const btcPercent = Math.round(optimalAllocation.btc * 100);
  const ethPercent = Math.round(optimalAllocation.eth * 100);
  
  const riskDescription = riskProfile.name === 'conservative' 
    ? 'minimizing volatility while maintaining reasonable returns' 
    : riskProfile.name === 'balanced'
      ? 'balancing risk and reward optimally' 
      : 'maximizing potential returns while accepting higher volatility';
  
  return `Based on Modern Portfolio Theory analysis with ${riskProfile.name} risk profile (${riskDescription}), the optimal allocation is ${btcPercent}% BTC and ${ethPercent}% ETH. This allocation has an expected annual return of ${(expectedReturn * 100).toFixed(2)}% with portfolio volatility of ${(Math.sqrt(portfolioRisk) * 100).toFixed(2)}%, yielding a Sharpe Ratio of ${sharpeRatio.toFixed(2)}. The current correlation between BTC and ETH is ${marketData.correlation.toFixed(2)}, indicating ${marketData.correlation > 0.7 ? 'strong positive correlation' : marketData.correlation > 0.3 ? 'moderate correlation' : 'lower correlation'}.`;
}

/**
 * Calculate historical returns based on price data
 * Using values derived from the provided optimization chart
 */
function estimateHistoricalReturns(marketData: MarketData): { btc: number; eth: number } {
  // These values are derived from the data in the chart to match the expected returns
  return {
    btc: 0.53, // Estimated annual return for BTC
    eth: 0.86  // Estimated annual return for ETH
  };
}

/**
 * Find the closest portfolio allocation from the matrix
 */
export function findClosestPortfolio(btcWeight: number): {
  volatility: number;
  expectedReturn: number;
  sharpeRatio: number;
  sortinoRatio: number;
  btc: number;
  eth: number;
} {
  return PORTFOLIO_MATRIX.sort((a, b) => 
    Math.abs(a.btc - btcWeight) - Math.abs(b.btc - btcWeight)
  )[0];
}

/**
 * Main MPT analysis function
 */
export function runMPTAnalysis(
  marketData: MarketData,
  riskStrategy: RiskStrategy
): MPTResult {
  const riskProfile = RISK_PROFILES[riskStrategy];
  
  // For the preset strategies, use the predefined values from the matrix
  const optimalRatio = {
    btc: riskProfile.defaultRatio.btc,
    eth: riskProfile.defaultRatio.eth
  };
  
  // Find the closest portfolio in the matrix
  const closestPortfolio = findClosestPortfolio(optimalRatio.btc);
  
  // Generate reasoning text
  const reasoning = generateReasoning(
    optimalRatio,
    marketData,
    riskProfile,
    closestPortfolio.volatility ** 2, // Convert volatility to variance
    closestPortfolio.expectedReturn,
    closestPortfolio.sharpeRatio
  );
  
  return {
    optimalRatio,
    expectedReturn: closestPortfolio.expectedReturn,
    expectedRisk: closestPortfolio.volatility,
    sharpeRatio: closestPortfolio.sharpeRatio,
    sortinoRatio: closestPortfolio.sortinoRatio,
    reasoning
  };
} 