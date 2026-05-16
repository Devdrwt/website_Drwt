"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Section, SectionHeader } from "@/components/ui/section";
import { GradientText } from "@/components/ui/gradient-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const featured = [
  {
    title: "Plateforme LMS pour le ministère de l'Éducation",
    category: "E-learning",
    tags: ["Next.js", "PostgreSQL", "SCORM"],
    image:
      "linear-gradient(135deg,#06b6d4 0%,#6366f1 50%,#d946ef 100%)",
  },
  {
    title: "Refonte e-commerce omnicanal",
    category: "Web",
    tags: ["Shopify", "Headless", "Stripe"],
    image:
      "linear-gradient(135deg,#f97316 0%,#ec4899 50%,#8b5cf6 100%)",
  },
  {
    title: "Application mobile de mobilité urbaine",
    category: "Logiciel",
    tags: ["React Native", "Maps", "Realtime"],
    image:
      "linear-gradient(135deg,#10b981 0%,#06b6d4 50%,#3b82f6 100%)",
  },
  {
    title: "Documentaire corporate · 4K",
    category: "Audiovisuel",
    tags: ["Production", "Motion", "Color"],
    image:
      "linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#06b6d4 100%)",
  },
];

export function PortfolioPreview() {
  const t = useTranslations("Portfolio");

  return (
    <Section id="portfolio">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <SectionHeader
            align="left"
            className="mb-0 md:max-w-2xl"
            eyebrow={t("eyebrow")}
            title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
            subtitle={t("subtitle")}
          />
          <Link href="/portfolio" className="hidden md:inline-flex">
            <Button variant="outline" size="md">
              {t("viewAll")}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {featured.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={
                i % 3 === 0 ? "md:row-span-2" : ""
              }
            >
              <Link
                href="/portfolio"
                className="group relative block h-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)]"
              >
                <div
                  className="aspect-[4/3] md:aspect-[5/4] transition-transform duration-700 group-hover:scale-105"
                  style={{ background: p.image }}
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white">
                  <Badge tone="accent" className="mb-3">{p.category}</Badge>
                  <h3 className="font-display text-xl md:text-2xl font-semibold leading-tight">
                    {p.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 backdrop-blur px-2.5 py-0.5 text-xs font-medium ring-1 ring-white/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 md:hidden">
          <Link href="/portfolio">
            <Button variant="outline" size="md" className="w-full">
              {t("viewAll")}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
