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
      <h3 className="text-lg font-medium mb-3 text-text-primary">Select Risk Strategy</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {strategies.map((strategy) => {
          const profile = RISK_PROFILES[strategy];
          const isSelected = selectedStrategy === strategy;
          
          return (
            <div 
              key={strategy}
              onClick={() => onChange(strategy)}
              className={`
                crypto-card cursor-pointer p-4 rounded-xl border transition-all duration-300
                ${isSelected 
                  ? 'border-primary glow' 
                  : 'border-white/10 hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-center mb-2">
                <div 
                  className={`w-3 h-3 rounded-full mr-2 ${
                    strategy === 'conservative' ? 'bg-green-400' : 
                    strategy === 'balanced' ? 'bg-accent' : 
                    'bg-red-400'
                  }`} 
                />
                <h4 className="font-medium capitalize text-text-primary">{profile.name}</h4>
              </div>
              <p className="text-sm text-text-secondary">{profile.description}</p>
              <div className="mt-3 text-xs text-text-secondary bg-background-start/50 p-2 rounded-lg">
                <div className="flex justify-between">
                  <span>Target Volatility:</span>
                  <span className="font-medium text-text-primary">{(profile.targetVolatility * 100).toFixed(0)}%</span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span>Default Ratio:</span>
                  <span className="font-medium text-text-primary">
                    {(profile.defaultRatio.btc * 100).toFixed(0)}% BTC / {(profile.defaultRatio.eth * 100).toFixed(0)}% ETH
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 