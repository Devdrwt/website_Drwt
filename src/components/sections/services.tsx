"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Smartphone, Settings2, Workflow, Brain, ShieldCheck, ArrowRight,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Section, SectionHeader } from "@/components/ui/section";

const items = [
  { key: "web-mobile",     slug: "web-mobile",     Icon: Smartphone },
  { key: "custom",         slug: "custom",         Icon: Settings2 },
  { key: "transformation", slug: "transformation", Icon: Workflow },
  { key: "ai-data",        slug: "ai-data",        Icon: Brain },
  { key: "security",       slug: "security",       Icon: ShieldCheck },
] as const;

export function ServicesSection() {
  const t = useTranslations("Services");
  return (
    <Section id="services" className="bg-[var(--bg)]">
      <div className="container-page">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t.rich("title", { gradient: (c) => <span className="text-brand-600 dark:text-brand-400">{c}</span> })}
          subtitle={t("subtitle")}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.Icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              >
                <Link
                  href={`/services/${item.slug}` as never}
                  className="group block h-full card-elevated p-8"
                >
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground leading-tight">
                    {t(`items.${item.key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                    {t(`items.${item.key}.description`)}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 group-hover:gap-2.5 transition-all">
                    {t("learnMore")}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
