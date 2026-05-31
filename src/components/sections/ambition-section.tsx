"use client";

import { motion } from "framer-motion";

import { Section } from "@/components/ui/section";

export function AmbitionSection() {
  const isEn = typeof document !== "undefined" && document.documentElement.lang === "en";

  return (
    <Section className="bg-bg">
      <div className="container-page">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-8">
              {isEn ? "Our Ambition" : "Notre ambition"}
            </h2>

            <div className="bg-linear-to-br from-brand-600/10 to-brand-900/10 rounded-xl p-8 md:p-12 border border-brand-600/20">
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                {isEn
                  ? "Actively contribute to the digital transformation of African organizations by offering innovative, accessible and high-impact solutions, while building lasting partnerships."
                  : "Contribuer activement à la transformation digitale des organisations africaines en proposant des solutions innovantes, accessibles et à fort impact, tout en construisant des partenariats durables."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
