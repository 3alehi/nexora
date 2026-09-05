import { Router } from "express";
import { create, getById, getBySlug, list } from "../controllers/collection.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { writeRateLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  collectionIdParamSchema,
  createCollectionSchema,
  listCollectionsQuerySchema,
} from "../validators/collection.validators.js";

export const collectionsRouter = Router();

collectionsRouter.get("/", validate(listCollectionsQuerySchema, "query"), asyncHandler(list));
collectionsRouter.get("/by-id/:id", validate(collectionIdParamSchema, "params"), asyncHandler(getById));
collectionsRouter.get("/:slug", asyncHandler(getBySlug));
collectionsRouter.post(
  "/",
  requireAuth,
  writeRateLimiter,
  validate(createCollectionSchema),
  asyncHandler(create)
);
