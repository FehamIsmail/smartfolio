/**
 * ProgressBar component to show progress between values
 */
interface ProgressBarProps {
  currentValue: number;
  targetValue: number;
  label?: string;
  unit?: string;
  className?: string;
}

export default function ProgressBar({
  currentValue,
  targetValue,
  label,
  unit = '%',
  className = ''
}: ProgressBarProps) {
  // Ensure current and target values are between 0 and 100
  const normalizedCurrent = Math.min(Math.max(currentValue, 0), 100);
  const normalizedTarget = Math.min(Math.max(targetValue, 0), 100);
  
  // Whether target is higher or lower than current
  const isIncreasing = targetValue > currentValue;
  
  // Calculate width percentages for visual display
  const currentWidth = `${normalizedCurrent}%`;
  
  // Style based on direction
  const targetIndicatorColor = isIncreasing ? 'border-green-500' : 'border-red-500';
  const arrowDirection = isIncreasing ? '↑' : '↓';
  const arrowColor = isIncreasing ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-text-primary">{label}</span>
          <div className="flex items-center">
            <span className="text-sm font-medium text-text-primary">
              {normalizedCurrent.toFixed(1)}{unit}
            </span>
            <span className={`mx-2 font-bold ${arrowColor}`}>{arrowDirection}</span>
            <span className="text-sm font-medium text-text-primary">
              {normalizedTarget.toFixed(1)}{unit}
            </span>
          </div>
        </div>
      )}
      
      <div className="relative w-full h-4 bg-background-start rounded-full overflow-hidden">
        {/* Current value bar */}
        <div 
          className="absolute h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: currentWidth }}
        ></div>
        
        {/* Target indicator */}
        <div 
          className={`absolute top-0 bottom-0 w-1 ${targetIndicatorColor} transition-all duration-500`}
          style={{ left: `calc(${normalizedTarget}% - 1px)` }}
        ></div>
      </div>
    </div>
  );
} 