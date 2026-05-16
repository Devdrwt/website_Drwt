"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Award, Heart, Lightbulb, Globe2 } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Section, SectionHeader } from "@/components/ui/section";
import { GradientText } from "@/components/ui/gradient-text";
import { Button } from "@/components/ui/button";

const values = [
  { key: "excellence", Icon: Award },
  { key: "proximity",  Icon: Heart },
  { key: "innovation", Icon: Lightbulb },
  { key: "impact",     Icon: Globe2 },
] as const;

export function AboutPreview() {
  const t = useTranslations("About");
  const tNav = useTranslations("Nav");

  return (
    <Section>
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <div>
            <SectionHeader
              align="left"
              className="mb-8"
              eyebrow={t("eyebrow")}
              title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
            />
            <div className="space-y-5 text-base md:text-lg text-fg-muted leading-relaxed">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
            </div>
            <div className="mt-8">
              <Link href="/about">
                <Button variant="outline" size="md">
                  {tNav("about")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400 mb-5">
              {t("values.title")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((v, i) => {
                const Icon = v.Icon;
                return (
                  <motion.div
                    key={v.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="card-elevated p-5"
                  >
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="font-semibold text-sm">{t(`values.${v.key}.title`)}</h4>
                    <p className="mt-1 text-xs text-fg-muted leading-relaxed">
                      {t(`values.${v.key}.description`)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
