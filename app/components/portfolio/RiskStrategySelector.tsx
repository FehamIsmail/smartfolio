import { RiskStrategy } from '@/app/types/portfolio';
import { RISK_PROFILES } from '@/app/lib/mpt';

interface RiskStrategySelectorProps {
  selectedStrategy: RiskStrategy;
  onChange: (strategy: RiskStrategy) => void;
}

/**
 * RiskStrategySelector component allows users to select their risk profile
 */
export default function RiskStrategySelector({ 
  selectedStrategy, 
  onChange 
}: RiskStrategySelectorProps) {
  const strategies: RiskStrategy[] = ['conservative', 'balanced', 'aggressive'];
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Select Risk Strategy</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {strategies.map((strategy) => {
          const profile = RISK_PROFILES[strategy];
          const isSelected = selectedStrategy === strategy;
          
          return (
            <div 
              key={strategy}
              onClick={() => onChange(strategy)}
              className={`
                cursor-pointer p-4 rounded-lg border-2 transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }
              `}
            >
              <div className="flex items-center mb-2">
                <div 
                  className={`w-3 h-3 rounded-full mr-2 ${
                    strategy === 'conservative' ? 'bg-green-500' : 
                    strategy === 'balanced' ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`} 
                />
                <h4 className="font-medium capitalize">{profile.name}</h4>
              </div>
              <p className="text-sm text-gray-600">{profile.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                <div>Target Volatility: {(profile.targetVolatility * 100).toFixed(0)}%</div>
                <div className="mt-1">
                  Default Ratio: {(profile.defaultRatio.btc * 100).toFixed(0)}% BTC / {(profile.defaultRatio.eth * 100).toFixed(0)}% ETH
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 