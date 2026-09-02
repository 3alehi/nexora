import { getActiveNetwork } from "../config/network.js";
import { CACHE_TTL_MS } from "../config/cache.js";
import { getNftsForOwner, type AlchemyNft } from "../integrations/alchemy/client.js";
import { ApiError } from "../utils/ApiError.js";
import { KeyedTtlCache } from "../utils/ttlCache.js";

interface WalletNftsResult {
  chain: string;
  address: string;
  nfts: AlchemyNft[];
}

const walletNftsCache = new KeyedTtlCache<WalletNftsResult>(CACHE_TTL_MS.walletNfts);

export async function getOnChainNftsForWallet(address: string): Promise<WalletNftsResult> {
  const normalizedAddress = address.toLowerCase();

  const cached = walletNftsCache.get(normalizedAddress);
  if (cached) {
    return cached;
  }

  const result = await getNftsForOwner(address);

  if (!result.available) {
    throw ApiError.internal(
      "On-chain NFT data is temporarily unavailable. Try again later.",
      "ALCHEMY_UNAVAILABLE"
    );
  }

  const payload: WalletNftsResult = {
    chain: getActiveNetwork().name,
    address,
    nfts: result.data ?? [],
  };

  walletNftsCache.set(normalizedAddress, payload);
  return payload;
}
