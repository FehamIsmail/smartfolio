import { AssetAllocation, RebalancePreviewData } from '@/app/types/portfolio';
import ProgressBar from '../ui/ProgressBar';
import AlertDialog from '../ui/AlertDialog';
import { useState } from 'react';

interface RebalancePreviewProps {
  previewData: RebalancePreviewData | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * RebalancePreview component shows the preview of rebalancing actions
 */
export default function RebalancePreview({
  previewData,
  isLoading,
  onConfirm,
  onCancel
}: RebalancePreviewProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  if (!previewData) {
    return null;
  }
  
  const { 
    currentAllocation, 
    targetAllocation, 
    currentValue, 
    targetValue,
    transactionsNeeded 
  } = previewData;
  
  // Format percentages
  const currentBtcPercent = (currentAllocation.btc * 100).toFixed(1);
  const currentEthPercent = (currentAllocation.eth * 100).toFixed(1);
  const targetBtcPercent = (targetAllocation.btc * 100).toFixed(1);
  const targetEthPercent = (targetAllocation.eth * 100).toFixed(1);
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-medium mb-4">Rebalance Preview</h3>
      
      <div className="space-y-6">
        {/* Allocation Comparison */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Allocation Change</h4>
          
          <div className="space-y-4">
            <div>
              <ProgressBar
                label="BTC Allocation"
                currentValue={parseFloat(currentBtcPercent)}
                targetValue={parseFloat(targetBtcPercent)}
                unit="%"
              />
            </div>
            
            <div>
              <ProgressBar
                label="ETH Allocation"
                currentValue={parseFloat(currentEthPercent)}
                targetValue={parseFloat(targetEthPercent)}
                unit="%"
              />
            </div>
          </div>
        </div>
        
        {/* Transaction Details */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Required Transactions</h4>
          
          {!transactionsNeeded.sell && !transactionsNeeded.buy ? (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">
              No transactions needed. Your portfolio is already optimally balanced.
            </div>
          ) : (
            <div className="space-y-3">
              {transactionsNeeded.sell && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Sell {transactionsNeeded.sell.asset.toUpperCase()}</span>
                  </div>
                  
                  <div className="ml-7 space-y-1">
                    <div className="text-sm">
                      Amount: <span className="font-medium">{transactionsNeeded.sell.amount.toFixed(8)} {transactionsNeeded.sell.asset.toUpperCase()}</span>
                    </div>
                    <div className="text-sm">
                      Value: <span className="font-medium">${transactionsNeeded.sell.valueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {transactionsNeeded.buy && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Buy {transactionsNeeded.buy.asset.toUpperCase()}</span>
                  </div>
                  
                  <div className="ml-7 space-y-1">
                    <div className="text-sm">
                      Amount: <span className="font-medium">{transactionsNeeded.buy.amount.toFixed(8)} {transactionsNeeded.buy.asset.toUpperCase()}</span>
                    </div>
                    <div className="text-sm">
                      Value: <span className="font-medium">${transactionsNeeded.buy.valueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button 
            onClick={() => setShowConfirmDialog(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={!transactionsNeeded.sell && !transactionsNeeded.buy}
          >
            Rebalance Portfolio
          </button>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={showConfirmDialog}
        title="Confirm Portfolio Rebalance"
        message={`Are you sure you want to rebalance your portfolio from ${currentBtcPercent}% BTC / ${currentEthPercent}% ETH to ${targetBtcPercent}% BTC / ${targetEthPercent}% ETH? This will execute the following transactions: ${
          transactionsNeeded.sell 
            ? `Sell ${transactionsNeeded.sell.amount.toFixed(6)} ${transactionsNeeded.sell.asset.toUpperCase()}` 
            : ''
        }${
          transactionsNeeded.sell && transactionsNeeded.buy ? ' and ' : ''
        }${
          transactionsNeeded.buy 
            ? `Buy ${transactionsNeeded.buy.amount.toFixed(6)} ${transactionsNeeded.buy.asset.toUpperCase()}` 
            : ''
        }.`}
        confirmLabel="Confirm Rebalance"
        cancelLabel="Cancel"
        onConfirm={() => {
          setShowConfirmDialog(false);
          onConfirm();
        }}
        onCancel={() => setShowConfirmDialog(false)}
        type="warning"
      />
    </div>
  );
} 