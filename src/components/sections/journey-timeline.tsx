"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { Section } from "@/components/ui/section";

const approachPoints = [
  {
    title_fr: "Une compréhension approfondie et contextualisée des besoins et contraintes métiers",
    title_en: "An in-depth and contextualized understanding of business needs and constraints",
  },
  {
    title_fr: "Une co-construction rigoureuse des solutions en étroite collaboration avec les parties prenantes",
    title_en: "A rigorous co-construction of solutions in close collaboration with stakeholders",
  },
  {
    title_fr: "Un accompagnement couvrant l'intégrality du cycle projet — de la phase de cadrage à la maintenance évolutive",
    title_en: "Support covering the entire project cycle — from the scoping phase to evolutionary maintenance",
  },
  {
    title_fr: "Une capacité d'adaptation éprouvée aux modes d'engagement : forfait, régie ou modèle hybride",
    title_en: "Proven ability to adapt to different engagement models: fixed price, team extension, or hybrid",
  },
];

export function JourneyTimeline() {
  const isEn = typeof document !== "undefined" && document.documentElement.lang === "en";

  return (
    <Section className="bg-bg">
      <div className="container-page">
        <div className="grid gap-16 lg:grid-cols-[2fr_0.8fr] lg:items-center">
          {/* Content — left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1">
            <h5 className="heading-display text-3xl md:text-4xl lg:text-5xl text-foreground text-balance mb-8">
              {isEn ? "Human-Centered Technology" : "L'humain au cœur de la technologie"}
            </h5>

            <div className="space-y-4 mb-8">
              <p className="text-base md:text-lg text-fg-muted leading-relaxed">
                {isEn
                  ? "At DRWINTECH, we adopt a consultative, flexible and resolutely results-oriented approach. Our intervention methodology — proven on demanding commitments — is built on four fundamental pillars:"
                  : "Chez DRWINTECH, nous adoptons une démarche consultative, flexible et résolument orientée résultats. Notre méthodologie d'intervention — éprouvée sur des engagements exigeants — repose sur quatre piliers fondamentaux :"}
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {approachPoints.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex gap-3 items-start"
                >
                  <CheckCircle2 className="h-5 w-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                  <span className="text-base text-fg-muted leading-relaxed">
                    {isEn ? point.title_en : point.title_fr}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="border-t border-border pt-8">
              <p className="text-base md:text-lg text-fg-muted leading-relaxed">
                {isEn
                  ? "We place humans at the heart of technology, convinced that the lasting success of digital projects depends as much on the robustness of solutions as on the commitment and skills development of the teams that carry them."
                  : "Nous plaçons l'humain au cœur de la technologie, convaincus que la réussite durable des projets digitaux repose autant sur la robustesse des solutions que sur l'engagement et la montée en compétences des équipes qui les portent."}
              </p>
            </div>
          </motion.div>

          {/* Image — right on desktop, bottom on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-full overflow-hidden rounded-2xl order-2"
            style={{ aspectRatio: "3/2" }}
          >
            <Image
              src="/images/approach-collaborative.jpeg"
              alt="Notre approche"
              fill
              className="object-cover"
              priority={false}
            />
            {/* Fallback gradient if image not found */}
            <div className="absolute inset-0 bg-linear-to-br from-brand-600/20 to-brand-900/20 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
