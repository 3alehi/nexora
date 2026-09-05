"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { useMarketStats } from "@/features/marketplace/useMarketStats";

export function StatsStrip() {
  const { data: stats, isLoading } = useMarketStats();

  const items: { label: string; value: string }[] = stats
    ? [
        { label: "NFTs", value: stats.totalNfts.toLocaleString() },
        { label: "Collections", value: stats.totalCollections.toLocaleString() },
        { label: "Listed Now", value: stats.listedCount.toLocaleString() },
        { label: "Total Volume", value: `${stats.totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })} ETH` },
      ]
    : [];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="mt-2 h-3 w-20" />
            </div>
          ))
        : items.map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-surface p-4">
              <span className="block text-xl font-bold text-foreground">{item.value}</span>
              <span className="text-xs text-muted">{item.label}</span>
            </div>
          ))}
    </div>
  );
}
