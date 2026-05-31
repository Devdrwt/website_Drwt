"use client";

import { motion } from "framer-motion";
import {
  Code2,
  BookOpen,
  Video,
  Globe,
  Shield,
  Compass,
  Users,
} from "lucide-react";

const expertiseAreas = [
  {
    icon: Code2,
    title_fr: "Développement de solutions digitales sur mesure et intégration de systèmes",
    title_en: "Custom digital solutions development and system integration",
  },
  {
    icon: BookOpen,
    title_fr: "Plateformes e-learning et ingénierie pédagogique numérique",
    title_en: "E-learning platforms and digital pedagogical engineering",
  },
  {
    icon: Video,
    title_fr: "Production audiovisuelle et contenus digitaux",
    title_en: "Audiovisual production and digital content",
  },
  {
    icon: Globe,
    title_fr: "Développement de sites web, portails et plateformes interactives",
    title_en: "Web development, portals and interactive platforms",
  },
  {
    icon: Shield,
    title_fr: "Infogérance, cybersécurité de base et maintenance des systèmes informatiques",
    title_en: "IT management, basic cybersecurity and system maintenance",
  },
  {
    icon: Compass,
    title_fr: "Conseil stratégique en transformation digitale et conduite du changement",
    title_en: "Strategic consulting in digital transformation and change management",
  },
  {
    icon: Users,
    title_fr: "Formation professionnelle et accompagnement institutionnel",
    title_en: "Professional training and institutional support",
  },
];

export function StatsCounter() {
  const isEn = typeof document !== "undefined" && document.documentElement.lang === "en";

  return (
    <section className="relative py-20 md:py-28 bg-foreground text-fg-on-dark overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div aria-hidden className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
      <div aria-hidden className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-brand-700/20 blur-3xl" /> 

      <div className="container-page relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-300 mb-6 inline-flex items-center gap-3">
            <span className="h-px w-12 bg-brand-400" />
            {isEn ? "Areas of expertise" : "Domaines d'expertise"}
          </p>
             
        </motion.div>

        <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {expertiseAreas.map((area, i) => {
            const IconComponent = area.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col items-start gap-4 p-6 rounded-lg border border-fg-on-dark/10 bg-fg-on-dark/5 hover:bg-fg-on-dark/10 hover:border-brand-400/50 transition-all duration-300"
              >
                <div className="p-3 rounded-lg bg-brand-600/20 group-hover:bg-brand-600/30 transition-colors">
                  <IconComponent className="h-6 w-6 text-brand-300 group-hover:text-brand-200" />
                </div>
                <p className="text-sm md:text-base font-semibold text-fg-on-dark leading-snug">
                  {isEn ? area.title_en : area.title_fr}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
