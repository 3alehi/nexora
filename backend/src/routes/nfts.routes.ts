import { Router } from "express";
import { create, getById, list } from "../controllers/nft.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { writeRateLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNftSchema, listNftsQuerySchema } from "../validators/nft.validators.js";

export const nftsRouter = Router();

nftsRouter.get("/", validate(listNftsQuerySchema, "query"), asyncHandler(list));
nftsRouter.get("/:id", asyncHandler(getById));
nftsRouter.post("/", requireAuth, writeRateLimiter, validate(createNftSchema), asyncHandler(create));
