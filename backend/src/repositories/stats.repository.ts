import { supabaseAdmin } from "../integrations/supabase/client.js";

export interface MarketStats {
  totalNfts: number;
  totalCollections: number;
  listedCount: number;
  soldCount: number;
  mintedCount: number;
  totalVolume: number;
}

async function countNftsByStatus(status: string): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from("nfts")
    .select("*", { count: "exact", head: true })
    .eq("status", status);

  if (error) throw error;
  return count ?? 0;
}

export async function getMarketStats(): Promise<MarketStats> {
  const [{ count: totalNfts, error: nftsError }, { count: totalCollections, error: collectionsError }, listedCount, soldCount, mintedCount, { data: volumeRows, error: volumeError }] =
    await Promise.all([
      supabaseAdmin.from("nfts").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("collections").select("*", { count: "exact", head: true }),
      countNftsByStatus("listed"),
      countNftsByStatus("sold"),
      countNftsByStatus("minted"),
      supabaseAdmin.from("collections").select("volume"),
    ]);

  if (nftsError) throw nftsError;
  if (collectionsError) throw collectionsError;
  if (volumeError) throw volumeError;

  const totalVolume = (volumeRows ?? []).reduce((sum, row) => sum + Number(row.volume ?? 0), 0);

  return {
    totalNfts: totalNfts ?? 0,
    totalCollections: totalCollections ?? 0,
    listedCount,
    soldCount,
    mintedCount,
    totalVolume,
  };
}
