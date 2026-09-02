import type { Metadata } from "next";
import { CollectionsGrid } from "@/features/collections/CollectionsGrid";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse verified and community NFT collections on Nexora.",
};

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Collections</h1>
        <p className="text-sm text-muted">Explore collections created by artists and creators on Nexora.</p>
      </div>
      <CollectionsGrid />
    </div>
  );
}
