import * as React from "react";
import { cn } from "@/lib/cn";

export function Section({
  className,
  children,
  id,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      id={id}
      className={cn("relative py-20 md:py-28 lg:py-36", className)}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-14 md:mb-20 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.05] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-6 text-balance text-base md:text-lg text-fg-muted leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
