# SmartFolio Portfolio Rebalancer: How It Works

## Overview

The SmartFolio Portfolio Rebalancer implements Modern Portfolio Theory (MPT) to help users optimize their cryptocurrency portfolios. This document explains the theoretical foundation and implementation details of the rebalancing algorithms.

## Modern Portfolio Theory (MPT)

### Core Concepts

Modern Portfolio Theory, developed by Harry Markowitz in the 1950s, is a mathematical framework for constructing portfolios that maximize expected return for a given level of risk. The key insights of MPT are:

1. **Diversification**: Combining assets with different risk profiles can reduce overall portfolio risk
2. **Efficient Frontier**: The set of optimal portfolios that offer the highest expected return for a defined level of risk
3. **Risk-Return Tradeoff**: Higher expected returns generally require taking on higher risk

### Key Metrics Used in SmartFolio

- **Expected Return**: Estimated future return of an asset based on historical performance
- **Volatility (Standard Deviation)**: Measures how much an asset's returns vary over time
- **Covariance/Correlation**: Measures how assets move in relation to each other
- **Sharpe Ratio**: (Expected Return - Risk-Free Rate) / Volatility
- **Sortino Ratio**: Similar to Sharpe, but only considers downside volatility

## Implementation in SmartFolio

### Risk Profiles

SmartFolio offers three risk strategies:

1. **Conservative (90/10)**: 90% BTC, 10% ETH - Lower volatility, moderate returns
2. **Balanced (70/30)**: 70% BTC, 30% ETH - Moderate volatility and returns
3. **Aggressive (20/80)**: 20% BTC, 80% ETH - Higher volatility, higher potential returns

### Calculation Process

1. **Market Data Collection**:
   - Historical price data for BTC and ETH is retrieved
   - Daily returns are calculated
   - Volatility (standard deviation) is computed for each asset
   - Covariance between assets is determined

2. **Portfolio Matrix Generation**:
   - Multiple portfolio allocations are simulated (from 0/100 to 100/0)
   - For each allocation, the following metrics are calculated:
     - Portfolio expected return (weighted average of individual asset returns)
     - Portfolio volatility (using variance-covariance formula)
     - Sharpe ratio
     - Sortino ratio

3. **Optimal Allocation Determination**:
   - Based on user's selected risk profile, an optimal allocation is selected
   - Conservative strategy prioritizes lower volatility
   - Balanced strategy seeks moderate risk-return balance
   - Aggressive strategy aims for higher returns with higher risk tolerance

### Mathematical Formulas

#### Portfolio Expected Return
```
E(Rp) = w1 * E(R1) + w2 * E(R2)
```
Where:
- E(Rp) = Expected return of portfolio
- w1, w2 = Weights of assets 1 and 2
- E(R1), E(R2) = Expected returns of assets 1 and 2

#### Portfolio Variance
```
σp² = w1² * σ1² + w2² * σ2² + 2 * w1 * w2 * σ1 * σ2 * ρ12
```
Where:
- σp² = Portfolio variance
- w1, w2 = Weights of assets 1 and 2
- σ1², σ2² = Variances of assets 1 and 2
- ρ12 = Correlation coefficient between assets 1 and 2

#### Sharpe Ratio
```
Sharpe Ratio = (E(Rp) - Rf) / σp
```
Where:
- E(Rp) = Expected portfolio return
- Rf = Risk-free rate
- σp = Portfolio standard deviation (volatility)

## Rebalancing Algorithm

1. **Current Portfolio Assessment**:
   - User's wallet balances are fetched (ETH directly via wagmi, BTC via API)
   - Current value of each asset is calculated using latest market prices
   - Current portfolio allocation percentages are determined

2. **Target Allocation Determination**:
   - Based on the selected risk strategy, a target allocation is identified
   - The difference between current and target allocations is calculated

3. **Transaction Plan Generation**:
   - The algorithm determines which assets to buy/sell to achieve target allocation
   - Transaction sizes are calculated to minimize the number of trades while reaching the target
   - Transaction costs and slippage are considered

4. **Execution Preview**:
   - Before execution, a preview of the required transactions is presented
   - User can confirm or reject the rebalancing plan

## Real-time Portfolio Monitoring

The system continuously monitors:
- Asset price changes
- Portfolio drift from target allocation
- New market data for recalculating optimal allocations

When the portfolio drifts beyond a certain threshold (e.g., 5% from target allocation), the system suggests rebalancing.

## Limitations and Considerations

- **Historical Performance Disclaimer**: Past performance is not indicative of future results
- **Market Conditions**: MPT assumes normal market conditions; extreme events may produce unexpected outcomes
- **Rebalancing Costs**: Transaction fees and potential tax implications should be considered
- **Timeframe Sensitivity**: Different historical timeframes may yield different optimal allocations

## Future Enhancements

- Multi-asset portfolio optimization beyond BTC and ETH
- Dynamic risk profiling based on market conditions
- Machine learning algorithms to enhance return predictions
- Tax-efficient rebalancing strategies 
