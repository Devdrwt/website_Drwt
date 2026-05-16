"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const team = [
  { name: "K. Adjogan", role_fr: "CEO & Stratège", role_en: "CEO & Strategist", gradient: "linear-gradient(135deg,#06b6d4,#6366f1)" },
  { name: "F. Dossou",  role_fr: "CTO",            role_en: "CTO",              gradient: "linear-gradient(135deg,#10b981,#3b82f6)" },
  { name: "A. Hounkpati",role_fr: "Lead Designer", role_en: "Lead Designer",    gradient: "linear-gradient(135deg,#f59e0b,#ec4899)" },
  { name: "M. Bocco",   role_fr: "Lead Dev Web",   role_en: "Web Lead",         gradient: "linear-gradient(135deg,#8b5cf6,#d946ef)" },
  { name: "S. Yovo",    role_fr: "Productrice AV", role_en: "Media producer",   gradient: "linear-gradient(135deg,#ef4444,#f97316)" },
  { name: "T. Kone",    role_fr: "Cyber-sécurité", role_en: "Cybersecurity",    gradient: "linear-gradient(135deg,#0ea5e9,#22d3ee)" },
  { name: "L. Mensah",  role_fr: "Conseil",        role_en: "Consultant",       gradient: "linear-gradient(135deg,#14b8a6,#06b6d4)" },
  { name: "R. Akpaki",  role_fr: "Ingénierie pédagogique", role_en: "Pedagogy", gradient: "linear-gradient(135deg,#a855f7,#ec4899)" },
];

export function TeamGrid() {
  const t = useTranslations("Team");
  const locale =
    typeof window !== "undefined" && document.documentElement.lang === "en" ? "en" : "fr";

  return (
    <section className="py-16 md:py-24">
      <div className="container-page">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)]"
            >
              <div
                className="aspect-square transition-transform duration-500 group-hover:scale-105"
                style={{ background: m.gradient }}
                aria-hidden
              >
                <div className="h-full w-full flex items-center justify-center text-white/90 font-display text-5xl font-semibold">
                  {m.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-semibold">{m.name}</h3>
                <p className="mt-0.5 text-sm text-fg-muted">
                  {locale === "en" ? m.role_en : m.role_fr}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-fg-muted">
          {t("joinUs")} —{" "}
          <a href="/careers" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
            careers →
          </a>
        </p>
      </div>
    </section>
  );
}
