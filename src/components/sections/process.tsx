"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Compass, PenTool, Code2, Rocket } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { GradientText } from "@/components/ui/gradient-text";

const steps = [
  { key: "discover", Icon: Compass },
  { key: "design",   Icon: PenTool },
  { key: "build",    Icon: Code2 },
  { key: "scale",    Icon: Rocket },
] as const;

export function ProcessSection() {
  const t = useTranslations("Process");

  return (
    <Section className="bg-[var(--bg-muted)]/40 border-y border-[var(--border)]">
      <div className="container-page">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
        />

        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden
            className="hidden lg:block absolute top-12 left-12 right-12 h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent"
          />
          {steps.map((s, i) => {
            const Icon = s.Icon;
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative card-elevated p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-from),var(--accent-via))] text-white shadow-[var(--shadow-glow)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-3xl font-display font-semibold text-fg-subtle">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold">
                  {t(`steps.${s.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-fg-muted leading-relaxed">
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
