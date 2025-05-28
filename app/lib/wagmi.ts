import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, base, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Smartfolio',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet, base, baseSepolia],
  ssr: true,
});
