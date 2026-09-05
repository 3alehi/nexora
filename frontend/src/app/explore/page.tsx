import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreGrid } from "@/features/nft/ExploreGrid";
import { WalletNftsSection } from "@/features/nft/WalletNftsSection";

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse NFTs across every collection on Nexora.",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-10 sm:px-6 lg:px-8">
      <WalletNftsSection />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Explore</h1>
          <p className="text-sm text-muted">Discover NFTs created on Nexora.</p>
        </div>
        <Suspense fallback={null}>
          <ExploreGrid />
        </Suspense>
      </div>
    </div>
  );
}
