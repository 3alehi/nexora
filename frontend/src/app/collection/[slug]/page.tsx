import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { api } from "@/services/api";
import { ApiRequestError } from "@/services/apiClient";
import { CollectionNftGrid } from "@/features/collections/CollectionNftGrid";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCollection(slug: string) {
  try {
    return await api.collections.getBySlug(slug);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return {};

  return {
    title: collection.name,
    description: collection.description ?? undefined,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) {
    notFound();
  }

  return (
    <div className="pb-20">
      <div className="relative h-48 w-full overflow-hidden bg-surface-raised sm:h-64">
        {collection.banner_url ? (
          <Image src={collection.banner_url} alt="" fill className="object-cover" priority />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-accent-soft to-transparent" />
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 pt-4">
          <div className="-mt-12 h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-surface-raised">
            {collection.logo_url ? (
              <Image src={collection.logo_url} alt={collection.name} width={96} height={96} className="h-full w-full object-cover" />
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              {collection.name}
              {collection.verified ? <BadgeCheck className="h-6 w-6 text-accent" /> : null}
            </h1>
            {collection.description ? (
              <p className="max-w-2xl text-sm text-muted">{collection.description}</p>
            ) : null}
          </div>

          <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border p-4 sm:grid-cols-4">
            <StatItem label="Floor Price" value={collection.floor_price ? `${collection.floor_price} ETH` : "—"} />
            <StatItem label="Volume" value={collection.volume ? `${collection.volume} ETH` : "—"} />
            <StatItem label="Chain" value={collection.chain} />
            <StatItem label="Contract" value={collection.contract_address ? shortenAddress(collection.contract_address) : "Not deployed"} />
          </dl>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Items</h2>
          <CollectionNftGrid collectionId={collection.id} />
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
