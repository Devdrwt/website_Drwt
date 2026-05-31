import * as React from "react";
import { cn } from "@/lib/cn";

export function Section({
  className, children, id, ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section id={id} className={cn("relative section-pad", className)} {...props}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl mb-14 md:mb-20", align === "center" ? "mx-auto text-center" : "", className)}>
      {eyebrow && (
        <p className={cn("eyebrow-line mb-5", align === "center" ? "justify-center" : "")}>
          {eyebrow}
        </p>
      )}
      <h2 className="heading-display text-balance text-3xl md:text-4xl lg:text-5xl text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-6 text-balance text-base md:text-lg text-fg-muted leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
