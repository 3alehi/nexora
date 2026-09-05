import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(1000).optional(),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  contractAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  chain: z.string().min(1).default("sepolia"),
});

export const collectionIdParamSchema = z.object({
  id: z.uuid("Invalid collection id"),
});

export const listCollectionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  search: z.string().min(1).max(100).optional(),
  verified: z.coerce.boolean().optional(),
  chain: z.string().min(1).optional(),
  sort: z.enum(["newest", "oldest", "floor_price", "volume", "name"]).default("newest"),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type ListCollectionsQuery = z.infer<typeof listCollectionsQuerySchema>;
