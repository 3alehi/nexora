import { supabaseAdmin } from "../integrations/supabase/client.js";
import type { Nft } from "../types/nft.js";
import type { CreateNftInput, ListNftsQuery } from "../validators/nft.validators.js";

export async function listNfts(query: ListNftsQuery): Promise<{ items: Nft[]; total: number }> {
  const from = (query.page - 1) * query.limit;
  const to = from + query.limit - 1;

  let builder = supabaseAdmin.from("nfts").select("*", { count: "exact" });

  if (query.collectionId) {
    builder = builder.eq("collection_id", query.collectionId);
  }

  builder = builder.order("created_at", { ascending: query.sort === "oldest" }).range(from, to);

  const { data, error, count } = await builder;

  if (error) throw error;
  return { items: (data ?? []) as Nft[], total: count ?? 0 };
}

export async function getNftById(id: string): Promise<Nft | null> {
  const { data, error } = await supabaseAdmin.from("nfts").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return data as Nft | null;
}

export async function createNft(creatorId: string, input: CreateNftInput): Promise<Nft> {
  const { data, error } = await supabaseAdmin
    .from("nfts")
    .insert({
      creator_id: creatorId,
      collection_id: input.collectionId ?? null,
      name: input.name,
      description: input.description ?? null,
      image_url: input.imageUrl,
      animation_url: input.animationUrl ?? null,
      chain: input.chain,
      standard: input.standard,
      status: "draft",
    })
    .select()
    .single();

  if (error) throw error;
  return data as Nft;
}
