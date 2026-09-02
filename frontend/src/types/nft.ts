export type NftStatus = "draft" | "minted" | "listed" | "sold";

export interface Nft {
  id: string;
  creator_id: string;
  collection_id: string | null;
  name: string;
  description: string | null;
  image_url: string;
  animation_url: string | null;
  contract_address: string | null;
  token_id: string | null;
  chain: string;
  standard: "ERC721" | "ERC1155";
  metadata_uri: string | null;
  owner_address: string | null;
  status: NftStatus;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  creator_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  contract_address: string | null;
  chain: string;
  verified: boolean;
  floor_price: number | null;
  volume: number | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  username: string;
  username_normalized: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  wallet_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface OnChainNft {
  contractAddress: string;
  tokenId: string;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  collectionName: string | null;
  tokenType: string | null;
}

export type TrackedSymbol = "ETH" | "BTC" | "SOL" | "USDT" | "USDC";

export interface CoinPrice {
  symbol: TrackedSymbol;
  usd: number;
  usd24hChange: number;
  usdMarketCap: number;
  usd24hVol: number;
}
