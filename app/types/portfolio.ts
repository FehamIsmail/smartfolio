export type RiskStrategy = 'conservative' | 'balanced' | 'aggressive';

export interface RiskProfile {
  name: RiskStrategy;
  description: string;
  targetVolatility: number;
  riskTolerance: number;
  defaultRatio: {
    btc: number;
    eth: number;
  };
  metrics?: {
    volatility: number;
    expectedReturn: number;
    sharpeRatio: number;
    sortinoRatio: number;
  };
}

export interface AssetAllocation {
  btc: number;
  eth: number;
}

export interface MarketData {
  btcPrice: number;
  ethPrice: number;
  btcVolatility: number;
  ethVolatility: number;
  correlation: number;
  timestamp: number;
}

export interface MPTResult {
  optimalRatio: AssetAllocation;
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
  sortinoRatio?: number;
  reasoning: string;
}

export interface PortfolioAnalysisRequest {
  riskStrategy: RiskStrategy;
  currentHoldings: AssetAllocation;
}

export interface PortfolioRebalanceRequest {
  targetRatio: AssetAllocation;
  walletConfig?: {
    address: `0x${string}`;
    chainId: number;
  };
  currentHoldings?: {
    btc: number;
    eth: number;
  };
}

export interface RebalancePreviewData {
  currentAllocation: AssetAllocation;
  targetAllocation: AssetAllocation;
  currentValue: {
    btc: number;
    eth: number;
    total: number;
  };
  targetValue: {
    btc: number;
    eth: number;
    total: number;
  };
  transactionsNeeded: {
    sell?: {
      asset: 'btc' | 'eth';
      amount: number;
      valueUSD: number;
    };
    buy?: {
      asset: 'btc' | 'eth';
      amount: number;
      valueUSD: number;
    };
  };
} 