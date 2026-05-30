"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

import { Section } from "@/components/ui/section";

const visionPoints = [
  {
    title_fr: "l'amélioration durable de la performance des organisations",
    title_en: "Sustainable improvement of organizational performance",
  },
  {
    title_fr: "le renforcement de l'agilité des systèmes",
    title_en: "Strengthening system agility",
  },
  {
    title_fr: "l'optimisation des processus métiers",
    title_en: "Optimization of business processes",
  },
  {
    title_fr: "l'anticipation des évolutions technologiques",
    title_en: "Anticipation of technological developments",
  },
];

export function CompanyInfo() {
  const isEn = typeof document !== "undefined" && document.documentElement.lang === "en";

  return (
    <Section className="bg-bg-muted">
      <div className="container-page">
        {/* Qui sommes nous */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-8">
            {isEn ? "Who We Are" : "Qui sommes nous"}
          </h2>
          <div className="space-y-6 text-base md:text-lg text-fg-muted leading-relaxed max-w-4xl">
            <p>
              {isEn
                ? "DRWINTECH Inc Benin is a company specializing in information technology consulting and digital transformation of organizations."
                : "DRWINTECH Inc Bénin est une entreprise spécialisée dans le conseil en technologies de l'information et la transformation digitale des organisations."}
            </p>
            <p>
              {isEn
                ? "Founded on November 16, 2020 by Mr. Alexandrin Mahutin Aubin QUENUM, the company supports public institutions, private organizations and entities in the design, development and deployment of innovative digital solutions adapted to local realities."
                : "Fondée le 16 novembre 2020 par Monsieur Alexandrin Mahutin Aubin QUENUM, l'entreprise accompagne les institutions publiques, privées et les organisations dans la conception, le développement et le déploiement de solutions numériques innovantes, adaptées aux réalités locales."}
            </p>
            <p>
              {isEn
                ? "Through an approach combining technological expertise, understanding of business issues and innovation, DRWINTECH has gradually positioned itself as a trusted strategic partner, capable of transforming operational challenges into digital opportunities."
                : "Grâce à une approche alliant expertise technologique, compréhension des enjeux métiers et innovation, DRWINTECH s'est progressivement positionnée comme un partenaire stratégique de confiance, capable de transformer les défis opérationnels en opportunités digitales."}
            </p>
          </div>
        </motion.div>

        {/* Mission & Vision - same section */}
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Notre mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-foreground/5 rounded-xl p-8 md:p-10 border border-border"
          >
            <h3 className="heading-lg text-2xl md:text-3xl text-foreground mb-6">
              {isEn ? "Our Mission" : "Notre mission"}
            </h3>
            <p className="text-base md:text-lg text-fg-muted leading-relaxed">
              {isEn
                ? "Support organizations in the design and implementation of high-performance digital solutions, in order to optimize their processes, strengthen their efficiency and accelerate their digital transformation."
                : "Accompagner les organisations dans la conception et la mise en œuvre de solutions numériques performantes, afin d'optimiser leurs processus, renforcer leur efficacité et accélérer leur transformation digitale."}
            </p>
          </motion.div>

          {/* Notre vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-foreground/5 rounded-xl p-8 md:p-10 border border-border"
          >
            <h3 className="heading-lg text-2xl md:text-3xl text-foreground mb-6">
              {isEn ? "Our Vision" : "Notre vision"}
            </h3>
            <p className="text-base md:text-lg text-fg-muted leading-relaxed mb-6">
              {isEn
                ? "Become a leading player in Africa in the field of digital transformation by offering innovative, accessible and high-impact solutions."
                : "Devenir un acteur de référence en Afrique dans le domaine de la transformation digitale, en proposant des solutions innovantes, accessibles et à fort impact."}
            </p>
            <p className="text-sm md:text-base text-fg-muted font-semibold mb-4">
              {isEn ? "DRWINTECH aims to contribute to:" : "DRWINTECH ambitionne de contribuer à :"}
            </p>
            <ul className="space-y-3">
              {visionPoints.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                  className="flex gap-3 items-start"
                >
                  <CheckCircle2 className="h-5 w-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-fg-muted leading-relaxed">
                    {isEn ? point.title_en : point.title_fr}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
