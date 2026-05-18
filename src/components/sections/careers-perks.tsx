"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles, Globe2, Users, Rocket, Heart, Scale } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";

const perks = [
  { key: "growth",    Icon: Sparkles },
  { key: "remote",    Icon: Globe2 },
  { key: "team",      Icon: Users },
  { key: "impact",    Icon: Rocket },
  { key: "balance",   Icon: Heart },
  { key: "diversity", Icon: Scale },
] as const;

export function CareersPerks() {
  const t = useTranslations("Careers");
  return (
    <Section className="bg-[var(--bg-muted)]">
      <div className="container-page">
        <SectionHeader
          eyebrow={t("perks.title")}
          title={
            <>
              Une équipe qui prend soin <span className="text-brand-600 dark:text-brand-400">de ses talents.</span>
            </>
          }
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((p, i) => {
            const Icon = p.Icon;
            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -4 }}
                className="relative card-elevated p-7 group overflow-hidden"
              >
                <motion.span
                  aria-hidden
                  className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <div className="relative">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t(`perks.${p.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                    {t(`perks.${p.key}.description`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
