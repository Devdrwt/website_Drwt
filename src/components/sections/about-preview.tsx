"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    num: "01",
    title_fr: "Livraison intégrée",
    title_en: "Integrated delivery",
    desc_fr: "Conception, développement et déploiement sous un seul toit.",
    desc_en: "Design, build and ship under one roof.",
  },
  {
    num: "02",
    title_fr: "Ingénierie full-service",
    title_en: "Full-service engineering",
    desc_fr: "Web, mobile, IA, cybersécurité, infrastructure — couverts.",
    desc_en: "Web, mobile, AI, security, infrastructure — covered.",
  },
  {
    num: "03",
    title_fr: "Outillage moderne",
    title_en: "Modern tooling",
    desc_fr: "Stack actuelle, CI/CD, monitoring, sécurité by design.",
    desc_en: "Current stack, CI/CD, monitoring, security by design.",
  },
  {
    num: "04",
    title_fr: "Support réactif",
    title_en: "Responsive support",
    desc_fr: "Interlocuteurs dédiés, SLA clairs, support post-prod.",
    desc_en: "Dedicated contacts, clear SLAs, post-launch support.",
  },
];

export function AboutPreview() {
  const t = useTranslations("About");
  const tNav = useTranslations("Nav");
  // simple bilingual rendering via document.lang
  const isEn = typeof document !== "undefined" && document.documentElement.lang === "en";

  return (
    <Section className="bg-[var(--bg-muted)]">
      <div className="container-page">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Image — right on desktop, top on mobile */}
          <div className="relative aspect-[4/5] lg:aspect-[5/6] overflow-hidden rounded-2xl order-1 lg:order-2">
            <img
              src="/images/about-drw.jpg"
              alt="Drwintech"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="order-2 lg:order-1">
            <p className="eyebrow-line mb-5">{t("eyebrow")}</p>
            <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-foreground text-balance">
              {t.rich("title", {
                gradient: (c) => <span className="text-brand-600 dark:text-brand-400">{c}</span>,
              })}
            </h2>
            <p className="mt-6 text-base md:text-lg text-fg-muted leading-relaxed max-w-xl">
              {t("paragraph1")}
            </p>

            <div className="mt-10 space-y-5">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.num}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="flex gap-5 items-start"
                >
                  <span className="number-marker shrink-0 mt-1">{p.num}</span>
                  <div className="border-l border-[var(--border-strong)] pl-5 flex-1">
                    <h4 className="font-semibold text-foreground">
                      {isEn ? p.title_en : p.title_fr}
                    </h4>
                    <p className="mt-1 text-sm text-fg-muted leading-relaxed">
                      {isEn ? p.desc_en : p.desc_fr}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <Link href="/about">
                <Button variant="primary" size="md">
                  {tNav("about")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
