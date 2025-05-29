import { useState } from 'react';
import { PORTFOLIO_MATRIX } from '@/app/lib/mpt';
import { RiskStrategy } from '@/app/types/portfolio';

interface PortfolioAllocationMatrixProps {
  riskStrategy: RiskStrategy;
}

/**
 * PortfolioAllocationMatrix component displays allocation options with performance metrics
 */
export default function PortfolioAllocationMatrix({ 
  riskStrategy 
}: PortfolioAllocationMatrixProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-gray-700">Portfolio Allocation Matrix</h4>
        <button 
          onClick={toggleExpanded}
          className="text-xs text-blue-600 flex items-center"
        >
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>Show All</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>
      
      <div className="text-xs text-gray-500 mb-2">
        This table shows different BTC/ETH allocations and their expected performance metrics based on historical data.
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                BTC/ETH
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                Volatility
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                Exp. Return
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                Sharpe Ratio
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                Sortino Ratio
              </th>
            </tr>
          </thead>
           
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Conservative (90/10) */}
            <tr className={riskStrategy === 'conservative' ? 'bg-green-50' : ''}>
              <td className="px-3 py-2 whitespace-nowrap">90/10</td>
              <td className="px-3 py-2 whitespace-nowrap">0.745</td>
              <td className="px-3 py-2 whitespace-nowrap">0.575</td>
              <td className="px-3 py-2 whitespace-nowrap">0.773</td>
              <td className="px-3 py-2 whitespace-nowrap">0.934</td>
            </tr>
            
            {/* Balanced (70/30) */}
            <tr className={riskStrategy === 'balanced' ? 'bg-yellow-50' : ''}>
              <td className="px-3 py-2 whitespace-nowrap">70/30</td>
              <td className="px-3 py-2 whitespace-nowrap">0.790</td>
              <td className="px-3 py-2 whitespace-nowrap">0.643</td>
              <td className="px-3 py-2 whitespace-nowrap">0.813</td>
              <td className="px-3 py-2 whitespace-nowrap">0.976</td>
            </tr>
            
            {/* Show all rows when expanded, otherwise just a subset */}
            {isExpanded ? (
              <>
                {/* Show all portfolio options from the matrix */}
                {PORTFOLIO_MATRIX.map((portfolio, index) => {
                  // Skip the ones we already showed
                  if ((portfolio.btc === 0.9 && portfolio.eth === 0.1) ||
                      (portfolio.btc === 0.7 && portfolio.eth === 0.3) ||
                      (portfolio.btc === 0.2 && portfolio.eth === 0.8)) {
                    return null;
                  }
                  
                  const btcPercent = Math.round(portfolio.btc * 100);
                  const ethPercent = Math.round(portfolio.eth * 100);
                  
                  return (
                    <tr key={index} className={riskStrategy === 'aggressive' && btcPercent === 20 ? 'bg-red-50' : ''}>
                      <td className="px-3 py-2 whitespace-nowrap">{btcPercent}/{ethPercent}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{portfolio.volatility.toFixed(3)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{portfolio.expectedReturn.toFixed(3)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{portfolio.sharpeRatio.toFixed(3)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{portfolio.sortinoRatio.toFixed(3)}</td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <>
                {/* Aggressive (20/80) */}
                <tr className={riskStrategy === 'aggressive' ? 'bg-red-50' : ''}>
                  <td className="px-3 py-2 whitespace-nowrap">20/80</td>
                  <td className="px-3 py-2 whitespace-nowrap">1.059</td>
                  <td className="px-3 py-2 whitespace-nowrap">0.776</td>
                  <td className="px-3 py-2 whitespace-nowrap">0.732</td>
                  <td className="px-3 py-2 whitespace-nowrap">0.893</td>
                </tr>
                
                {/* Just a couple more common ratios */}
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap">50/50</td>
                  <td className="px-3 py-2 whitespace-nowrap">0.860</td>
                  <td className="px-3 py-2 whitespace-nowrap">0.688</td>
                  <td className="px-3 py-2 whitespace-nowrap">0.800</td>
                  <td className="px-3 py-2 whitespace-nowrap">0.961</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 