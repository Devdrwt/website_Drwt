"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Quote, Star } from "lucide-react";

import { Section, SectionHeader } from "@/components/ui/section";
import { GradientText } from "@/components/ui/gradient-text";

const items = [
  {
    quote:
      "Drwintech a transformé notre vision en une plateforme robuste et adoptée par tous nos collaborateurs en moins de 3 mois.",
    author: "M. K. Adjogan",
    role: "DSI · Groupe industriel",
  },
  {
    quote:
      "Une équipe qui livre, qui forme, et qui reste disponible bien après la mise en production. Rare et précieux.",
    author: "S. Dossou",
    role: "Directrice marketing · Banque régionale",
  },
  {
    quote:
      "Le rendu audiovisuel a dépassé nos attentes. Du storyboard à la diffusion, tout a été pensé.",
    author: "A. Bocco",
    role: "Communication · ONG internationale",
  },
];

export function Testimonials() {
  const t = useTranslations("Testimonials");
  return (
    <Section className="surface-grid relative">
      <div className="container-page">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
        />

        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-elevated p-7 relative"
            >
              <Quote className="absolute -top-3 left-6 h-7 w-7 text-brand-500 fill-brand-500/20" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-base leading-relaxed text-foreground">
                "{item.quote}"
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-[var(--border)]">
                <p className="font-semibold text-sm">{item.author}</p>
                <p className="text-xs text-fg-muted mt-0.5">{item.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </Section>
  );
}
