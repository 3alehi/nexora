import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useCollections(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["collections", params],
    queryFn: () => api.collections.list(params),
  });
}
