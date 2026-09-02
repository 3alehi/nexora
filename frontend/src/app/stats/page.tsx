import type { Metadata } from "next";
import { MarketOverview } from "@/features/marketplace/MarketOverview";

export const metadata: Metadata = {
  title: "Stats",
  description: "Market overview and crypto prices on Nexora.",
};

export default function StatsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Marketplace Stats</h1>
        <p className="text-sm text-muted">A live overview of activity and prices on Nexora.</p>
      </div>
      <MarketOverview />
    </div>
  );
}
