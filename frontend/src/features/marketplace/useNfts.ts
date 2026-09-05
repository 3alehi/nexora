import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { NftStatus } from "@/types/nft";

export function useNfts(params?: {
  page?: number;
  limit?: number;
  collectionId?: string;
  sort?: "newest" | "oldest";
  status?: NftStatus;
  chain?: string;
  standard?: "ERC721" | "ERC1155";
  search?: string;
}) {
  return useQuery({
    queryKey: ["nfts", params],
    queryFn: () => api.nfts.list(params),
  });
}
