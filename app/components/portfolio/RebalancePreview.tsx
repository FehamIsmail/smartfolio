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
    <div className="crypto-card glow p-6 mb-6">
      <h3 className="text-lg font-medium mb-4 text-text-primary">Rebalance Preview</h3>
      
      <div className="space-y-6">
        {/* Allocation Comparison */}
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">Allocation Change</h4>
          
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
          <h4 className="text-sm font-medium text-text-primary mb-3">Required Transactions</h4>
          
          {!transactionsNeeded.sellBtc && !transactionsNeeded.sellEth && 
           !transactionsNeeded.buyBtc && !transactionsNeeded.buyEth ? (
            <div className="text-center py-4 text-text-secondary bg-background-start/50 rounded-lg">
              No transactions needed. Your portfolio is already optimally balanced.
            </div>
          ) : (
            <div className="space-y-3">
              {/* Sell Transactions */}
              {transactionsNeeded.sellBtc && (
                <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/20">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-text-primary">Sell BTC</span>
                  </div>
                  
                  <div className="ml-7 space-y-1">
                    <div className="text-sm text-text-secondary">
                      Amount: <span className="font-medium text-text-primary">{transactionsNeeded.sellBtc.amount.toFixed(8)} BTC</span>
                    </div>
                    <div className="text-sm text-text-secondary">
                      Value: <span className="font-medium text-text-primary">${transactionsNeeded.sellBtc.valueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {transactionsNeeded.sellEth && (
                <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/20">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-text-primary">Sell ETH</span>
                  </div>
                  
                  <div className="ml-7 space-y-1">
                    <div className="text-sm text-text-secondary">
                      Amount: <span className="font-medium text-text-primary">{transactionsNeeded.sellEth.amount.toFixed(8)} ETH</span>
                    </div>
                    <div className="text-sm text-text-secondary">
                      Value: <span className="font-medium text-text-primary">${transactionsNeeded.sellEth.valueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Buy Transactions */}
              {transactionsNeeded.buyBtc && (
                <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/20">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-text-primary">Buy BTC</span>
                  </div>
                  
                  <div className="ml-7 space-y-1">
                    <div className="text-sm text-text-secondary">
                      Amount: <span className="font-medium text-text-primary">{transactionsNeeded.buyBtc.amount.toFixed(8)} BTC</span>
                    </div>
                    <div className="text-sm text-text-secondary">
                      Value: <span className="font-medium text-text-primary">${transactionsNeeded.buyBtc.valueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {transactionsNeeded.buyEth && (
                <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/20">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-text-primary">Buy ETH</span>
                  </div>
                  
                  <div className="ml-7 space-y-1">
                    <div className="text-sm text-text-secondary">
                      Amount: <span className="font-medium text-text-primary">{transactionsNeeded.buyEth.amount.toFixed(8)} ETH</span>
                    </div>
                    <div className="text-sm text-text-secondary">
                      Value: <span className="font-medium text-text-primary">${transactionsNeeded.buyEth.valueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-white/10 rounded-lg text-text-primary hover:bg-background-start/50 transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={() => setShowConfirmDialog(true)}
            className={`btn-primary ${(!transactionsNeeded.sellBtc && !transactionsNeeded.sellEth && !transactionsNeeded.buyBtc && !transactionsNeeded.buyEth) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!transactionsNeeded.sellBtc && !transactionsNeeded.sellEth && !transactionsNeeded.buyBtc && !transactionsNeeded.buyEth}
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
          transactionsNeeded.sellBtc ? `Sell ${transactionsNeeded.sellBtc.amount.toFixed(6)} BTC` : ''
        }${
          transactionsNeeded.sellBtc && (transactionsNeeded.sellEth || transactionsNeeded.buyBtc || transactionsNeeded.buyEth) ? ' and ' : ''
        }${
          transactionsNeeded.sellEth ? `Sell ${transactionsNeeded.sellEth.amount.toFixed(6)} ETH` : ''
        }${
          (transactionsNeeded.sellBtc || transactionsNeeded.sellEth) && (transactionsNeeded.buyBtc || transactionsNeeded.buyEth) ? ' and ' : ''
        }${
          transactionsNeeded.buyBtc ? `Buy ${transactionsNeeded.buyBtc.amount.toFixed(6)} BTC` : ''
        }${
          transactionsNeeded.buyBtc && transactionsNeeded.buyEth ? ' and ' : ''
        }${
          transactionsNeeded.buyEth ? `Buy ${transactionsNeeded.buyEth.amount.toFixed(6)} ETH` : ''
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