import type { Request, Response } from "express";
import { getCryptoPrices, getMarketStats } from "../services/market.service.js";
import { sendSuccess } from "../utils/response.js";

export async function getCrypto(_req: Request, res: Response) {
  const prices = await getCryptoPrices();
  sendSuccess(res, prices);
}

export async function getStats(_req: Request, res: Response) {
  const stats = await getMarketStats();
  sendSuccess(res, stats);
}
