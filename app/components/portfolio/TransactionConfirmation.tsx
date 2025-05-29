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
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Processing Transactions</h3>
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingSpinner size="md" />
          <p className="mt-4 text-gray-500">Executing rebalance transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-medium mb-4">
        {isSuccess ? 'Rebalance Complete' : 'Transaction Failed'}
      </h3>
      
      {isSuccess ? (
        <div className="p-4 bg-green-50 rounded-lg mb-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-green-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <h4 className="font-medium text-green-800">Portfolio Successfully Rebalanced</h4>
              <p className="text-sm text-gray-600 mt-1">
                Your portfolio has been successfully rebalanced according to the Modern Portfolio Theory recommendations.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-red-50 rounded-lg mb-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h4 className="font-medium text-red-800">Transaction Failed</h4>
              <p className="text-sm text-gray-600 mt-1">
                {error || 'There was an error processing your rebalance transactions. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {isSuccess && txHashes.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Transaction Details</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {txHashes.map((hash, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded text-sm font-mono break-all">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Tx #{index + 1}:</span>
                  <a 
                    href={`https://etherscan.io/tx/${hash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-2"
                  >
                    View
                  </a>
                </div>
                <div className="mt-1">{hash}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSuccess ? 'Done' : 'Try Again'}
        </button>
      </div>
    </div>
  );
} 