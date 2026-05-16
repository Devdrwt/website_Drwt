import { ReactNode } from "react";
import { GradientText } from "./gradient-text";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <section className="relative pt-16 pb-16 md:pt-20 md:pb-20 overflow-hidden">
      <div className="surface-grid absolute inset-0 opacity-40 pointer-events-none" aria-hidden />
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[820px] rounded-full bg-[radial-gradient(closest-side,var(--accent-via),transparent_70%)] opacity-25 blur-3xl pointer-events-none"
        aria-hidden
      />
      <div className="container-page relative">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
              {eyebrow}
            </p>
          )}
          <h1 className="text-balance font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-balance text-base md:text-lg text-fg-muted leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export { GradientText };
