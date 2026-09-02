import { apiRequest } from "@/services/apiClient";
import type { Paginated } from "@/types/api";
import type { CoinPrice, Collection, Nft, OnChainNft, Profile } from "@/types/nft";

export const api = {
  nfts: {
    list: (params?: { page?: number; limit?: number; collectionId?: string; sort?: "newest" | "oldest" }) =>
      apiRequest<Paginated<Nft>>("/nfts", { searchParams: params }),
    getById: (id: string) => apiRequest<Nft>(`/nfts/${id}`),
    create: (input: { name: string; description?: string; imageUrl: string }) =>
      apiRequest<Nft>("/nfts", { method: "POST", body: input }),
  },
  collections: {
    list: (params?: { page?: number; limit?: number }) =>
      apiRequest<Paginated<Collection>>("/collections", { searchParams: params }),
    getBySlug: (slug: string) => apiRequest<Collection>(`/collections/${slug}`),
  },
  users: {
    getByUsername: (username: string) => apiRequest<Profile>(`/users/${username}`),
  },
  market: {
    getPrices: () => apiRequest<CoinPrice[]>("/market/crypto"),
  },
  wallet: {
    getNfts: (address: string) =>
      apiRequest<{ chain: string; address: string; nfts: OnChainNft[] }>(`/wallet/${address}/nfts`),
  },
};
