"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Phone } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function CTA() {
  const t = useTranslations("CTA");

  return (
    <section className="relative py-24 md:py-32 bg-foreground text-fg-on-dark overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-brand-500/30 blur-3xl"
      />

      <div className="container-page relative">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-300 mb-5">
              {t("title").replace(/[?!]$/, "")}
            </p>
            <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-fg-on-dark leading-[1.05] text-balance">
              Ingénierie digitale de confiance pour les projets exigeants — tous secteurs.
            </h2>
            <p className="mt-6 max-w-2xl text-fg-on-dark/75 text-lg leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4">
            <a
              href={`tel:${siteConfig.whatsapp.replace(/\s/g, "")}`}
              className="group inline-flex items-center gap-3"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white group-hover:bg-brand-400 transition-colors">
                <Phone className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-fg-on-dark/60">
                  Téléphone direct
                </span>
                <span className="block text-2xl md:text-3xl font-semibold text-fg-on-dark group-hover:text-brand-300 transition-colors">
                  {siteConfig.whatsapp}
                </span>
              </span>
            </a>

            <Link href="/contact" className="mt-4">
              <Button variant="light" size="lg">
                {t("primary")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
