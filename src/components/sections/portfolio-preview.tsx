"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

type Project = {
  num: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  cover: string;
};

const projects: Project[] = [
  {
    num: "01",
    slug: "zetcha",
    title: "ZETCHA",
    category: "Web · SaaS · UX",
    summary:
      "Plateforme de cartes de visite numériques, partage en un geste, gestion de profils professionnels, QR codes dynamiques.",
    tags: ["React", "Node.js", "PostgreSQL"],
    cover: "linear-gradient(135deg,#06b6d4 0%,#6366f1 50%,#d946ef 100%)",
  },
  {
    num: "02",
    slug: "hcbe-usa-c",
    title: "HCBE USA-C",
    category: "IA & Data · Santé",
    summary:
      "Système de gestion hospitalière avec assistance IA en imagerie médicale, gouvernance et explicabilité documentées.",
    tags: ["Python", "TensorFlow", "FastAPI"],
    cover: "linear-gradient(135deg,#0891b2 0%,#7c3aed 50%,#db2777 100%)",
  },
  {
    num: "03",
    slug: "adsgenious",
    title: "Adsgenious",
    category: "Analytics · Marketing",
    summary:
      "Plateforme intelligente de création et de pilotage de campagnes publicitaires multi-canaux (Meta, Google, TikTok, LinkedIn).",
    tags: ["Next.js", "TypeScript", "MongoDB"],
    cover: "linear-gradient(135deg,#0ea5e9 0%,#7c3aed 50%,#ec4899 100%)",
  },
  {
    num: "04",
    slug: "hrh-semca",
    title: "HRH SEMCA",
    category: "Software · Santé",
    summary:
      "Système de gestion RH pour établissements de santé : plannings, rotations, congés, intégration paie.",
    tags: ["Vue.js", "Python", "Django"],
    cover: "linear-gradient(135deg,#10b981 0%,#06b6d4 50%,#3b82f6 100%)",
  },
];

export function PortfolioPreview() {
  const t = useTranslations("Portfolio");

  return (
    <Section id="portfolio" className="bg-[var(--bg)]">
      <div className="container-page">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t.rich("title", { gradient: (c) => <span className="text-brand-600 dark:text-brand-400">{c}</span> })}
          subtitle={t("subtitle")}
        />

        <div className="space-y-16 md:space-y-24">
          {projects.map((p, i) => (
            <ProjectRow key={p.slug} project={p} reverse={i % 2 === 1} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link href="/portfolio">
            <Button variant="primary" size="lg">
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}

function ProjectRow({ project, reverse }: { project: Project; reverse: boolean }) {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`grid gap-10 lg:gap-16 lg:grid-cols-2 lg:items-center ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <Link
        href={`/portfolio/${project.slug}` as never}
        data-cursor="view"
        ref={imgRef as unknown as React.RefObject<HTMLAnchorElement>}
        className="group block relative aspect-[16/11] overflow-hidden rounded-2xl"
      >
        <motion.div
          style={{ y: yImg, height: "124%", top: "-12%" }}
          className="absolute inset-x-0 transition-transform duration-700 group-hover:scale-105"
          aria-hidden
        >
          <div className="absolute inset-0" style={{ background: project.cover }} />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-6 left-6 number-marker text-white/80">
          {project.num}
        </span>
        <span className="absolute bottom-6 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-foreground opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
          <ArrowRight className="h-4 w-4 -rotate-45" />
        </span>
      </Link>

      <motion.div style={{ y: yText }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400 mb-4">
          {project.num} — {project.category}
        </p>
        <h3 className="heading-display text-3xl md:text-4xl lg:text-5xl text-foreground">
          {project.title}
        </h3>
        <p className="mt-5 text-base text-fg-muted leading-relaxed max-w-xl">
          {project.summary}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-md border border-[var(--border-strong)] text-fg-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href={`/portfolio/${project.slug}` as never}
            className="inline-flex items-center gap-1.5 font-semibold text-brand-600 dark:text-brand-400 hover:gap-2.5 transition-all text-sm"
          >
            Étude de cas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </motion.article>
  );
}
