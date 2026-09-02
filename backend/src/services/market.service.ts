import { CACHE_TTL_MS } from "../config/cache.js";
import { fetchCryptoPrices, type CoinPrice } from "../integrations/coingecko/client.js";
import { TtlCache } from "../utils/ttlCache.js";

const priceCache = new TtlCache<CoinPrice[]>(CACHE_TTL_MS.cryptoPrices);

export async function getCryptoPrices(): Promise<CoinPrice[]> {
  const cached = priceCache.get();
  if (cached) {
    return cached;
  }

  const prices = await fetchCryptoPrices();
  priceCache.set(prices);
  return prices;
}
