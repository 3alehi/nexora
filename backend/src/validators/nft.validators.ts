import { z } from "zod";

export const createNftSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().url(),
  animationUrl: z.string().url().optional(),
  collectionId: z.string().uuid().optional(),
  chain: z.string().min(1).default("sepolia"),
  standard: z.enum(["ERC721", "ERC1155"]).default("ERC721"),
});

export const nftIdParamSchema = z.object({
  id: z.uuid("Invalid NFT id"),
});

export const listNftsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  collectionId: z.string().uuid().optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  status: z.enum(["draft", "minted", "listed", "sold"]).optional(),
  chain: z.string().min(1).optional(),
  standard: z.enum(["ERC721", "ERC1155"]).optional(),
  search: z.string().min(1).max(100).optional(),
});

export type CreateNftInput = z.infer<typeof createNftSchema>;
export type ListNftsQuery = z.infer<typeof listNftsQuerySchema>;
