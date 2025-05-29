import { MPTResult, MarketData, RiskStrategy } from '@/app/types/portfolio';
import { RISK_PROFILES } from '@/app/lib/mpt';
import LoadingSpinner from '../ui/LoadingSpinner';

interface MPTAnalysisDisplayProps {
  mptResult: MPTResult | null;
  marketData: MarketData | null;
  riskStrategy: RiskStrategy;
  isLoading: boolean;
}

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

/**
 * Tooltip component for showing explanations
 */
function Tooltip({ text, children }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      <div className="flex items-center">
        {children}
        <svg className="w-3 h-3 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
        </svg>
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
}

/**
 * MPTAnalysisDisplay component shows the results of Modern Portfolio Theory analysis
 */
export default function MPTAnalysisDisplay({
  mptResult,
  marketData,
  riskStrategy,
  isLoading
}: MPTAnalysisDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">MPT Analysis</h3>
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingSpinner size="md" />
          <p className="mt-4 text-gray-500">Running Modern Portfolio Theory analysis...</p>
        </div>
      </div>
    );
  }

  if (!mptResult || !marketData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">MPT Analysis</h3>
        <div className="text-center py-8 text-gray-500">
          Select a risk strategy and run analysis to view optimal allocation
        </div>
      </div>
    );
  }

  const riskProfile = RISK_PROFILES[riskStrategy];
  const btcPercent = Math.round(mptResult.optimalRatio.btc * 100);
  const ethPercent = Math.round(mptResult.optimalRatio.eth * 100);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-medium mb-4">
        <span className="mr-2">MPT Analysis Results</span>
        <span className={`text-sm px-2 py-1 rounded ${
          riskStrategy === 'conservative' ? 'bg-green-100 text-green-800' : 
          riskStrategy === 'balanced' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {riskStrategy.charAt(0).toUpperCase() + riskStrategy.slice(1)}
        </span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Optimal Allocation */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Optimal Allocation</h4>
          <div className="h-48 flex items-center justify-center">
            {/* Simple allocation chart */}
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* BTC slice */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent"
                  stroke="#F7931A" 
                  strokeWidth="20" 
                  strokeDasharray={`${btcPercent * 2.51} 251`} 
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                {/* ETH slice */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent"
                  stroke="#3B82F6" 
                  strokeWidth="20" 
                  strokeDasharray={`${ethPercent * 2.51} 251`} 
                  strokeDashoffset={`${-btcPercent * 2.51}`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-xs">Optimal Allocation</div>
                <div className="font-bold text-orange-500">{btcPercent}% BTC</div>
                <div className="font-bold text-blue-500">{ethPercent}% ETH</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Performance Metrics</h4>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-500">
                <Tooltip text="Expected annual return based on historical performance. A value of 57.5% means your investment is expected to grow by that amount annually on average.">
                  Expected Annual Return
                </Tooltip>
              </div>
              <div className="text-lg font-medium text-green-600">
                {(mptResult.expectedReturn * 100).toFixed(2)}%
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-500">
                <Tooltip text="Volatility measures the price fluctuation of your portfolio. Higher values indicate more price movement and higher risk. A value of 74.5% means your portfolio value could fluctuate by that percentage annually.">
                  Expected Volatility
                </Tooltip>
              </div>
              <div className="text-lg font-medium text-yellow-600">
                {(mptResult.expectedRisk * 100).toFixed(2)}%
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-500">
                <Tooltip text="Sharpe Ratio measures return adjusted for risk. It divides excess return by volatility. Higher values indicate better risk-adjusted returns. Values above 1.0 are considered good, while above 2.0 are excellent.">
                  Sharpe Ratio
                </Tooltip>
              </div>
              <div className="text-lg font-medium text-blue-600">
                {mptResult.sharpeRatio.toFixed(3)}
              </div>
            </div>
            
            {mptResult.sortinoRatio && (
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-500">
                  <Tooltip text="Sortino Ratio is similar to Sharpe Ratio but only considers downside risk (negative returns). It provides a better measure for volatile assets like crypto. Higher values are better, with values above 1.0 considered good.">
                    Sortino Ratio
                  </Tooltip>
                </div>
                <div className="text-lg font-medium text-purple-600">
                  {mptResult.sortinoRatio.toFixed(3)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Reasoning */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
        <h4 className="font-medium text-blue-700 mb-2">MPT Analysis Reasoning</h4>
        <p className="text-gray-700">{mptResult.reasoning}</p>
      </div>
      
      {/* Market Correlation */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-500">
            <Tooltip text="Correlation measures how BTC and ETH prices move together. Values range from -1 to 1. Higher values mean they move together closely. Lower correlation is better for diversification benefits.">
              BTC-ETH Correlation:
            </Tooltip>
          </div>
          <span className={`font-medium ${
            marketData.correlation > 0.7 ? 'text-red-600' : 
            marketData.correlation > 0.3 ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {marketData.correlation.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
} 