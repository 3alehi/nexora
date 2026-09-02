import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

const COIN_IDS = {
  ETH: "ethereum",
  BTC: "bitcoin",
  SOL: "solana",
  USDT: "tether",
  USDC: "usd-coin",
} as const;

export type TrackedSymbol = keyof typeof COIN_IDS;

export interface CoinPrice {
  symbol: TrackedSymbol;
  usd: number;
  usd24hChange: number;
  usdMarketCap: number;
  usd24hVol: number;
}

interface CoinGeckoMarketResponse {
  [coinId: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
    usd_24h_vol: number;
  };
}

export async function fetchCryptoPrices(): Promise<CoinPrice[]> {
  const ids = Object.values(COIN_IDS).join(",");
  const url = new URL(`${env.coingeckoApiUrl}/simple/price`);
  url.searchParams.set("ids", ids);
  url.searchParams.set("vs_currencies", "usd");
  url.searchParams.set("include_24hr_change", "true");
  url.searchParams.set("include_market_cap", "true");
  url.searchParams.set("include_24hr_vol", "true");
  if (env.coingeckoApiKey) {
    url.searchParams.set("x_cg_demo_api_key", env.coingeckoApiKey);
  }

  const response = await fetch(url, { headers: { accept: "application/json" } });

  if (!response.ok) {
    logger.warn("CoinGecko request failed", { status: response.status });
    throw new Error(`CoinGecko responded with status ${response.status}`);
  }

  const body = (await response.json()) as CoinGeckoMarketResponse;

  return (Object.entries(COIN_IDS) as [TrackedSymbol, string][]).map(([symbol, coinId]) => {
    const entry = body[coinId];
    return {
      symbol,
      usd: entry?.usd ?? 0,
      usd24hChange: entry?.usd_24h_change ?? 0,
      usdMarketCap: entry?.usd_market_cap ?? 0,
      usd24hVol: entry?.usd_24h_vol ?? 0,
    };
  });
}
