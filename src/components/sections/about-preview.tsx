"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { Section } from "@/components/ui/section";

const sections = [
  {
    num: "01",
    title_fr: "Qui sommes nous",
    title_en: "Who We Are",
   /* heading_fr: "DRWINTECH INC BÉNIN",
    heading_en: "DRWINTECH INC BENIN",
    subtitle_fr: "Réinventer la transformation digitale au service de la performance.",
    subtitle_en: "Reinventing digital transformation for performance.",*/
    paragraphs_fr: [
      "DRWINTECH Inc Bénin est une entreprise spécialisée dans le conseil en technologies de l'information et la transformation digitale des organisations.",
      "Fondée le 16 novembre 2020 par Monsieur Alexandrin Mahutin Aubin QUENUM, l'entreprise accompagne les institutions publiques, privées et les organisations dans la conception, le développement et le déploiement de solutions numériques innovantes, adaptées aux réalités locales.",
      "Grâce à une approche alliant expertise technologique, compréhension des enjeux métiers et innovation, DRWINTECH s'est progressivement positionnée comme un partenaire stratégique de confiance, capable de transformer les défis opérationnels en opportunités digitales.",
    ],
    paragraphs_en: [
      "DRWINTECH Inc Benin is a company specializing in information technology consulting and digital transformation of organizations.",
      "Founded on November 16, 2020 by Mr. Alexandrin Mahutin Aubin QUENUM, the company supports public institutions, private organizations and entities in the design, development and deployment of innovative digital solutions adapted to local realities.",
      "Through an approach combining technological expertise, understanding of business issues and innovation, DRWINTECH has gradually positioned itself as a trusted strategic partner, capable of transforming operational challenges into digital opportunities.",
    ],
  },
  {
    num: "02",
    title_fr: "Notre mission",
    title_en: "Our Mission",
    desc_fr:
      "Accompagner les organisations dans la conception et la mise en œuvre de solutions numériques performantes, afin d'optimiser leurs processus, renforcer leur efficacité et accélérer leur transformation digitale.",
    desc_en:
      "Support organizations in the design and implementation of high-performance digital solutions, in order to optimize their processes, strengthen their efficiency and accelerate their digital transformation.",
  },
  {
    num: "03",
    title_fr: "Notre vision",
    title_en: "Our Vision",
    desc_fr:
      "Devenir un acteur de référence en Afrique dans le domaine de la transformation digitale, en proposant des solutions innovantes, accessibles et à fort impact.",
    desc_en:
      "Become a leading player in Africa in the field of digital transformation by offering innovative, accessible and high-impact solutions.",
  },
];

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

export function AboutPreview() {
  const isEn = typeof document !== "undefined" && document.documentElement.lang === "en";

  return (
    <Section className="bg-bg-muted">
      <div className="container-page">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_0.7fr] lg:items-center">
          {/* Image — right on desktop, top on mobile */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-16/10 lg:aspect-5/6 overflow-hidden rounded-2xl order-1 lg:order-2">
            <Image
              src="/images/about-drw.jpg"
              alt="Drwintech"
              fill
              className="absolute inset-0 h-full w-full object-cover"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1">
            <div className="mt-12 space-y-8">
              {sections.map((section, i) => (
                <motion.div
                  key={section.num}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <div className="flex gap-5 items-start">
                    <span className="number-marker shrink-0 mt-1">{section.num}</span>
                    <div className="border-l border-border-strong pl-5 flex-1">
                      {section.num === "01" && (
                        <>
                          <p className="eyebrow-line text-sm font-semibold text-brand-600 dark:text-brand-400 mb-3">
                            {isEn ? section.title_en : section.title_fr}
                          </p> 
                          <div className="space-y-4">
                            {(isEn ? section.paragraphs_en : section.paragraphs_fr)?.map((paragraph: string, idx: number) => (
                              <p key={idx} className="text-base md:text-lg text-fg-muted leading-relaxed">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </>
                      )}

                      {section.num !== "01" && (
                        <>
                          <h4 className="font-semibold text-lg text-foreground mb-3">
                            {isEn ? section.title_en : section.title_fr}
                          </h4>
                          <p className="text-base text-fg-muted leading-relaxed mb-4">
                            {isEn ? section.desc_en : section.desc_fr}
                          </p>

                          {section.num === "03" && (
                            <div className="ml-0 mt-4">
                              <p className="text-sm font-semibold text-fg-muted mb-3">
                                {isEn
                                  ? "DRWINTECH aims to contribute to:"
                                  : "DRWINTECH ambitionne de contribuer à :"}
                              </p>
                              <ul className="space-y-2">
                                {visionPoints.map((point, idx) => (
                                  <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -8 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: 0.1 + idx * 0.04 }}
                                    className="flex gap-2 items-start"
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0 mt-1" />
                                    <span className="text-sm text-fg-muted leading-relaxed">
                                      {isEn ? point.title_en : point.title_fr}
                                    </span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
