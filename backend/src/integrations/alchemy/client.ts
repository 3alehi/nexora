import { env } from "../../config/env.js";
import { getActiveNetwork } from "../../config/network.js";
import { logger } from "../../utils/logger.js";

export interface AlchemyNft {
  contractAddress: string;
  tokenId: string;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  collectionName: string | null;
  tokenType: string | null;
}

export interface AlchemyResult<T> {
  available: boolean;
  data: T | null;
}

interface AlchemyGetNftsForOwnerResponse {
  ownedNfts: Array<{
    contract: { address: string; name?: string | null };
    tokenId: string;
    tokenType?: string;
    name?: string | null;
    description?: string | null;
    image?: { cachedUrl?: string | null; originalUrl?: string | null };
  }>;
  pageKey?: string;
  totalCount: number;
}

function getBaseUrl(): string {
  const network = getActiveNetwork();
  return `https://${network.alchemySubdomain}.g.alchemy.com/nft/v3/${env.alchemyApiKey}`;
}

async function safeGet<T>(path: string): Promise<AlchemyResult<T>> {
  if (!env.alchemyApiKey) {
    return { available: false, data: null };
  }

  try {
    const response = await fetch(`${getBaseUrl()}${path}`, {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      logger.warn("Alchemy request failed, falling back to database-only data", {
        status: response.status,
        path,
      });
      return { available: false, data: null };
    }

    const data = (await response.json()) as T;
    return { available: true, data };
  } catch (error) {
    logger.warn("Alchemy request threw an error, falling back to database-only data", {
      path,
      message: error instanceof Error ? error.message : String(error),
    });
    return { available: false, data: null };
  }
}

export async function getNftsForOwner(ownerAddress: string): Promise<AlchemyResult<AlchemyNft[]>> {
  const result = await safeGet<AlchemyGetNftsForOwnerResponse>(
    `/getNFTsForOwner?owner=${encodeURIComponent(ownerAddress)}&withMetadata=true`
  );

  if (!result.available || !result.data) {
    return { available: false, data: null };
  }

  const nfts = result.data.ownedNfts.map((nft) => ({
    contractAddress: nft.contract.address,
    tokenId: nft.tokenId,
    name: nft.name ?? null,
    description: nft.description ?? null,
    imageUrl: nft.image?.cachedUrl ?? nft.image?.originalUrl ?? null,
    collectionName: nft.contract.name ?? null,
    tokenType: nft.tokenType ?? null,
  }));

  return { available: true, data: nfts };
}

export async function getNftMetadata(contractAddress: string, tokenId: string): Promise<AlchemyResult<unknown>> {
  return safeGet(
    `/getNFTMetadata?contractAddress=${encodeURIComponent(contractAddress)}&tokenId=${encodeURIComponent(tokenId)}`
  );
}

export async function getContractMetadata(contractAddress: string): Promise<AlchemyResult<unknown>> {
  return safeGet(`/getContractMetadata?contractAddress=${encodeURIComponent(contractAddress)}`);
}
