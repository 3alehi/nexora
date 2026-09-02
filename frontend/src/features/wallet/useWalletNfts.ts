import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { api } from "@/services/api";

export function useWalletNfts() {
  const { address, isConnected } = useAccount();

  return useQuery({
    queryKey: ["wallet", "nfts", address],
    queryFn: () => api.wallet.getNfts(address as string),
    enabled: isConnected && Boolean(address),
    retry: false,
    staleTime: 2 * 60_000,
  });
}
