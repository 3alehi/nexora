"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NavSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `/explore?search=${encodeURIComponent(trimmed)}` : "/explore");
  }

  return (
    <form onSubmit={handleSubmit} className="relative hidden md:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search NFTs..."
        className="h-9 w-56 rounded-full border border-border bg-surface pl-9 pr-3 text-sm text-foreground outline-none transition-all focus-visible:w-72 focus-visible:ring-2 focus-visible:ring-accent"
      />
    </form>
  );
}
