/**
 * LoadingSpinner component to indicate loading state
 * @param {string} size - Size of the spinner: 'sm', 'md', or 'lg'
 */
export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }[size];

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClass} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
      ></div>
    </div>
  );
} 