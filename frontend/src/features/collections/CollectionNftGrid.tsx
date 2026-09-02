"use client";

import { ImageOff } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { NFTCardSkeleton } from "@/components/ui/Skeleton";
import { useNfts } from "@/features/marketplace/useNfts";
import { NFTCard } from "@/features/nft/NFTCard";

export function CollectionNftGrid({ collectionId }: { collectionId: string }) {
  const { data, isLoading } = useNfts({ collectionId, limit: 24 });

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
      <EmptyState icon={ImageOff} title="No items yet" description="This collection doesn't have any NFTs yet." />
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
