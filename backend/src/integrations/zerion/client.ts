import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

export interface ZerionNft {
  contractAddress: string;
  tokenId: string;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  collectionName: string | null;
  tokenType: string | null;
}

export interface ZerionResult<T> {
  available: boolean;
  data: T | null;
}

interface ZerionNftPosition {
  attributes: {
    nft_info: {
      contract_address: string;
      token_id: string;
      name?: string | null;
      interface?: string | null;
      content?: {
        preview?: { url?: string | null } | null;
        detail?: { url?: string | null } | null;
      } | null;
    };
    collection_info?: {
      name?: string | null;
      description?: string | null;
    } | null;
  };
}

interface ZerionNftPositionsResponse {
  data: ZerionNftPosition[];
}

const BASE_URL = "https://api.zerion.io/v1";

export async function getNftsForOwner(ownerAddress: string): Promise<ZerionResult<ZerionNft[]>> {
  if (!env.zerionApiKey) {
    return { available: false, data: null };
  }

  const url = `${BASE_URL}/wallets/${encodeURIComponent(ownerAddress)}/nft-positions/?currency=usd&page[size]=100`;
  const authHeader = `Basic ${Buffer.from(`${env.zerionApiKey}:`).toString("base64")}`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        authorization: authHeader,
      },
    });

    if (!response.ok) {
      logger.warn("Zerion request failed, falling back to database-only data", {
        status: response.status,
      });
      return { available: false, data: null };
    }

    const body = (await response.json()) as ZerionNftPositionsResponse;

    const nfts = body.data.map((position) => {
      const { nft_info, collection_info } = position.attributes;
      return {
        contractAddress: nft_info.contract_address,
        tokenId: nft_info.token_id,
        name: nft_info.name ?? null,
        description: collection_info?.description ?? null,
        imageUrl: nft_info.content?.preview?.url ?? nft_info.content?.detail?.url ?? null,
        collectionName: collection_info?.name ?? null,
        tokenType: nft_info.interface ?? null,
      };
    });

    return { available: true, data: nfts };
  } catch (error) {
    logger.warn("Zerion request threw an error, falling back to database-only data", {
      message: error instanceof Error ? error.message : String(error),
    });
    return { available: false, data: null };
  }
}
