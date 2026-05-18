"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Rocket, Sparkles, Users, Award, Zap } from "lucide-react";

const milestones = [
  { year: "2021", Icon: Rocket,   title: "Fondation",          desc: "Drwintech est créée à Cotonou avec une vision : démocratiser l'innovation numérique en Afrique de l'Ouest." },
  { year: "2022", Icon: Users,    title: "Premiers grands clients", desc: "10 missions livrées la première année — institutions publiques, banques, PME industrielles." },
  { year: "2023", Icon: Sparkles, title: "Studio multidisciplinaire", desc: "L'équipe s'élargit : ingénieurs, designers, data analysts. Lancement de l'offre IA & Data." },
  { year: "2024", Icon: Award,    title: "500+ clients",       desc: "Cap symbolique franchi. Premiers produits SaaS internes : ZETCHA, Adsgenious." },
  { year: "2025", Icon: Zap,      title: "Push Beyond Today",  desc: "Drwintech consolide sa position de partenaire technologique de référence en Afrique de l'Ouest." },
];

export function JourneyTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-24 md:py-32 bg-[var(--bg)]">
      <div className="container-page">
        <div className="max-w-2xl mb-16">
          <p className="eyebrow-line mb-5">Notre histoire</p>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-foreground">
            Cinq ans <span className="text-brand-600 dark:text-brand-400">d'évolution.</span>
          </h2>
        </div>

        <div ref={ref} className="relative max-w-3xl mx-auto">
          {/* Background line */}
          <div
            aria-hidden
            className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-[var(--border-strong)]"
          />
          {/* Animated progress line */}
          <motion.div
            aria-hidden
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 w-px bg-gradient-to-b from-brand-500 via-brand-600 to-brand-700"
          />

          <ul className="space-y-16 md:space-y-20">
            {milestones.map((m, i) => {
              const Icon = m.Icon;
              const right = i % 2 === 0;
              return (
                <motion.li
                  key={m.year}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative grid md:grid-cols-2 gap-6 md:gap-12 items-center"
                >
                  {/* Node */}
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 200 }}
                    className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10 h-16 w-16 rounded-full bg-[var(--bg)] border-2 border-brand-500 flex items-center justify-center shadow-[0_0_0_8px_var(--bg)]"
                  >
                    <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  </motion.span>

                  {/* Card */}
                  <div className={`pl-24 md:pl-0 ${right ? "md:col-start-2 md:pl-12" : "md:col-start-1 md:pr-12 md:text-right"}`}>
                    <p className="font-mono text-sm font-semibold text-brand-600 dark:text-brand-400 mb-2">
                      — {m.year}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-semibold text-foreground">{m.title}</h3>
                    <p className="mt-3 text-base text-fg-muted leading-relaxed">{m.desc}</p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
