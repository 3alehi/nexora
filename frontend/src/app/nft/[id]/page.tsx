import { Heart, Share2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { api } from "@/services/api";
import { ApiRequestError } from "@/services/apiClient";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const nft = await getNft(id);
  if (!nft) return {};

  return {
    title: nft.name,
    description: nft.description ?? undefined,
  };
}

export default async function NftDetailPage({ params }: PageProps) {
  const { id } = await params;
  const nft = await getNft(id);

  if (!nft) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface-raised">
          <Image src={nft.image_url} alt={nft.name} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" priority />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">{nft.chain} · {nft.standard}</span>
            <h1 className="text-3xl font-bold text-foreground">{nft.name}</h1>
            {nft.description ? <p className="text-sm text-muted">{nft.description}</p> : null}
          </div>

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

          <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border p-4">
            <DetailItem label="Status" value={nft.status} />
            <DetailItem label="Token ID" value={nft.token_id ?? "Not minted"} />
            <DetailItem label="Owner" value={nft.owner_address ? shortenAddress(nft.owner_address) : "Unassigned"} />
            <DetailItem label="Contract" value={nft.contract_address ? shortenAddress(nft.contract_address) : "Not deployed"} />
          </dl>

        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="truncate text-sm font-medium capitalize text-foreground">{value}</dd>
    </div>
  );
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
