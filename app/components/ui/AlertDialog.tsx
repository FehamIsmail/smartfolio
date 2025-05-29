/**
 * AlertDialog component for confirmations and alerts
 */
interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export default function AlertDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  type = 'info'
}: AlertDialogProps) {
  if (!isOpen) return null;

  const typeStyles = {
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      titleColor: 'text-blue-700',
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      titleColor: 'text-yellow-700',
      icon: (
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      ),
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white'
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      titleColor: 'text-red-700',
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      confirmButton: 'bg-red-600 hover:bg-red-700 text-white'
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      titleColor: 'text-green-700',
      icon: (
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      ),
      confirmButton: 'bg-green-600 hover:bg-green-700 text-white'
    }
  };

  const style = typeStyles[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`${style.bgColor} border ${style.borderColor} p-6 rounded-lg shadow-lg max-w-md w-full`}>
        <div className="flex items-center mb-4">
          {style.icon}
          <h3 className={`${style.titleColor} text-lg font-bold ml-2`}>{title}</h3>
        </div>
        <div className="mb-6 text-gray-700">{message}</div>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 ${style.confirmButton} rounded`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
} 