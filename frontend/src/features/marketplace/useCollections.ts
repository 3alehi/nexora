import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useCollections(params?: {
  page?: number;
  limit?: number;
  search?: string;
  verified?: boolean;
  chain?: string;
  sort?: "newest" | "oldest" | "floor_price" | "volume" | "name";
}) {
  return useQuery({
    queryKey: ["collections", params],
    queryFn: () => api.collections.list(params),
  });
}
