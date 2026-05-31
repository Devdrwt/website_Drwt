"use client";

import { motion } from "framer-motion";
import { Heart, Zap, Lightbulb, Users } from "lucide-react";

import { Section } from "@/components/ui/section";

const values = [
  {
    icon: Heart,
    title_fr: "Orientation client",
    title_en: "Client Focus",
    desc_fr: "Nous plaçons les besoins et la réussite de nos clients au cœur de toutes nos actions.",
    desc_en: "We place the needs and success of our clients at the heart of all our actions.",
  },
  {
    icon: Zap,
    title_fr: "Excellence",
    title_en: "Excellence",
    desc_fr: "Nous nous engageons à fournir des solutions de haute qualité, fondées sur l'expertise et la rigueur.",
    desc_en: "We are committed to providing high-quality solutions, based on expertise and rigor.",
  },
  {
    icon: Lightbulb,
    title_fr: "Innovation utile",
    title_en: "Useful Innovation",
    desc_fr: "Nous développons des solutions technologiques concrètes, adaptées aux réalités et aux besoins.",
    desc_en: "We develop concrete technological solutions, adapted to realities and needs.",
  },
  {
    icon: Users,
    title_fr: "Collaboration",
    title_en: "Collaboration",
    desc_fr: "Nous co-construisons avec nos clients des solutions durables, basées sur l'écoute et la confiance.",
    desc_en: "We co-build sustainable solutions with our clients, based on listening and trust.",
  },
];

export function ValuesSection() {
  const isEn = typeof document !== "undefined" && document.documentElement.lang === "en";

  return (
    <Section className="bg-bg-muted">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            {isEn ? "Our Values" : "Nos Valeurs"}
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => {
            const IconComponent = value.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-foreground/5 rounded-xl p-6 md:p-8 border border-border hover:border-brand-600 dark:hover:border-brand-400 transition-colors text-center"
              >
                <IconComponent className="h-10 w-10 text-brand-600 dark:text-brand-400 mx-auto mb-4" />
                <h3 className="font-semibold text-lg md:text-xl text-foreground mb-4">
                  {isEn ? value.title_en : value.title_fr}
                </h3>
                <p className="text-sm md:text-base text-fg-muted leading-relaxed">
                  {isEn ? value.desc_en : value.desc_fr}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
