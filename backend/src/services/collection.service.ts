import * as collectionRepository from "../repositories/collection.repository.js";
import { ApiError } from "../utils/ApiError.js";
import type { CreateCollectionInput, ListCollectionsQuery } from "../validators/collection.validators.js";

export async function listCollections(query: ListCollectionsQuery) {
  return collectionRepository.listCollections(query);
}

export async function getCollection(slug: string) {
  const collection = await collectionRepository.getCollectionBySlug(slug);
  if (!collection) {
    throw ApiError.notFound("Collection not found");
  }
  return collection;
}

export async function getCollectionById(id: string) {
  const collection = await collectionRepository.getCollectionById(id);
  if (!collection) {
    throw ApiError.notFound("Collection not found");
  }
  return collection;
}

export async function createCollection(creatorId: string, input: CreateCollectionInput) {
  const taken = await collectionRepository.isSlugTaken(input.slug);
  if (taken) {
    throw ApiError.conflict("Collection slug is already taken", "SLUG_TAKEN");
  }
  return collectionRepository.createCollection(creatorId, input);
}
