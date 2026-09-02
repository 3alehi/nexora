"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";

export function CryptoPriceTicker() {
  const { data, isLoading } = useQuery({
    queryKey: ["market", "crypto"],
    queryFn: () => api.market.getPrices(),
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 w-32 shrink-0 animate-pulse rounded-xl bg-border/60" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-1">
      {data?.map((coin) => {
        const isUp = coin.usd24hChange >= 0;
        return (
          <div
            key={coin.symbol}
            className="glass flex min-w-[130px] shrink-0 flex-col gap-1 rounded-xl px-4 py-3"
          >
            <span className="text-xs font-medium text-muted">{coin.symbol}</span>
            <span className="text-sm font-semibold">
              ${coin.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isUp ? "text-success" : "text-danger"
              )}
            >
              {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(coin.usd24hChange).toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
