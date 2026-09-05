import { CACHE_TTL_MS } from "../config/cache.js";
import { fetchCryptoPrices, type CoinPrice } from "../integrations/coingecko/client.js";
import { getMarketStats as getMarketStatsFromDb, type MarketStats } from "../repositories/stats.repository.js";
import { TtlCache } from "../utils/ttlCache.js";

const priceCache = new TtlCache<CoinPrice[]>(CACHE_TTL_MS.cryptoPrices);
const statsCache = new TtlCache<MarketStats>(CACHE_TTL_MS.trending);

export async function getCryptoPrices(): Promise<CoinPrice[]> {
  const cached = priceCache.get();
  if (cached) {
    return cached;
  }

  const prices = await fetchCryptoPrices();
  priceCache.set(prices);
  return prices;
}

export async function getMarketStats(): Promise<MarketStats> {
  const cached = statsCache.get();
  if (cached) {
    return cached;
  }

  const stats = await getMarketStatsFromDb();
  statsCache.set(stats);
  return stats;
}
