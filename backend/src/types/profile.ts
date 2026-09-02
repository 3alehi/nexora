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
