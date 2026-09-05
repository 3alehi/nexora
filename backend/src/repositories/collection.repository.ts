import { supabaseAdmin } from "../integrations/supabase/client.js";
import type { Collection } from "../types/collection.js";
import type { CreateCollectionInput, ListCollectionsQuery } from "../validators/collection.validators.js";

export async function listCollections(query: ListCollectionsQuery): Promise<{ items: Collection[]; total: number }> {
  const from = (query.page - 1) * query.limit;
  const to = from + query.limit - 1;

  let builder = supabaseAdmin.from("collections").select("*", { count: "exact" });

  if (query.search) {
    builder = builder.ilike("name", `%${query.search}%`);
  }
  if (query.verified !== undefined) {
    builder = builder.eq("verified", query.verified);
  }
  if (query.chain) {
    builder = builder.eq("chain", query.chain);
  }

  const sortColumn: Record<typeof query.sort, string> = {
    newest: "created_at",
    oldest: "created_at",
    floor_price: "floor_price",
    volume: "volume",
    name: "name",
  };
  builder = builder
    .order(sortColumn[query.sort], { ascending: query.sort === "oldest" || query.sort === "name" })
    .range(from, to);

  const { data, error, count } = await builder;

  if (error) throw error;
  return { items: (data ?? []) as Collection[], total: count ?? 0 };
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const { data, error } = await supabaseAdmin.from("collections").select("*").eq("slug", slug).maybeSingle();

  if (error) throw error;
  return data as Collection | null;
}

export async function getCollectionById(id: string): Promise<Collection | null> {
  const { data, error } = await supabaseAdmin.from("collections").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return data as Collection | null;
}

export async function isSlugTaken(slug: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin.from("collections").select("id").eq("slug", slug).maybeSingle();

  if (error) throw error;
  return data !== null;
}

export async function createCollection(creatorId: string, input: CreateCollectionInput): Promise<Collection> {
  const { data, error } = await supabaseAdmin
    .from("collections")
    .insert({
      creator_id: creatorId,
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      logo_url: input.logoUrl ?? null,
      banner_url: input.bannerUrl ?? null,
      contract_address: input.contractAddress ?? null,
      chain: input.chain,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Collection;
}
