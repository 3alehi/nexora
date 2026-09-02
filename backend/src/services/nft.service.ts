import * as nftRepository from "../repositories/nft.repository.js";
import { ApiError } from "../utils/ApiError.js";
import type { CreateNftInput, ListNftsQuery } from "../validators/nft.validators.js";

export async function listNfts(query: ListNftsQuery) {
  return nftRepository.listNfts(query);
}

export async function getNft(id: string) {
  const nft = await nftRepository.getNftById(id);
  if (!nft) {
    throw ApiError.notFound("NFT not found");
  }
  return nft;
}

export async function createNft(creatorId: string, input: CreateNftInput) {
  return nftRepository.createNft(creatorId, input);
}
