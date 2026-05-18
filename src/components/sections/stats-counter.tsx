"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/animations/animated-counter";
import { siteConfig } from "@/lib/site";

export function StatsCounter() {
  const stats = [
    { value: siteConfig.stats.products,    suffix: "+",  label: "Produits livrés",    note: "Projets digitaux à fort impact" },
    { value: siteConfig.stats.clients,     suffix: "+",  label: "Clients accompagnés", note: "Particuliers, PME et institutions" },
    { value: siteConfig.stats.years,       suffix: "+",  label: "Années d'expertise", note: "Fondée en 2021 à Cotonou" },
    { value: siteConfig.stats.satisfaction, suffix: "%", label: "Satisfaction",       note: "Issue de nos retours clients" },
  ];

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
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-300 mb-10 inline-flex items-center gap-3"
        >
          <span className="h-px w-12 bg-brand-400" />
          Chiffres clés
        </motion.p>

        <div className="grid gap-y-12 md:gap-y-16 md:grid-cols-2 lg:grid-cols-4 md:divide-x divide-fg-on-dark/10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="md:px-8 first:md:pl-0"
            >
              <div className="text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-none text-fg-on-dark">
                <AnimatedCounter to={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-5 text-base font-semibold text-fg-on-dark">{s.label}</p>
              <p className="mt-1.5 text-sm text-fg-on-dark/60 leading-relaxed">{s.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
