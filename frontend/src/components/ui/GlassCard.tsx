import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass rounded-2xl shadow-[0_8px_30px_-12px_hsl(var(--shadow-color)/0.5)]",
        className
      )}
      {...props}
    />
  );
}
