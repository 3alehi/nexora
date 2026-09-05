import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/types/nft";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/collection/${collection.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative h-28 w-full overflow-hidden bg-surface-raised">
        {collection.banner_url ? (
          <Image
            src={collection.banner_url}
            alt=""
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-accent-soft to-transparent" />
        )}
      </div>
      <div className="flex items-center gap-3 px-3 py-3">
        <div className="relative -mt-8 h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-surface bg-surface-raised">
          {collection.logo_url ? (
            <Image src={collection.logo_url} alt={collection.name} fill sizes="48px" className="object-cover" />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="flex items-center gap-1 truncate text-sm font-semibold text-foreground">
            {collection.name}
            {collection.verified ? <BadgeCheck className="h-4 w-4 shrink-0 text-accent" /> : null}
          </span>
          <span className="flex items-center gap-2 text-xs text-muted">
            <span>Floor {collection.floor_price ?? "—"} ETH</span>
            {collection.volume != null ? (
              <>
                <span className="text-border">·</span>
                <span>Vol {collection.volume.toLocaleString(undefined, { maximumFractionDigits: 1 })} ETH</span>
              </>
            ) : null}
          </span>
        </div>
      </div>
    </Link>
  );
}
