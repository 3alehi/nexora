import { Compass, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CryptoPriceTicker } from "@/features/marketplace/CryptoPriceTicker";
import { StatsStrip } from "@/features/marketplace/StatsStrip";
import { TrendingCollections } from "@/features/marketplace/TrendingCollections";
import { TrendingNfts } from "@/features/marketplace/TrendingNfts";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-24">
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent-soft via-transparent to-transparent" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex max-w-2xl flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Built for the next generation of digital ownership
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Discover, collect, and trade NFTs on Nexora
            </h1>
            <p className="text-base text-muted sm:text-lg">
              A fast, secure marketplace for creators and collectors — browse curated
              collections, list your own work, and trade on-chain with full transparency.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/explore">
                <Button size="lg">
                  <Compass className="h-4 w-4" /> Explore NFTs
                </Button>
              </Link>
              <Link href="/create">
                <Button variant="secondary" size="lg">
                  Create NFT
                </Button>
              </Link>
            </div>
          </div>

          <CryptoPriceTicker />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <StatsStrip />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Trending Collections</h2>
          <Link href="/collections" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        </div>
        <TrendingCollections />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Trending NFTs</h2>
          <Link href="/explore" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        </div>
        <TrendingNfts />
      </section>
    </div>
  );
}
