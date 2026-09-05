"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import { useMarketStats } from "@/features/marketplace/useMarketStats";

export function MarketOverview() {
  const { data: prices, isLoading: pricesLoading } = useQuery({
    queryKey: ["market", "crypto"],
    queryFn: () => api.market.getPrices(),
  });
  const { data: stats, isLoading: statsLoading } = useMarketStats();

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Collections" value={stats?.totalCollections} isLoading={statsLoading} />
        <StatCard label="NFTs" value={stats?.totalNfts} isLoading={statsLoading} />
        <StatCard label="Active Listings" value={stats?.listedCount} isLoading={statsLoading} />
        <StatCard label="Total Sales" value={stats?.soldCount} isLoading={statsLoading} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard className="flex flex-col gap-1 p-4">
          <span className="text-xs text-muted">Total Volume</span>
          {statsLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span className="text-xl font-bold text-foreground">{stats?.totalVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })} ETH</span>
          )}
        </GlassCard>
        <GlassCard className="flex flex-col gap-1 p-4">
          <span className="text-xs text-muted">Minted</span>
          {statsLoading ? <Skeleton className="h-6 w-16" /> : <span className="text-xl font-bold text-foreground">{stats?.mintedCount}</span>}
        </GlassCard>
        <GlassCard className="flex flex-col gap-1 p-4">
          <span className="text-xs text-muted">Sell-Through</span>
          {statsLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <span className="text-xl font-bold text-foreground">
              {stats && stats.totalNfts > 0 ? `${((stats.soldCount / stats.totalNfts) * 100).toFixed(1)}%` : "—"}
            </span>
          )}
        </GlassCard>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">Cryptocurrency Prices</h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-raised text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">24h Change</th>
                <th className="px-4 py-3">Market Cap</th>
                <th className="px-4 py-3">24h Volume</th>
              </tr>
            </thead>
            <tbody>
              {pricesLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-4 py-3" colSpan={5}>
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))
                : prices?.map((coin) => {
                    const isUp = coin.usd24hChange >= 0;
                    return (
                      <tr key={coin.symbol} className="border-t border-border">
                        <td className="px-4 py-3 font-medium text-foreground">{coin.symbol}</td>
                        <td className="px-4 py-3">${coin.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                        <td className={cn("px-4 py-3", isUp ? "text-success" : "text-danger")}>
                          <span className="flex items-center gap-1">
                            {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                            {Math.abs(coin.usd24hChange).toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted">${coin.usdMarketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        <td className="px-4 py-3 text-muted">${coin.usd24hVol.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, isLoading }: { label: string; value?: number; isLoading: boolean }) {
  return (
    <GlassCard className="flex flex-col gap-1 p-4">
      <span className="text-xs text-muted">{label}</span>
      {isLoading ? <Skeleton className="h-6 w-16" /> : <span className="text-xl font-bold text-foreground">{value ?? 0}</span>}
    </GlassCard>
  );
}
