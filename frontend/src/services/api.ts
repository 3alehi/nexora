import { apiRequest } from "@/services/apiClient";
import type { Paginated } from "@/types/api";
import type { CoinPrice, Collection, MarketStats, Nft, NftStatus, OnChainNft, Profile } from "@/types/nft";

export const api = {
  nfts: {
    list: (params?: {
      page?: number;
      limit?: number;
      collectionId?: string;
      sort?: "newest" | "oldest";
      status?: NftStatus;
      chain?: string;
      standard?: "ERC721" | "ERC1155";
      search?: string;
    }) => apiRequest<Paginated<Nft>>("/nfts", { searchParams: params }),
    getById: (id: string) => apiRequest<Nft>(`/nfts/${id}`),
    create: (input: { name: string; description?: string; imageUrl: string }) =>
      apiRequest<Nft>("/nfts", { method: "POST", body: input }),
  },
  collections: {
    list: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      verified?: boolean;
      chain?: string;
      sort?: "newest" | "oldest" | "floor_price" | "volume" | "name";
    }) => apiRequest<Paginated<Collection>>("/collections", { searchParams: params }),
    getBySlug: (slug: string) => apiRequest<Collection>(`/collections/${slug}`),
    getById: (id: string) => apiRequest<Collection>(`/collections/by-id/${id}`),
  },
  users: {
    getByUsername: (username: string) => apiRequest<Profile>(`/users/${username}`),
  },
  market: {
    getPrices: () => apiRequest<CoinPrice[]>("/market/crypto"),
    getStats: () => apiRequest<MarketStats>("/market/stats"),
  },
  wallet: {
    getNfts: (address: string) =>
      apiRequest<{ chain: string; address: string; nfts: OnChainNft[] }>(`/wallet/${address}/nfts`),
  },
};
