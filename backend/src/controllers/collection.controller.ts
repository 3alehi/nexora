import type { Request, Response } from "express";
import * as collectionService from "../services/collection.service.js";
import { sendSuccess } from "../utils/response.js";
import type { CreateCollectionInput, ListCollectionsQuery } from "../validators/collection.validators.js";

export async function list(req: Request, res: Response) {
  const query = req.query as unknown as ListCollectionsQuery;
  const result = await collectionService.listCollections(query);
  sendSuccess(res, {
    items: result.items,
    pagination: { page: query.page, limit: query.limit, total: result.total },
  });
}

export async function getBySlug(req: Request, res: Response) {
  const collection = await collectionService.getCollection(req.params.slug);
  sendSuccess(res, collection);
}

export async function create(req: Request, res: Response) {
  const collection = await collectionService.createCollection(req.user!.id, req.body as CreateCollectionInput);
  sendSuccess(res, collection, 201);
}
