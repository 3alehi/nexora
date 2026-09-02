"use client";

import { Layers } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { CollectionCardSkeleton } from "@/components/ui/Skeleton";
import { CollectionCard } from "@/features/collections/CollectionCard";
import { useCollections } from "@/features/marketplace/useCollections";

export function CollectionsGrid() {
  const { data, isLoading } = useCollections({ limit: 24 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CollectionCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <EmptyState
        icon={Layers}
        title="No collections yet"
        description="Be the first to create a collection on Nexora."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {data.items.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
