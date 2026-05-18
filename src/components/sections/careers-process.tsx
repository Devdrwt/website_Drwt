"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { FileText, Search, MessageCircle, CheckCircle2 } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";

const steps = [
  { key: "1", Icon: FileText,      duration: "≈ 5 min" },
  { key: "2", Icon: Search,        duration: "1–2 sem." },
  { key: "3", Icon: MessageCircle, duration: "≈ 1 h" },
  { key: "4", Icon: CheckCircle2,  duration: "1 sem." },
];

export function CareersProcess() {
  const t = useTranslations("Careers.process");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section className="bg-[var(--bg-muted)]">
      <div className="container-page">
        <SectionHeader
          eyebrow="Recrutement"
          title={
            <>
              Notre processus en <span className="text-brand-600 dark:text-brand-400">quatre étapes.</span>
            </>
          }
        />

        <div ref={ref} className="relative">
          {/* Horizontal progress line */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-12 left-12 right-12 h-px bg-[var(--border-strong)]"
          />
          <motion.div
            aria-hidden
            style={{ width: lineWidth }}
            className="hidden lg:block absolute top-12 left-12 h-px bg-brand-500"
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
            {steps.map((s, i) => {
              const Icon = s.Icon;
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.15 + 0.2, type: "spring", stiffness: 220 }}
                    className="relative w-24 h-24 mx-auto lg:mx-0 rounded-full bg-[var(--bg)] border-2 border-brand-500 flex items-center justify-center shadow-[0_0_0_8px_var(--bg-muted)]"
                  >
                    <Icon className="h-7 w-7 text-brand-600 dark:text-brand-400" />
                    <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-foreground text-[var(--bg)] flex items-center justify-center font-mono text-xs font-bold">
                      {s.key}
                    </span>
                  </motion.div>

                  <div className="mt-6 text-center lg:text-left">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
                      {s.duration}
                    </p>
                    <h3 className="text-lg font-semibold text-foreground">
                      {t(`steps.${s.key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                      {t(`steps.${s.key}.description`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
