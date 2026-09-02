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
