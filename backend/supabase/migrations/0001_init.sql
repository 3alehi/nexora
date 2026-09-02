-- Nexora Phase 1 schema: profiles, collections, nfts, favorites
-- Run this in the Supabase SQL editor (or via `supabase db push`) against the project.

create extension if not exists "pgcrypto";

-- =========================================================
-- profiles
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  username_normalized text not null,
  email text not null,
  display_name text,
  avatar_url text,
  bio text,
  wallet_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint username_length check (char_length(username) between 3 and 20),
  constraint username_format check (username ~ '^[a-zA-Z0-9_]+$'),
  constraint wallet_address_format check (
    wallet_address is null or wallet_address ~ '^0x[a-fA-F0-9]{40}$'
  )
);

create unique index if not exists profiles_username_normalized_key
  on public.profiles (username_normalized);

create unique index if not exists profiles_email_key
  on public.profiles (email);

-- Keep username_normalized in sync automatically, defense-in-depth
-- alongside the application-level normalization.
create or replace function public.normalize_username()
returns trigger as $$
begin
  new.username_normalized := lower(new.username);
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_normalize_username on public.profiles;
create trigger trg_normalize_username
  before insert or update on public.profiles
  for each row execute function public.normalize_username();

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- =========================================================
-- collections
-- =========================================================
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  logo_url text,
  banner_url text,
  contract_address text,
  chain text not null default 'sepolia',
  verified boolean not null default false,
  floor_price numeric(20, 8),
  volume numeric(20, 8),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint slug_format check (slug ~ '^[a-z0-9-]+$')
);

create unique index if not exists collections_slug_key on public.collections (slug);
create index if not exists collections_creator_id_idx on public.collections (creator_id);

alter table public.collections enable row level security;

create policy "Collections are viewable by everyone"
  on public.collections for select
  using (true);

create policy "Creators can insert their own collections"
  on public.collections for insert
  with check (auth.uid() = creator_id);

create policy "Creators can update their own collections"
  on public.collections for update
  using (auth.uid() = creator_id);

create policy "Creators can delete their own collections"
  on public.collections for delete
  using (auth.uid() = creator_id);

-- =========================================================
-- nfts
-- =========================================================
create table if not exists public.nfts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  collection_id uuid references public.collections(id) on delete set null,
  name text not null,
  description text,
  image_url text not null,
  animation_url text,
  contract_address text,
  token_id text,
  chain text not null default 'sepolia',
  standard text not null default 'ERC721' check (standard in ('ERC721', 'ERC1155')),
  metadata_uri text,
  owner_address text,
  status text not null default 'draft' check (status in ('draft', 'minted', 'listed', 'sold')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nfts_creator_id_idx on public.nfts (creator_id);
create index if not exists nfts_collection_id_idx on public.nfts (collection_id);
create index if not exists nfts_status_idx on public.nfts (status);

alter table public.nfts enable row level security;

create policy "NFTs are viewable by everyone"
  on public.nfts for select
  using (true);

create policy "Creators can insert their own nfts"
  on public.nfts for insert
  with check (auth.uid() = creator_id);

create policy "Creators can update their own nfts"
  on public.nfts for update
  using (auth.uid() = creator_id);

create policy "Creators can delete their own nfts"
  on public.nfts for delete
  using (auth.uid() = creator_id);

-- =========================================================
-- favorites (many-to-many, duplicate-proof)
-- =========================================================
create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  nft_id uuid not null references public.nfts(id) on delete cascade,
  created_at timestamptz not null default now(),

  primary key (user_id, nft_id)
);

alter table public.favorites enable row level security;

create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can add their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);
