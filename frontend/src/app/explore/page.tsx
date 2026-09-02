import type { Metadata } from "next";
import { ExploreGrid } from "@/features/nft/ExploreGrid";

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse NFTs across every collection on Nexora.",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Explore</h1>
        <p className="text-sm text-muted">Discover NFTs from creators across Nexora.</p>
      </div>
      <ExploreGrid />
    </div>
  );
}
