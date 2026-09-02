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

**External APIs**: Alchemy NFT API, CoinGecko

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your own Supabase/Alchemy/CoinGecko keys
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

- The provided Alchemy API key currently returns HTTP 403 on both mainnet and Sepolia JSON-RPC/NFT API calls. This looks like a dashboard-side network/security restriction on the Alchemy app, not a code issue. The Alchemy integration (`backend/src/integrations/alchemy/`) is built to fail gracefully — NFT/collection data falls back to database-only records until this is resolved.
