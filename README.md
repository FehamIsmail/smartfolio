# SmartFolio

SmartFolio is a DeFi portfolio management application that uses Modern Portfolio Theory to optimize crypto asset allocation. The app currently supports BTC and ETH portfolio rebalancing based on risk preferences.

## Features

### AgentKit AI Chat
- Interact with a powerful AI agent that can analyze your wallet, provide insights, and execute transactions
- Connect your wallet to get personalized recommendations
- Get real-time market data and portfolio analytics

### Portfolio Rebalancer
- Optimize your BTC/ETH portfolio allocation using Modern Portfolio Theory
- Choose from different risk strategies:
  - **Conservative**: Lower volatility, stable returns
  - **Balanced**: Moderate risk/reward balance
  - **Aggressive**: Higher potential returns with higher volatility
- View detailed portfolio analytics:
  - Expected returns
  - Expected risk (volatility)
  - Sharpe Ratio
  - Asset correlation
- Preview and execute portfolio rebalancing transactions

## Documentation

For more detailed information about SmartFolio:

- [**Demo**](./DEMO.md) - Visual walkthrough of the application with screenshots
- [**How It Works**](./HOW-IT-WORKS.md) - Detailed explanation of the portfolio rebalancing algorithms and Modern Portfolio Theory implementation

## Modern Portfolio Theory

The portfolio rebalancer uses Modern Portfolio Theory (MPT) to find the optimal allocation between BTC and ETH. MPT is a mathematical framework for constructing an investment portfolio that aims to maximize expected return for a given level of risk.

Key concepts implemented:
- **Efficient Frontier**: The set of optimal portfolios that offer the highest expected return for a defined level of risk
- **Sharpe Ratio**: A measure of risk-adjusted return, calculated as (Expected Return - Risk Free Rate) / Volatility
- **Portfolio Variance**: Accounts for the correlation between assets to determine overall portfolio risk
- **Risk Profiles**: Different strategies that adjust optimization goals based on risk tolerance

## Getting Started

### Prerequisites
- Node.js v18+
- Yarn or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/smartfolio.git
cd smartfolio
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Connect your wallet using the "Connect" button
2. Switch between "Agent Chat" and "Portfolio Rebalancer" using the tabs
3. In the Portfolio Rebalancer:
   - Select your risk strategy
   - View your current portfolio allocation
   - Run MPT analysis to get optimal allocation recommendations
   - Preview the rebalance to see required transactions
   - Execute the rebalance to optimize your portfolio

## Technologies

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Blockchain**: AgentKit, Viem, Wagmi, RainbowKit
- **Data**: CoinGecko API for market data
- **MPT Implementation**: Custom TypeScript implementation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

