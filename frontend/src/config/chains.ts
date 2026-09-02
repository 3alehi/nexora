import { sepolia, mainnet, polygon, base, arbitrum } from "wagmi/chains";
import type { Chain } from "viem";

const NETWORK_CHAINS: Record<string, Chain> = {
  sepolia,
  mainnet,
  polygon,
  base,
  arbitrum,
};

const activeNetworkName = process.env.NEXT_PUBLIC_NETWORK ?? "sepolia";

export const activeChain: Chain = NETWORK_CHAINS[activeNetworkName] ?? sepolia;
