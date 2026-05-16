"use client";

import { useTranslations } from "next-intl";

const logos = [
  "Banque Atlantique", "MTN", "Orange", "BOA", "Ministère de l'Éducation",
  "OOAS", "BCEAO", "PNUD", "ONG SOS", "GIZ", "AfDB", "Sonibank",
];

export function LogosMarquee() {
  const t = useTranslations("Hero");
  return (
    <section className="py-14 border-y border-[var(--border)] bg-[var(--bg-muted)]/30">
      <div className="container-page">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-fg-subtle mb-8">
          {t("trustedBy")}
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-12">
            {[...logos, ...logos].map((name, i) => (
              <span
                key={i}
                className="font-display text-xl md:text-2xl font-semibold text-fg-subtle hover:text-foreground transition-colors whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
