"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Compass, PenTool, Code2, Rocket } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";

const steps = [
  { key: "discover", Icon: Compass, num: "01" },
  { key: "design",   Icon: PenTool, num: "02" },
  { key: "build",    Icon: Code2,   num: "03" },
  { key: "scale",    Icon: Rocket,  num: "04" },
] as const;

export function ProcessSection() {
  const t = useTranslations("Process");
  return (
    <Section className="bg-[var(--bg-muted)]">
      <div className="container-page">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t.rich("title", { gradient: (c) => <span className="text-brand-600 dark:text-brand-400">{c}</span> })}
          subtitle={t("intro")}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative">
          <div
            aria-hidden
            className="hidden lg:block absolute top-14 left-12 right-12 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent"
          />
          {steps.map((s, i) => {
            const Icon = s.Icon;
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative card-elevated p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="number-marker">{s.num}</span>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {t(`steps.${s.key}.title`)}
                </h3>
                <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                  {t(`steps.${s.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
