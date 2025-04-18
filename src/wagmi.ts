import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  sepolia
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'c7398a5fa42dc0421aed8167e630fb1e',
  chains: [
    mainnet,
    sepolia,
  ],
  ssr: false,
});
