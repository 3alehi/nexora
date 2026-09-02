import type { Request, Response } from "express";
import * as nftService from "../services/nft.service.js";
import { sendSuccess } from "../utils/response.js";
import type { CreateNftInput, ListNftsQuery } from "../validators/nft.validators.js";

export async function list(req: Request, res: Response) {
  const query = req.query as unknown as ListNftsQuery;
  const result = await nftService.listNfts(query);
  sendSuccess(res, {
    items: result.items,
    pagination: { page: query.page, limit: query.limit, total: result.total },
  });
}

export async function getById(req: Request, res: Response) {
  const nft = await nftService.getNft(req.params.id);
  sendSuccess(res, nft);
}

export async function create(req: Request, res: Response) {
  const nft = await nftService.createNft(req.user!.id, req.body as CreateNftInput);
  sendSuccess(res, nft, 201);
}
