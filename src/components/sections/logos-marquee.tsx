"use client";

import { useTranslations } from "next-intl";

const clients = [
  "ZETCHA", "HRH SEMCA", "Beeloyalty", "Adsgenious",
  "Afropostmedia", "FEWUPRODUCTS", "JURISTOUCH", "HCBE USA-C",
];

export function LogosMarquee() {
  const t = useTranslations("Hero");
  return (
    <section className="py-16 md:py-20 border-y border-[var(--border)] bg-[var(--bg-muted)]/40">
      <div className="container-page">
        <p className="eyebrow-line justify-center text-center mb-10 [&]:before:hidden">
          {t("trustedBy")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-x-8 gap-y-10 items-center">
          {clients.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center text-fg-subtle font-display text-lg md:text-xl font-semibold tracking-tight hover:text-foreground transition-colors"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
