import { Compass } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <span className="text-sm font-medium uppercase tracking-wide text-muted">404</span>
      <h1 className="text-2xl font-bold text-foreground">We couldn&apos;t find that page</h1>
      <p className="max-w-md text-sm text-muted">
        The item you&apos;re looking for might have been moved, renamed, or never existed.
      </p>
      <Link href="/explore">
        <Button size="md">
          <Compass className="h-4 w-4" /> Back to Explore
        </Button>
      </Link>
    </div>
  );
}
