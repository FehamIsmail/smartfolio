import { useState, useEffect } from 'react';
import { PORTFOLIO_MATRIX, findClosestPortfolio } from '@/app/lib/mpt';

interface CustomWeightSelectorProps {
  onSelect: (btcWeight: number) => void;
  defaultBtcWeight: number;
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
        <svg className="mt-[1px] w-3 h-3 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
 * CustomWeightSelector component allows users to select a specific BTC/ETH weight
 */
export default function CustomWeightSelector({ 
  onSelect, 
  defaultBtcWeight 
}: CustomWeightSelectorProps) {
  const [btcWeight, setBtcWeight] = useState(Math.round(defaultBtcWeight * 100));
  const [selectedPortfolio, setSelectedPortfolio] = useState(
    findClosestPortfolio(defaultBtcWeight)
  );
  
  // Update the selected portfolio when btcWeight changes
  useEffect(() => {
    const closest = findClosestPortfolio(btcWeight / 100);
    setSelectedPortfolio(closest);
  }, [btcWeight]);
  
  // Handle weight change
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeight = parseInt(e.target.value, 10);
    setBtcWeight(newWeight);
    onSelect(newWeight / 100);
  };
  
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Custom Portfolio Weight</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            BTC: {btcWeight}% / ETH: {100 - btcWeight}%
          </span>
          <span className="text-xs text-gray-500">
            Drag to adjust
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={btcWeight}
          onChange={handleWeightChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0% BTC</span>
          <span>50%</span>
          <span>100% BTC</span>
        </div>
      </div>
      
      {/* Portfolio Metrics */}
      <div className="mt-4 border-t pt-4">
        <h4 className="text-sm font-medium mb-2">Expected Performance</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-2 rounded border">
            <div className="text-xs text-gray-500">
              <Tooltip text="Volatility measures the price fluctuation of assets. Higher values indicate more price movement and higher risk. A value of 1.0 means 100% annual volatility.">
                Volatility
              </Tooltip>
            </div>
            <div className="font-medium">{selectedPortfolio.volatility.toFixed(3)}</div>
          </div>
          <div className="bg-white p-2 rounded border">
            <div className="text-xs text-gray-500">
              <Tooltip text="Expected annual return based on historical performance. A value of 0.6 means 60% expected annual return on your investment.">
                Expected Return
              </Tooltip>
            </div>
            <div className="font-medium text-green-600">{selectedPortfolio.expectedReturn.toFixed(3)}</div>
          </div>
          <div className="bg-white p-2 rounded border">
            <div className="text-xs text-gray-500">
              <Tooltip text="Sharpe Ratio measures return adjusted for risk. It divides excess return by volatility. Higher values indicate better risk-adjusted returns. Values above 1.0 are considered good.">
                Sharpe Ratio
              </Tooltip>
            </div>
            <div className="font-medium text-blue-600">{selectedPortfolio.sharpeRatio.toFixed(3)}</div>
          </div>
          <div className="bg-white p-2 rounded border">
            <div className="text-xs text-gray-500">
              <Tooltip text="Sortino Ratio is similar to Sharpe Ratio but only considers downside risk (negative returns). It provides a better measure for volatile assets like crypto. Higher values are better.">
                Sortino Ratio
              </Tooltip>
            </div>
            <div className="font-medium text-purple-600">{selectedPortfolio.sortinoRatio.toFixed(3)}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        Based on historical performance data and portfolio optimization calculations.
      </div>
    </div>
  );
} 