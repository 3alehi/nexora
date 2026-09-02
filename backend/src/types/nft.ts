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
