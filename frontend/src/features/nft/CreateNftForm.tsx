"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { api } from "@/services/api";
import { ApiRequestError } from "@/services/apiClient";
import { useState } from "react";

const createNftSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(2000).optional(),
  imageUrl: z.url("Enter a valid image URL"),
});

type CreateNftFormValues = z.infer<typeof createNftSchema>;

export function CreateNftForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateNftFormValues>({
    resolver: zodResolver(createNftSchema),
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = async (values: CreateNftFormValues) => {
    setSubmitError(null);
    try {
      // NOTE: creating an NFT requires a Supabase session access token, which
      // the frontend auth flow doesn't issue yet — this call is expected to
      // fail with 401 until sign-in is wired up. We surface that honestly
      // rather than pretending the NFT was created.
      await api.nfts.create(values);
      setSubmitted(true);
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        setSubmitError("You need to sign in before creating an NFT. Sign-in isn't available yet in this build.");
      } else if (error instanceof ApiRequestError) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    }
  };

  if (submitted) {
    return (
      <GlassCard className="flex flex-col items-center gap-3 p-10 text-center">
        <p className="text-lg font-semibold text-foreground">NFT created</p>
        <p className="text-sm text-muted">Your NFT has been saved as a draft.</p>
      </GlassCard>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Field label="Name" error={errors.name?.message}>
          <input
            {...register("name")}
            type="text"
            placeholder="e.g. Cosmic Drifter #042"
            className="h-11 rounded-xl border border-border bg-surface px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </Field>

        <Field label="Description" error={errors.description?.message}>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Tell collectors about this piece..."
            className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </Field>

        <Field label="Image URL" error={errors.imageUrl?.message}>
          <input
            {...register("imageUrl")}
            type="url"
            placeholder="https://..."
            className="h-11 rounded-xl border border-border bg-surface px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </Field>

        {submitError ? (
          <p className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            <LockKeyhole className="h-4 w-4 shrink-0" /> {submitError}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create NFT"}
        </Button>
      </form>

      <GlassCard className="flex flex-col gap-4 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Live Preview</p>
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-surface-raised">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
              <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
              <span className="text-xs">Paste an image URL to preview</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{watch("name") || "Untitled"}</span>
          <span className="text-xs text-muted">{watch("description") || "No description yet"}</span>
        </div>
      </GlassCard>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}
