"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Compass,
  ShieldCheck,
  Code2,
  GraduationCap,
  Clapperboard,
  Globe,
  ArrowRight,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Section, SectionHeader } from "@/components/ui/section";
import { GradientText } from "@/components/ui/gradient-text";

const items = [
  { key: "consulting", Icon: Compass,        slug: "consulting" },
  { key: "it",         Icon: ShieldCheck,    slug: "it-security" },
  { key: "software",   Icon: Code2,          slug: "software" },
  { key: "elearning",  Icon: GraduationCap,  slug: "elearning" },
  { key: "media",      Icon: Clapperboard,   slug: "media" },
  { key: "web",        Icon: Globe,          slug: "web" },
] as const;

export function ServicesSection() {
  const t = useTranslations("Services");

  return (
    <Section id="services" className="surface-grid relative">
      <div className="container-page relative">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
          subtitle={t("subtitle")}
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.Icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link
                  href={`/services/${item.slug}`}
                  className="group relative block h-full rounded-3xl card-elevated p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
                >
                  <span
                    aria-hidden
                    className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(140deg, color-mix(in oklab, var(--accent-from) 35%, transparent), transparent 50%, color-mix(in oklab, var(--accent-to) 30%, transparent))",
                      maskImage:
                        "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                      WebkitMaskImage:
                        "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      padding: 1,
                    }}
                  />
                  <div className="relative">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300 ring-1 ring-brand-500/20 transition-all group-hover:bg-brand-500 group-hover:text-white group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-semibold leading-tight">
                      {t(`items.${item.key}.title`)}
                    </h3>
                    <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                      {t(`items.${item.key}.description`)}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      {t("learnMore")}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
