# Nexora

A production-grade NFT marketplace and Web3 discovery platform.

## Status

Under active development. See commit history for progress — features are built and committed incrementally, not all at once.

## Architecture

- `backend/` — Node.js + TypeScript + Express REST API (services/repositories/controllers architecture)
- `frontend/` — Next.js 15 + TypeScript + App Router + Tailwind CSS

## Tech Stack

**Frontend**: Next.js, TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod, wagmi/viem, Lucide React

**Backend**: Node.js, Express, TypeScript, Zod validation, Supabase (Postgres + Auth)

**Web3**: wagmi, viem, WalletConnect, Sepolia testnet (network is configurable)

**External APIs**: Zerion NFT API, CoinGecko

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your own Supabase/Zerion/CoinGecko keys
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # fill in your own values
npm run dev
```

### Database

The Supabase schema lives in `backend/supabase/migrations/`. Apply it via the Supabase SQL editor or:

```bash
npx supabase db push --db-url "<your-pooler-connection-string>"
```

Note: use the **pooler** connection string (not the direct `db.<ref>.supabase.co` host) if your network doesn't support IPv6 — the direct host is IPv6-only on new Supabase projects.

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for the full list. Never commit `.env` files.

## Known Issues

- Alchemy was replaced with Zerion (`backend/src/integrations/zerion/`) as the wallet on-chain NFT provider, since Alchemy's NFT API was returning HTTP 403 in some regions. Set `ZERION_API_KEY` in `backend/.env` (free developer key at https://zerion.io/api) to enable it. Without a key, the integration fails gracefully — NFT/collection data falls back to database-only records.
