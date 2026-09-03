"use client";

import { AlertTriangle, Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { NFTCardSkeleton } from "@/components/ui/Skeleton";
import { useWalletNfts } from "@/features/wallet/useWalletNfts";
import { OnChainNftCard } from "@/features/nft/OnChainNftCard";
import { ApiRequestError } from "@/services/apiClient";

export function WalletNftsSection() {
  const { isConnected } = useAccount();
  const { data, isLoading, error } = useWalletNfts();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Wallet className="h-4 w-4 text-accent" />
        <h2 className="text-lg font-semibold text-foreground">Your Wallet NFTs</h2>
        <span className="text-xs text-muted">from the blockchain, via Zerion</span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <NFTCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error instanceof ApiRequestError
            ? "On-chain NFT data is temporarily unavailable. Your wallet's assets couldn't be loaded right now."
            : "Something went wrong loading your wallet's NFTs."}
        </div>
      ) : !data?.nfts.length ? (
        <p className="rounded-2xl border border-border px-4 py-6 text-center text-sm text-muted">
          No NFTs found in this wallet on {data?.chain ?? "the current network"}.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data.nfts.map((nft) => (
            <OnChainNftCard key={`${nft.contractAddress}-${nft.tokenId}`} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
}
