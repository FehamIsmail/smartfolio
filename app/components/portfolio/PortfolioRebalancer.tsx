import { useState, useEffect, useCallback } from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { AssetAllocation, MPTResult, MarketData, RebalancePreviewData, RiskStrategy } from '@/app/types/portfolio';
import { RISK_PROFILES, findClosestPortfolio } from '@/app/lib/mpt';
import { calculateCurrentAllocation, calculatePortfolioValue } from '@/app/lib/marketData';
import RiskStrategySelector from './RiskStrategySelector';
import CurrentPortfolioDisplay from './CurrentPortfolioDisplay';
import MPTAnalysisDisplay from './MPTAnalysisDisplay';
import RebalancePreview from './RebalancePreview';
import TransactionConfirmation from './TransactionConfirmation';
import CustomWeightSelector from './CustomWeightSelector';
import PortfolioAllocationMatrix from './PortfolioAllocationMatrix';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * PortfolioRebalancer component is the main component for the portfolio rebalancer feature
 */
export default function PortfolioRebalancer() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  // State for each step of the rebalancing process
  const [riskStrategy, setRiskStrategy] = useState<RiskStrategy>('balanced');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [holdings, setHoldings] = useState<{ btc: number; eth: number } | null>(null);
  const [mptResult, setMptResult] = useState<MPTResult | null>(null);
  const [previewData, setPreviewData] = useState<RebalancePreviewData | null>(null);
  const [txHashes, setTxHashes] = useState<string[]>([]);
  
  // State for custom weight selection
  const [useCustomWeight, setUseCustomWeight] = useState(false);
  const [customBtcWeight, setCustomBtcWeight] = useState(0.7); // Default to 70% BTC
  
  // Loading and transaction states
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(false);
  const [isLoadingHoldings, setIsLoadingHoldings] = useState(false);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [isCreatingPreview, setIsCreatingPreview] = useState(false);
  const [isExecutingRebalance, setIsExecutingRebalance] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionError, setTransactionError] = useState<string | undefined>(undefined);
  
  // Show/hide state for different views
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Use useBalance hook to get ETH balance (native token)
  const { 
    data: ethBalance,
    isLoading: isLoadingEthBalance 
  } = useBalance({
    address: address,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 10000 // Refetch every 10 seconds
    }
  });
  
  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    setIsLoadingMarketData(true);
    try {
      const response = await fetch('/api/market-data');
      const data = await response.json();
      
      if (response.ok) {
        setMarketData(data);
      } else {
        console.error('Error fetching market data:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setIsLoadingMarketData(false);
    }
  }, []);
  
  // Fetch BTC balance from external API
  const fetchBtcBalance = useCallback(async (): Promise<number> => {
    if (!isConnected || !address) return 0;
    
    try {
      // Call our BTC balance API endpoint
      const response = await fetch(`/api/btc-balance?address=${address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch BTC balance');
      }
      
      const data = await response.json();
      return data.balance;
    } catch (error) {
      console.error('Failed to fetch BTC balance:', error);
      return 0;
    }
  }, [isConnected, address]);
  
  // Update holdings when balances change
  useEffect(() => {
    const updateHoldings = async () => {
      setIsLoadingHoldings(true);
      
      try {
        if (isConnected && ethBalance) {
          // Get BTC balance
          const btcBalance = await fetchBtcBalance();
          
          // Convert from formatted string to number for ETH
          const ethValue = parseFloat(ethBalance.formatted);
          
          setHoldings({
            btc: btcBalance,
            eth: ethValue
          });
        } else {
          // If not connected, set to zeros
          setHoldings({
            btc: 0,
            eth: 0
          });
        }
      } catch (error) {
        console.error('Error updating holdings:', error);
      } finally {
        setIsLoadingHoldings(false);
      }
    };
    
    updateHoldings();
  }, [isConnected, ethBalance, fetchBtcBalance]);
  
  // Handle custom weight selection
  const handleCustomWeightSelect = (btcWeight: number) => {
    setCustomBtcWeight(btcWeight);
    
    if (useCustomWeight && marketData) {
      // Generate MPT result using the custom weight
      const portfolio = findClosestPortfolio(btcWeight);
      
      const customResult: MPTResult = {
        optimalRatio: {
          btc: btcWeight,
          eth: 1 - btcWeight
        },
        expectedReturn: portfolio.expectedReturn,
        expectedRisk: portfolio.volatility,
        sharpeRatio: portfolio.sharpeRatio,
        sortinoRatio: portfolio.sortinoRatio,
        reasoning: `Custom portfolio allocation of ${Math.round(btcWeight * 100)}% BTC and ${Math.round((1 - btcWeight) * 100)}% ETH. This allocation has an expected annual return of ${(portfolio.expectedReturn * 100).toFixed(2)}% with portfolio volatility of ${(portfolio.volatility * 100).toFixed(2)}%, yielding a Sharpe Ratio of ${portfolio.sharpeRatio.toFixed(2)} and Sortino Ratio of ${portfolio.sortinoRatio.toFixed(2)}.`
      };
      
      setMptResult(customResult);
    }
  };
  
  // Toggle between risk profiles and custom weight
  const toggleCustomWeight = () => {
    setUseCustomWeight(!useCustomWeight);
    
    if (!useCustomWeight && marketData) {
      // Switching to custom weight mode
      handleCustomWeightSelect(customBtcWeight);
    } else if (useCustomWeight && marketData) {
      // Switching back to risk profile mode
      runAnalysis();
    }
  };
  
  // Run MPT analysis
  const runAnalysis = useCallback(async () => {
    if (!marketData || !holdings) return;
    
    setIsRunningAnalysis(true);
    try {
      if (useCustomWeight) {
        // Use the custom weight instead of calling the API
        handleCustomWeightSelect(customBtcWeight);
        setIsRunningAnalysis(false);
        return;
      }
      
      const response = await fetch('/api/portfolio/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          riskStrategy,
          currentHoldings: holdings
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMptResult(data.analysisResult);
      } else {
        console.error('Error running analysis:', data.error);
      }
    } catch (error) {
      console.error('Failed to run analysis:', error);
    } finally {
      setIsRunningAnalysis(false);
    }
  }, [marketData, holdings, riskStrategy, useCustomWeight, customBtcWeight]);
  
  // Create rebalance preview
  const createRebalancePreview = useCallback(() => {
    if (!marketData || !holdings || !mptResult) return;
    
    setIsCreatingPreview(true);
    try {
      // Calculate current portfolio value and allocation
      const currentValue = calculatePortfolioValue(
        holdings,
        { btcPrice: marketData.btcPrice, ethPrice: marketData.ethPrice }
      );
      
      const currentAllocation = calculateCurrentAllocation(currentValue);
      
      // Calculate target portfolio value (same total, different allocation)
      const targetBtcValue = currentValue.total * mptResult.optimalRatio.btc;
      const targetEthValue = currentValue.total * mptResult.optimalRatio.eth;
      
      const targetValue = {
        btc: targetBtcValue,
        eth: targetEthValue,
        total: currentValue.total
      };
      
      // Calculate transactions needed
      const transactionsNeeded = {
        ...(currentValue.btc > targetBtcValue ? {
          sell: {
            asset: 'btc' as const,
            amount: (currentValue.btc - targetBtcValue) / marketData.btcPrice,
            valueUSD: currentValue.btc - targetBtcValue
          }
        } : null),
        ...(currentValue.eth > targetEthValue ? {
          sell: {
            asset: 'eth' as const,
            amount: (currentValue.eth - targetEthValue) / marketData.ethPrice,
            valueUSD: currentValue.eth - targetEthValue
          }
        } : null),
        ...(currentValue.btc < targetBtcValue ? {
          buy: {
            asset: 'btc' as const,
            amount: (targetBtcValue - currentValue.btc) / marketData.btcPrice,
            valueUSD: targetBtcValue - currentValue.btc
          }
        } : null),
        ...(currentValue.eth < targetEthValue ? {
          buy: {
            asset: 'eth' as const,
            amount: (targetEthValue - currentValue.eth) / marketData.ethPrice,
            valueUSD: targetEthValue - currentValue.eth
          }
        } : null)
      };
      
      // Create preview data
      const preview: RebalancePreviewData = {
        currentAllocation,
        targetAllocation: mptResult.optimalRatio,
        currentValue,
        targetValue,
        transactionsNeeded: transactionsNeeded as any // Type assertion for simplicity
      };
      
      setPreviewData(preview);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to create rebalance preview:', error);
    } finally {
      setIsCreatingPreview(false);
    }
  }, [marketData, holdings, mptResult]);
  
  // Execute rebalance
  const executeRebalance = useCallback(async () => {
    if (!mptResult || !address) return;
    
    setIsExecutingRebalance(true);
    setShowPreview(false);
    setShowConfirmation(true);
    
    try {
      const walletConfig = isConnected && address && chainId 
        ? { address: address as `0x${string}`, chainId }
        : undefined;
      
      const response = await fetch('/api/portfolio/rebalance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetRatio: mptResult.optimalRatio,
          walletConfig,
          currentHoldings: holdings // Pass the actual holdings to the API
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTransactionSuccess(true);
        setTxHashes(data.txHashes || []);
      } else {
        setTransactionSuccess(false);
        setTransactionError(data.error || 'Failed to execute rebalance');
      }
    } catch (error) {
      console.error('Failed to execute rebalance:', error);
      setTransactionSuccess(false);
      setTransactionError('An unexpected error occurred');
    } finally {
      setIsExecutingRebalance(false);
      setTransactionComplete(true);
    }
  }, [mptResult, address, isConnected, chainId, holdings]);
  
  // Reset transaction state
  const resetTransactionState = () => {
    setShowConfirmation(false);
    setTransactionComplete(false);
    setTransactionSuccess(false);
    setTransactionError(undefined);
    setTxHashes([]);
  };
  
  // Cancel rebalance preview
  const cancelRebalancePreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };
  
  // Fetch initial data
  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Portfolio Rebalancer</h2>
        <p className="text-gray-600 mt-1">
          Optimize your BTC/ETH allocation using <a href="https://coinbureau.com/education/modern-portfolio-theory-crypto/" className="text-blue-600 hover:underline">Modern Portfolio Theory</a>
        </p>
      </div>
      
      {/* Connection Status */}
      {!isConnected && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">
            Connect your wallet to see your actual ETH balance. BTC balances may require additional configuration.
          </p>
        </div>
      )}
      
      {/* Strategy Selection Toggle */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Allocation Strategy</h3>
          <div className="flex items-center">
            <span className={`mr-2 text-sm ${!useCustomWeight ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
              Risk Profiles
            </span>
            <button 
              onClick={toggleCustomWeight}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${useCustomWeight ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useCustomWeight ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span className={`ml-2 text-sm ${useCustomWeight ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
              Custom Weight
            </span>
          </div>
        </div>
      </div>
      
      {/* Risk Strategy or Custom Weight Selector */}
      {!useCustomWeight ? (
        <RiskStrategySelector 
          selectedStrategy={riskStrategy}
          onChange={setRiskStrategy}
        />
      ) : (
        <CustomWeightSelector
          onSelect={handleCustomWeightSelect}
          defaultBtcWeight={customBtcWeight}
        />
      )}
      
      {/* Portfolio Allocation Matrix */}
      <PortfolioAllocationMatrix 
        riskStrategy={useCustomWeight ? 'balanced' : riskStrategy} 
      />
      
      {/* Current Portfolio Display */}
      <CurrentPortfolioDisplay
        holdings={holdings}
        marketData={marketData}
        isLoading={isLoadingMarketData || isLoadingHoldings}
      />
      
      {/* MPT Analysis Display */}
      <MPTAnalysisDisplay
        mptResult={mptResult}
        marketData={marketData}
        riskStrategy={useCustomWeight ? 'balanced' : riskStrategy}
        isLoading={isRunningAnalysis}
      />
      
      {/* Analysis and Rebalance Buttons */}
      {!showPreview && !showConfirmation && (
        <div className="flex justify-end space-x-3 mb-6">
          <button
            onClick={runAnalysis}
            disabled={!marketData || !holdings || isRunningAnalysis}
            className={`px-4 py-2 rounded-md ${
              !marketData || !holdings || isRunningAnalysis
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRunningAnalysis ? (
              <span className="flex items-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Analyzing...</span>
              </span>
            ) : useCustomWeight ? 'Apply Custom Weight' : 'Run MPT Analysis'}
          </button>
          
          {mptResult && (
            <button
              onClick={createRebalancePreview}
              disabled={isCreatingPreview}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              {isCreatingPreview ? (
                <span className="flex items-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Creating Preview...</span>
                </span>
              ) : 'Preview Rebalance'}
            </button>
          )}
        </div>
      )}
      
      {/* Rebalance Preview */}
      {showPreview && previewData && (
        <RebalancePreview
          previewData={previewData}
          isLoading={isCreatingPreview}
          onConfirm={executeRebalance}
          onCancel={cancelRebalancePreview}
        />
      )}
      
      {/* Transaction Confirmation */}
      {showConfirmation && (
        <TransactionConfirmation
          isSuccess={transactionSuccess}
          isLoading={isExecutingRebalance}
          txHashes={txHashes}
          error={transactionError}
          onClose={resetTransactionState}
        />
      )}
    </div>
  );
} 