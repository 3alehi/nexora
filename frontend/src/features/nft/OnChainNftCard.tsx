import { Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import type { OnChainNft } from "@/types/nft";

export function OnChainNftCard({ nft }: { nft: OnChainNft }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative aspect-square w-full overflow-hidden bg-surface-raised">
        {nft.imageUrl ? (
          <Image
            src={nft.imageUrl}
            alt={nft.name ?? "On-chain NFT"}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">No preview</div>
        )}
        <span className="glass absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-foreground">
          <LinkIcon className="h-3 w-3 text-accent" /> On-chain
        </span>
      </div>
      <div className="flex flex-col gap-1 p-3">
        <p className="truncate text-sm font-medium text-foreground">{nft.name ?? `Token #${nft.tokenId}`}</p>
        <p className="truncate text-xs text-muted">{nft.collectionName ?? "Unknown collection"}</p>
      </div>
    </div>
  );
}
