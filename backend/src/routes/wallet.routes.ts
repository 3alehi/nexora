import { Router } from "express";
import { getWalletNfts } from "../controllers/wallet.controller.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { walletAddressParamSchema } from "../validators/wallet.validators.js";

export const walletRouter = Router();

walletRouter.get("/:address/nfts", validate(walletAddressParamSchema, "params"), asyncHandler(getWalletNfts));
