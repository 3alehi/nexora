import type { Metadata } from "next";
import { CreateNftForm } from "@/features/nft/CreateNftForm";

export const metadata: Metadata = {
  title: "Create",
  description: "Create and mint your own NFT on Nexora.",
};

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Create NFT</h1>
        <p className="text-sm text-muted">Fill in the details below to create a new NFT.</p>
      </div>
      <CreateNftForm />
    </div>
  );
}
