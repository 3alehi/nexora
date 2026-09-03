import { env } from "./env.js";

export type NetworkName = "sepolia" | "mainnet" | "polygon" | "base" | "arbitrum";

interface NetworkConfig {
  name: NetworkName;
  chainId: number;
}

const NETWORKS: Record<NetworkName, NetworkConfig> = {
  sepolia: { name: "sepolia", chainId: 11155111 },
  mainnet: { name: "mainnet", chainId: 1 },
  polygon: { name: "polygon", chainId: 137 },
  base: { name: "base", chainId: 8453 },
  arbitrum: { name: "arbitrum", chainId: 42161 },
};

export function getActiveNetwork(): NetworkConfig {
  const network = NETWORKS[env.network as NetworkName];
  if (!network) {
    throw new Error(`Unknown NETWORK "${env.network}". Valid options: ${Object.keys(NETWORKS).join(", ")}`);
  }
  return network;
}
