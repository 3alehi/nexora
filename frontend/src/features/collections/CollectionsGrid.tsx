"use client";

import { Layers, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { CollectionCardSkeleton } from "@/components/ui/Skeleton";
import { CollectionCard } from "@/features/collections/CollectionCard";
import { useCollections } from "@/features/marketplace/useCollections";

type SortOption = "newest" | "oldest" | "floor_price" | "volume" | "name";

const sortLabels: Record<SortOption, string> = {
  newest: "Newest",
  oldest: "Oldest",
  floor_price: "Floor Price",
  volume: "Volume",
  name: "Name",
};

const PAGE_SIZE = 24;

export function CollectionsGrid() {
  const [sort, setSort] = useState<SortOption>("newest");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const params = useMemo(
    () => ({
      limit: visibleCount,
      sort,
      verified: verifiedOnly ? true : undefined,
      search: search || undefined,
    }),
    [visibleCount, sort, verifiedOnly, search]
  );

  const { data, isLoading, isFetching } = useCollections(params);

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSearch(searchInput.trim());
    setVisibleCount(PAGE_SIZE);
  }

  const total = data?.pagination.total ?? 0;
  const canLoadMore = !isLoading && data ? data.items.length < total : false;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search collections..."
            className="h-10 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </form>

        <button
          type="button"
          onClick={() => {
            setVerifiedOnly((v) => !v);
            setVisibleCount(PAGE_SIZE);
          }}
          className={`h-9 rounded-full border px-4 text-sm font-medium transition-colors ${
            verifiedOnly ? "border-accent bg-accent-soft text-accent" : "border-border text-muted hover:bg-accent-soft hover:text-foreground"
          }`}
        >
          Verified only
        </button>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-muted">{isLoading ? "Loading..." : `${total.toLocaleString()} collections`}</span>
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as SortOption);
              setVisibleCount(PAGE_SIZE);
            }}
            className="h-9 rounded-full border border-border bg-surface px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CollectionCardSkeleton key={i} />
          ))}
        </div>
      ) : !data?.items.length ? (
        <EmptyState
          icon={Layers}
          title="No collections found"
          description={search || verifiedOnly ? "Try adjusting your search or filters." : "Be the first to create a collection on Nexora."}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.items.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>

          {canLoadMore ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                disabled={isFetching}
                className="h-10 rounded-full border border-border bg-surface px-6 text-sm font-medium text-foreground hover:bg-accent-soft disabled:opacity-50"
              >
                {isFetching ? "Loading..." : "Load More"}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
