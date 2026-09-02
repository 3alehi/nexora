"use client";

import { ImageOff } from "lucide-react";
import { NFTCard } from "@/features/nft/NFTCard";
import { useNfts } from "@/features/marketplace/useNfts";
import { NFTCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function TrendingNfts() {
  const { data, isLoading } = useNfts({ limit: 10, sort: "newest" });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <NFTCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <EmptyState
        icon={ImageOff}
        title="No NFTs yet"
        description="Once creators mint NFTs on Nexora, they'll show up here."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {data.items.map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </div>
  );
}
