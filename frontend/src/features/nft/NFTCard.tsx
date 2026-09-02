import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Nft } from "@/types/nft";

export function NFTCard({ nft }: { nft: Nft }) {
  return (
    <Link
      href={`/nft/${nft.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface-raised">
        <Image
          src={nft.image_url}
          alt={nft.name}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          type="button"
          aria-label="Add to favorites"
          className="glass absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-foreground opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(event) => event.preventDefault()}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col gap-1 p-3">
        <p className="truncate text-sm font-medium text-foreground">{nft.name}</p>
        <p className="text-xs capitalize text-muted">{nft.status}</p>
      </div>
    </Link>
  );
}
