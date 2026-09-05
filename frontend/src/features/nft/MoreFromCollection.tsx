"use client";

import { NFTCardSkeleton } from "@/components/ui/Skeleton";
import { useNfts } from "@/features/marketplace/useNfts";
import { NFTCard } from "@/features/nft/NFTCard";

export function MoreFromCollection({ collectionId, excludeId }: { collectionId: string; excludeId: string }) {
  const { data, isLoading } = useNfts({ collectionId, limit: 12 });
  const items = data?.items.filter((nft) => nft.id !== excludeId) ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <NFTCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.slice(0, 6).map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </div>
  );
}
