import LoadingSpinner from '../ui/LoadingSpinner';

interface TransactionConfirmationProps {
  isSuccess: boolean;
  isLoading: boolean;
  txHashes: string[];
  error?: string;
  onClose: () => void;
}

/**
 * TransactionConfirmation component shows the results of rebalancing transactions
 */
export default function TransactionConfirmation({
  isSuccess,
  isLoading,
  txHashes,
  error,
  onClose
}: TransactionConfirmationProps) {
  if (isLoading) {
    return (
      <div className="crypto-card p-6 mb-6">
        <h3 className="text-lg font-medium mb-4 text-text-primary">Processing Transactions</h3>
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingSpinner size="md" />
          <p className="mt-4 text-text-secondary">Executing rebalance transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crypto-card p-6 mb-6">
      <h3 className="text-lg font-medium mb-4 text-text-primary">
        {isSuccess ? 'Rebalance Complete' : 'Transaction Failed'}
      </h3>
      
      {isSuccess ? (
        <div className="p-4 bg-green-900/20 rounded-lg mb-6 border border-green-500/20">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-green-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <h4 className="font-medium text-green-400">Portfolio Successfully Rebalanced</h4>
              <p className="text-sm text-text-secondary mt-1">
                Your portfolio has been successfully rebalanced according to the Modern Portfolio Theory recommendations.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-red-900/20 rounded-lg mb-6 border border-red-500/20">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h4 className="font-medium text-red-400">Transaction Failed</h4>
              <p className="text-sm text-text-secondary mt-1">
                {error || 'There was an error processing your rebalance transactions. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {isSuccess && txHashes.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Transaction Details</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {txHashes.map((hash, index) => (
              <div key={index} className="p-3 bg-background-start/50 rounded-lg text-sm font-mono break-all border border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Tx #{index + 1}:</span>
                  <a 
                    href={`https://etherscan.io/tx/${hash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark transition-colors"
                  >
                    View
                  </a>
                </div>
                <div className="mt-1 text-text-primary">{hash}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <button 
          onClick={onClose}
          className="btn-primary"
        >
          {isSuccess ? 'Done' : 'Try Again'}
        </button>
      </div>
    </div>
  );
} 