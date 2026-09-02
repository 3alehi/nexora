import type { Request, Response } from "express";
import { getCryptoPrices } from "../services/market.service.js";
import { sendSuccess } from "../utils/response.js";

export async function getCrypto(_req: Request, res: Response) {
  const prices = await getCryptoPrices();
  sendSuccess(res, prices);
}
