import type { Request, Response } from "express";
import * as walletService from "../services/wallet.service.js";
import { sendSuccess } from "../utils/response.js";

export async function getWalletNfts(req: Request, res: Response) {
  const result = await walletService.getOnChainNftsForWallet(req.params.address);
  sendSuccess(res, result);
}
