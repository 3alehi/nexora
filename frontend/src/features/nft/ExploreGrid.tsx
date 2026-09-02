"use client";

import { ImageOff } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { NFTCardSkeleton } from "@/components/ui/Skeleton";
import { useNfts } from "@/features/marketplace/useNfts";
import { NFTCard } from "@/features/nft/NFTCard";

type SortOption = "newest" | "oldest";

const sortLabels: Record<SortOption, string> = {
  newest: "Recently Listed",
  oldest: "Oldest First",
};

export function ExploreGrid() {
  const [sort, setSort] = useState<SortOption>("newest");
  const { data, isLoading } = useNfts({ limit: 24, sort });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-muted">
          {isLoading ? "Loading..." : `${data?.pagination.total ?? 0} items`}
        </span>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortOption)}
          className="h-9 rounded-full border border-border bg-surface px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {Object.entries(sortLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <NFTCardSkeleton key={i} />
          ))}
        </div>
      ) : !data?.items.length ? (
        <EmptyState
          icon={ImageOff}
          title="No NFTs found"
          description="Once creators mint NFTs on Nexora, they'll show up here."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data.items.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
}
