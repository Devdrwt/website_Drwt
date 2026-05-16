import * as React from "react";
import { cn } from "@/lib/cn";

export function Badge({
  className,
  children,
  tone = "brand",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: "brand" | "neutral" | "accent" }) {
  const tones = {
    brand:
      "border-brand-500/30 bg-brand-500/10 text-brand-700 dark:text-brand-300",
    neutral:
      "border-[var(--border-strong)] bg-foreground/[0.04] text-fg-muted",
    accent:
      "border-transparent text-white bg-[linear-gradient(120deg,var(--accent-from),var(--accent-via),var(--accent-to))]",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
