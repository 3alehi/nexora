import { BadgeCheck, Heart, Layers, Link2, Share2, ShieldCheck, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { MoreFromCollection } from "@/features/nft/MoreFromCollection";
import { api } from "@/services/api";
import { ApiRequestError } from "@/services/apiClient";
import type { Collection } from "@/types/nft";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getNft(id: string) {
  try {
    return await api.nfts.getById(id);
  } catch (error) {
    if (error instanceof ApiRequestError && (error.status === 404 || error.status === 400)) {
      return null;
    }
    throw error;
  }
}

async function getCollection(collectionId: string | null): Promise<Collection | null> {
  if (!collectionId) return null;
  try {
    return await api.collections.getById(collectionId);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const nft = await getNft(id);
  if (!nft) return {};

  return {
    title: nft.name,
    description: nft.description ?? undefined,
  };
}

const STATUS_STYLES: Record<string, string> = {
  listed: "bg-emerald-500/15 text-emerald-500",
  sold: "bg-rose-500/15 text-rose-500",
  minted: "bg-accent/15 text-accent",
  draft: "bg-border text-muted",
};

export default async function NftDetailPage({ params }: PageProps) {
  const { id } = await params;
  const nft = await getNft(id);

  if (!nft) {
    notFound();
  }

  const collection = await getCollection(nft.collection_id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {collection ? (
        <Link
          href={`/collection/${collection.slug}`}
          className="mb-6 flex w-fit items-center gap-3 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-4 transition-colors hover:bg-accent-soft"
        >
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-surface-raised">
            {collection.logo_url ? (
              <Image src={collection.logo_url} alt="" fill className="object-cover" />
            ) : null}
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-foreground">
            {collection.name}
            {collection.verified ? <BadgeCheck className="h-4 w-4 text-accent" /> : null}
          </span>
        </Link>
      ) : null}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface-raised">
            <Image src={nft.image_url} alt={nft.name} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" priority />
          </div>

          <div className="grid grid-cols-3 gap-4 rounded-2xl border border-border p-4">
            <MiniStat icon={Layers} label="Standard" value={nft.standard} />
            <MiniStat icon={ShieldCheck} label="Chain" value={nft.chain} />
            <MiniStat icon={Wallet} label="Token ID" value={nft.token_id ?? "—"} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">{nft.chain} · {nft.standard}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[nft.status] ?? STATUS_STYLES.draft}`}>
                {nft.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{nft.name}</h1>
            <p className="text-xs text-muted">
              Created {new Date(nft.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {collection?.floor_price != null ? (
            <div className="flex items-center gap-8 rounded-2xl border border-border bg-surface p-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted">Collection Floor</span>
                <span className="text-lg font-semibold text-foreground">{collection.floor_price} ETH</span>
              </div>
              {collection.volume != null ? (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted">Collection Volume</span>
                  <span className="text-lg font-semibold text-foreground">{collection.volume} ETH</span>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <Button size="md" disabled title="Listings aren't available yet">
              Buy Now
            </Button>
            <Button variant="secondary" size="md" disabled title="Offers aren't available yet">
              Make Offer
            </Button>
            <button
              type="button"
              aria-label="Add to favorites"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-accent-soft"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Share"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-accent-soft"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {nft.description ? (
            <section className="flex flex-col gap-2 rounded-2xl border border-border p-4">
              <h2 className="text-sm font-semibold text-foreground">Description</h2>
              <p className="text-sm text-muted">{nft.description}</p>
            </section>
          ) : null}

          <section className="flex flex-col gap-3 rounded-2xl border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground">Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <DetailItem label="Status" value={nft.status} />
              <DetailItem label="Token Standard" value={nft.standard} />
              <DetailItem label="Chain" value={nft.chain} />
              <DetailItem label="Token ID" value={nft.token_id ?? "Not minted"} />
              <DetailItem
                label="Owner"
                value={nft.owner_address ? shortenAddress(nft.owner_address) : "Unassigned"}
                icon={Wallet}
              />
              <DetailItem
                label="Contract"
                value={nft.contract_address ? shortenAddress(nft.contract_address) : "Not deployed"}
                icon={Link2}
              />
            </dl>
          </section>
        </div>
      </div>

      {collection ? (
        <section className="mt-16">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">More from {collection.name}</h2>
            <Link href={`/collection/${collection.slug}`} className="text-sm font-medium text-accent hover:underline">
              View collection
            </Link>
          </div>
          <MoreFromCollection collectionId={collection.id} excludeId={nft.id} />
        </section>
      ) : null}
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof Layers; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <Icon className="h-4 w-4 text-muted" />
      <span className="truncate text-xs font-medium capitalize text-foreground">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-muted">{label}</span>
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Layers;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="flex items-center gap-1 text-xs text-muted">
        {Icon ? <Icon className="h-3 w-3" /> : null}
        {label}
      </dt>
      <dd className="truncate text-sm font-medium capitalize text-foreground">{value}</dd>
    </div>
  );
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
