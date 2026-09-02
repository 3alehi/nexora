import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useNfts(params?: {
  page?: number;
  limit?: number;
  collectionId?: string;
  sort?: "newest" | "oldest";
}) {
  return useQuery({
    queryKey: ["nfts", params],
    queryFn: () => api.nfts.list(params),
  });
}
