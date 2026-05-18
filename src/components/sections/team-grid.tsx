"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Mail } from "lucide-react";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const team = [
  {
    name: "Nadia A. Dossa",
    role_fr: "Product Strategist",
    role_en: "Product Strategist",
    bio_fr: "10+ ans en stratégie produit et discovery. Pilote la phase Discover/Define sur les missions complexes.",
    bio_en: "10+ years in product strategy and discovery. Leads Discover/Define on complex engagements.",
    bg: "from-cyan-500 via-blue-600 to-indigo-700",
  },
  {
    name: "Wilfried K. Houngbedji",
    role_fr: "Lead Data Architect",
    role_en: "Lead Data Architect",
    bio_fr: "Architecte data senior, spécialiste ML appliqué. Bâtit nos pipelines IA en production.",
    bio_en: "Senior data architect, applied ML specialist. Builds our production AI pipelines.",
    bg: "from-blue-500 via-violet-600 to-purple-700",
  },
  {
    name: "Cyrille A. Kossi",
    role_fr: "Fullstack Engineer",
    role_en: "Fullstack Engineer",
    bio_fr: "Ingénieur fullstack passionné de DX. Référent technique Next.js et React Native dans nos équipes.",
    bio_en: "Fullstack engineer passionate about DX. Technical lead for Next.js and React Native.",
    bg: "from-sky-500 via-cyan-600 to-fuchsia-700",
  },
  {
    name: "Drwintech Crew",
    role_fr: "Designers · Devs · Stratèges",
    role_en: "Designers · Devs · Strategists",
    bio_fr: "L'équipe étendue : designers UX/UI, ingénieurs back, motion designers, formateurs.",
    bio_en: "The extended team: UX/UI designers, backend engineers, motion designers, trainers.",
    bg: "from-slate-700 via-slate-800 to-slate-900",
  },
];

export function TeamGrid() {
  const t = useTranslations("Team");
  const isEn = typeof document !== "undefined" && document.documentElement.lang === "en";

  return (
    <section className="py-16 md:py-24 bg-[var(--bg)]">
      <div className="container-page">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {team.map((m, i) => (
            <motion.article
              key={m.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${m.bg} transition-transform duration-700 group-hover:scale-110`} aria-hidden />
              <div
                aria-hidden
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,.4) 1px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:opacity-0 group-hover:scale-90">
                <span className="font-display text-7xl md:text-8xl text-white/40 font-semibold tracking-tighter">
                  {m.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="font-mono text-[11px] uppercase tracking-wider text-white/70">
                  0{i + 1}
                </span>
                <h3 className="mt-2 text-xl font-semibold leading-tight">{m.name}</h3>
                <p className="mt-1 text-sm text-white/80">
                  {isEn ? m.role_en : m.role_fr}
                </p>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                  <div className="overflow-hidden">
                    <p className="mt-3 text-sm text-white/85 leading-relaxed">
                      {isEn ? m.bio_en : m.bio_fr}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <a href="#" className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur hover:bg-brand-500 transition-colors" aria-label="LinkedIn">
                        <LinkedinIcon className="h-4 w-4" />
                      </a>
                      <a href="#" className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur hover:bg-brand-500 transition-colors" aria-label="Email">
                        <Mail className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <ArrowUpRight className="absolute top-5 right-5 h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-45" />
            </motion.article>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-fg-muted">
          {t("joinUs")} —{" "}
          <a href="/careers" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline underline-offset-4">
            voir nos offres →
          </a>
        </p>
      </div>
    </section>
  );
}
