import { MarketData } from '@/app/types/portfolio';
import LoadingSpinner from '../ui/LoadingSpinner';

interface CurrentPortfolioDisplayProps {
  holdings: { btc: number; eth: number } | null;
  marketData: MarketData | null;
  isLoading: boolean;
}

/**
 * CurrentPortfolioDisplay component shows current portfolio allocation and values
 */
export default function CurrentPortfolioDisplay({
  holdings,
  marketData,
  isLoading
}: CurrentPortfolioDisplayProps) {
  if (isLoading) {
    return (
      <div className="crypto-card p-6 mb-6">
        <h3 className="text-lg font-medium mb-4 text-text-primary">Current Portfolio</h3>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (!holdings || !marketData) {
    return (
      <div className="crypto-card p-6 mb-6">
        <h3 className="text-lg font-medium mb-4 text-text-primary">Current Portfolio</h3>
        <div className="text-center py-8 text-text-secondary">
          Connect your wallet to view your portfolio
        </div>
      </div>
    );
  }

  // Calculate portfolio value
  const btcValue = holdings.btc * marketData.btcPrice;
  const ethValue = holdings.eth * marketData.ethPrice;
  const totalValue = btcValue + ethValue;

  // Calculate allocation percentages
  const btcPercentage = totalValue > 0 ? (btcValue / totalValue) * 100 : 0;
  const ethPercentage = totalValue > 0 ? (ethValue / totalValue) * 100 : 0;

  return (
    <div className="crypto-card p-6 mb-6">
      <h3 className="text-lg font-medium mb-4 text-text-primary">Current Portfolio</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Holdings Section */}
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">Holdings</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#F7931A]/20 rounded-full flex items-center justify-center mr-2">
                  <span className="text-[#F7931A] font-bold">₿</span>
                </div>
                <span className="text-text-primary">Bitcoin</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-text-primary">{holdings.btc.toFixed(8)} BTC</div>
                <div className="text-sm text-text-secondary">${btcValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-full flex items-center justify-center mr-2">
                  <span className="text-[#3B82F6] font-bold">Ξ</span>
                </div>
                <span className="text-text-primary">Ethereum</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-text-primary">{holdings.eth.toFixed(8)} ETH</div>
                <div className="text-sm text-text-secondary">${ethValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="font-medium text-text-primary">Total Value</span>
                <span className="font-medium text-text-primary">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Allocation Section */}
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">Current Allocation</h4>
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
                  strokeDasharray={`${btcPercentage * 2.51} 251`} 
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
                  strokeDasharray={`${ethPercentage * 2.51} 251`} 
                  strokeDashoffset={`${-btcPercentage * 2.51}`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-xs text-text-primary">Current Allocation</div>
                <div className="font-bold text-[#F7931A]">{btcPercentage.toFixed(1)}% BTC</div>
                <div className="font-bold text-[#3B82F6]">{ethPercentage.toFixed(1)}% ETH</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Market Prices */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center text-sm text-text-secondary">
          <span>Current Market Prices:</span>
          <div>
            <span className="mr-3">BTC: ${marketData.btcPrice.toLocaleString()}</span>
            <span>ETH: ${marketData.ethPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 