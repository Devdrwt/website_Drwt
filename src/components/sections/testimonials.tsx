"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Quote, Star } from "lucide-react";

import { Section, SectionHeader } from "@/components/ui/section";

const items = [
  {
    quote: "Drwintech a transformé notre vision en une plateforme robuste et adoptée par tous nos collaborateurs en moins de 3 mois.",
    author: "M. K. Adjogan",
    role: "DSI · Groupe industriel",
    initials: "KA",
  },
  {
    quote: "Une équipe qui livre, qui forme, et qui reste disponible bien après la mise en production. Rare et précieux.",
    author: "S. Dossou",
    role: "Directrice marketing · Banque régionale",
    initials: "SD",
  },
  {
    quote: "Le rendu audiovisuel a dépassé nos attentes. Du storyboard à la diffusion, tout a été pensé.",
    author: "A. Bocco",
    role: "Communication · ONG internationale",
    initials: "AB",
  },
];

export function Testimonials() {
  const t = useTranslations("Testimonials");
  return (
    <Section className="bg-[var(--bg)]">
      <div className="container-page">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t.rich("title", { gradient: (c) => <span className="text-brand-600 dark:text-brand-400">{c}</span> })}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-elevated p-8 flex flex-col gap-6"
            >
              <Quote className="h-7 w-7 text-brand-500" />
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-brand-500 text-brand-500" />
                ))}
              </div>
              <blockquote className="text-base md:text-lg leading-relaxed text-foreground flex-1">
                "{item.quote}"
              </blockquote>
              <figcaption className="pt-5 border-t border-[var(--border)] flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-semibold text-sm">
                  {item.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{item.author}</p>
                  <p className="text-xs text-fg-muted mt-0.5">{item.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </Section>
  );
}
