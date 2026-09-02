import { Router } from "express";
import { getCrypto } from "../controllers/market.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const marketRouter = Router();

marketRouter.get("/crypto", asyncHandler(getCrypto));
