"use client";

import { ImageOff, Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { NFTCardSkeleton } from "@/components/ui/Skeleton";
import { useNfts } from "@/features/marketplace/useNfts";
import { NFTCard } from "@/features/nft/NFTCard";
import type { NftStatus } from "@/types/nft";

type SortOption = "newest" | "oldest";

const sortLabels: Record<SortOption, string> = {
  newest: "Recently Listed",
  oldest: "Oldest First",
};

const STATUS_OPTIONS: { value: NftStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "listed", label: "Listed" },
  { value: "minted", label: "Minted" },
  { value: "sold", label: "Sold" },
  { value: "draft", label: "Draft" },
];

const CHAIN_OPTIONS = [
  { value: "all", label: "All Chains" },
  { value: "sepolia", label: "Sepolia" },
  { value: "mainnet", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "base", label: "Base" },
  { value: "arbitrum", label: "Arbitrum" },
];

const STANDARD_OPTIONS = [
  { value: "all", label: "All Standards" },
  { value: "ERC721", label: "ERC-721" },
  { value: "ERC1155", label: "ERC-1155" },
];

const PAGE_SIZE = 24;

export function ExploreGrid() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [sort, setSort] = useState<SortOption>("newest");
  const [status, setStatus] = useState<NftStatus | "all">("all");
  const [chain, setChain] = useState("all");
  const [standard, setStandard] = useState<"all" | "ERC721" | "ERC1155">("all");
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const params = useMemo(
    () => ({
      limit: visibleCount,
      sort,
      status: status === "all" ? undefined : status,
      chain: chain === "all" ? undefined : chain,
      standard: standard === "all" ? undefined : standard,
      search: search || undefined,
    }),
    [visibleCount, sort, status, chain, standard, search]
  );

  const { data, isLoading, isFetching } = useNfts(params);

  function resetPaging() {
    setVisibleCount(PAGE_SIZE);
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSearch(searchInput.trim());
    resetPaging();
  }

  const hasActiveFilters = status !== "all" || chain !== "all" || standard !== "all" || search !== "";

  function clearFilters() {
    setStatus("all");
    setChain("all");
    setStandard("all");
    setSearchInput("");
    setSearch("");
    resetPaging();
  }

  const total = data?.pagination.total ?? 0;
  const canLoadMore = !isLoading && data ? data.items.length < total : false;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search NFTs by name..."
          className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-24 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground hover:brightness-110"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          value={status}
          onChange={(value) => {
            setStatus(value as NftStatus | "all");
            resetPaging();
          }}
          options={STATUS_OPTIONS}
        />
        <FilterSelect
          value={chain}
          onChange={(value) => {
            setChain(value);
            resetPaging();
          }}
          options={CHAIN_OPTIONS}
        />
        <FilterSelect
          value={standard}
          onChange={(value) => {
            setStandard(value as typeof standard);
            resetPaging();
          }}
          options={STANDARD_OPTIONS}
        />

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted hover:bg-accent-soft hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        ) : null}

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-muted">{isLoading ? "Loading..." : `${total.toLocaleString()} items`}</span>
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
          description={hasActiveFilters ? "Try adjusting or clearing your filters." : "Once creators mint NFTs on Nexora, they'll show up here."}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {data.items.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
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

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 rounded-full border border-border bg-surface px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
