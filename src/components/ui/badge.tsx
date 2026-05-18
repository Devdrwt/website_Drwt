import * as React from "react";
import { cn } from "@/lib/cn";

export function Badge({
  className,
  children,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "brand" | "neutral" | "accent" | "dark" | "light";
}) {
  const tones = {
    brand:
      "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-950 dark:text-brand-300",
    neutral:
      "border-[var(--border-strong)] text-foreground bg-[var(--bg-muted)]",
    accent:
      "border-transparent text-white bg-brand-600",
    dark:
      "border-transparent bg-foreground text-[var(--bg)]",
    light:
      "border-white/30 bg-white/10 text-white backdrop-blur",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
