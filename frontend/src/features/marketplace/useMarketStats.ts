import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useMarketStats() {
  return useQuery({
    queryKey: ["market", "stats"],
    queryFn: () => api.market.getStats(),
  });
}
