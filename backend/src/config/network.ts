import { env } from "./env.js";

export type NetworkName = "sepolia" | "mainnet" | "polygon" | "base" | "arbitrum";

interface NetworkConfig {
  name: NetworkName;
  chainId: number;
  alchemySubdomain: string;
}

const NETWORKS: Record<NetworkName, NetworkConfig> = {
  sepolia: { name: "sepolia", chainId: 11155111, alchemySubdomain: "eth-sepolia" },
  mainnet: { name: "mainnet", chainId: 1, alchemySubdomain: "eth-mainnet" },
  polygon: { name: "polygon", chainId: 137, alchemySubdomain: "polygon-mainnet" },
  base: { name: "base", chainId: 8453, alchemySubdomain: "base-mainnet" },
  arbitrum: { name: "arbitrum", chainId: 42161, alchemySubdomain: "arb-mainnet" },
};

export function getActiveNetwork(): NetworkConfig {
  const network = NETWORKS[env.network as NetworkName];
  if (!network) {
    throw new Error(`Unknown NETWORK "${env.network}". Valid options: ${Object.keys(NETWORKS).join(", ")}`);
  }
  return network;
}
