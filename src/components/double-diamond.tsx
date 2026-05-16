"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Search, Target, Lightbulb, Rocket } from "lucide-react";
import { cn } from "@/lib/cn";

type PhaseKey = "discover" | "define" | "develop" | "deliver";

const PHASES: { key: PhaseKey; Icon: typeof Search }[] = [
  { key: "discover", Icon: Search },
  { key: "define",   Icon: Target },
  { key: "develop",  Icon: Lightbulb },
  { key: "deliver",  Icon: Rocket },
];

export function DoubleDiamondViz() {
  const t = useTranslations("Portfolio.detail");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const dashOffset = useTransform(scrollYProgress, [0, 1], [600, 0]);

  return (
    <div ref={ref} className="relative">
      {/* SVG du double diamant */}
      <div className="relative mx-auto max-w-3xl">
        <svg
          viewBox="0 0 720 220"
          className="w-full h-auto"
          aria-hidden
        >
          <defs>
            <linearGradient id="dd-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="var(--accent-from)" />
              <stop offset="55%"  stopColor="var(--accent-via)" />
              <stop offset="100%" stopColor="var(--accent-to)" />
            </linearGradient>
            <linearGradient id="dd-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="var(--accent-from)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--accent-to)"   stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Diamond 1: Discover → Define (rightProblem) */}
          <motion.path
            d="M20 110 L180 30 L340 110 L180 190 Z"
            fill="url(#dd-fill)"
            stroke="url(#dd-grad)"
            strokeWidth={2}
            strokeDasharray={600}
            style={{ strokeDashoffset: dashOffset }}
          />

          {/* Diamond 2: Develop → Deliver (rightSolution) */}
          <motion.path
            d="M380 110 L540 30 L700 110 L540 190 Z"
            fill="url(#dd-fill)"
            stroke="url(#dd-grad)"
            strokeWidth={2}
            strokeDasharray={600}
            style={{ strokeDashoffset: dashOffset }}
          />

          {/* Phase labels on diamond points */}
          <g className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            <text x="20"  y="105" textAnchor="end"   className="fill-current text-fg-muted text-[11px]">Discover</text>
            <text x="180" y="20"  textAnchor="middle" className="fill-current text-foreground text-[12px]">{t("rightProblem")}</text>
            <text x="340" y="105" textAnchor="middle" className="fill-current text-fg-muted text-[11px]">Define</text>
            <text x="380" y="105" textAnchor="middle" className="fill-current text-fg-muted text-[11px]">Develop</text>
            <text x="540" y="20"  textAnchor="middle" className="fill-current text-foreground text-[12px]">{t("rightSolution")}</text>
            <text x="700" y="105" textAnchor="start"  className="fill-current text-fg-muted text-[11px]">Deliver</text>
          </g>

          {/* Animated dot traveling through both diamonds */}
          <motion.circle
            r={6}
            fill="white"
            stroke="url(#dd-grad)"
            strokeWidth={3}
            initial={{ offsetDistance: "0%" }}
            whileInView={{ offsetDistance: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 4, ease: "easeInOut" }}
            style={{
              offsetPath:
                "path('M20 110 L180 30 L340 110 L380 110 L540 30 L700 110')",
              offsetRotate: "0deg",
            }}
          />
        </svg>
      </div>

      {/* 4 phase chips below */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        {PHASES.map((p, i) => {
          const Icon = p.Icon;
          return (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="inline-flex flex-col items-center gap-2"
            >
              <span
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-[var(--shadow-glow)]",
                  "bg-[linear-gradient(135deg,var(--accent-from),var(--accent-via),var(--accent-to))]"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display font-semibold text-sm">{t(`phases.${p.key}.label`)}</p>
                <p className="text-[10px] uppercase tracking-wider text-fg-subtle">{t(`phases.${p.key}.tag`)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function DoubleDiamondPhases({
  data,
  locale,
}: {
  data: {
    discover_fr: string | null; discover_en: string | null;
    define_fr:   string | null; define_en:   string | null;
    develop_fr:  string | null; develop_en:  string | null;
    deliver_fr:  string | null; deliver_en:  string | null;
  };
  locale: "fr" | "en";
}) {
  const t = useTranslations("Portfolio.detail");

  const phases: {
    key: PhaseKey;
    Icon: typeof Search;
    body: string | null;
    side: "left" | "right";
    diamond: 1 | 2;
  }[] = [
    { key: "discover", Icon: Search,    body: locale === "en" ? data.discover_en : data.discover_fr, side: "left",  diamond: 1 },
    { key: "define",   Icon: Target,    body: locale === "en" ? data.define_en   : data.define_fr,   side: "right", diamond: 1 },
    { key: "develop",  Icon: Lightbulb, body: locale === "en" ? data.develop_en  : data.develop_fr,  side: "left",  diamond: 2 },
    { key: "deliver",  Icon: Rocket,    body: locale === "en" ? data.deliver_en  : data.deliver_fr,  side: "right", diamond: 2 },
  ];

  return (
    <div className="relative">
      {/* Central spine */}
      <div
        aria-hidden
        className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--border-strong)] to-transparent"
      />

      <div className="space-y-10 md:space-y-16">
        {phases.map((p, i) => {
          const Icon = p.Icon;
          const isRight = p.side === "right";
          return (
            <motion.article
              key={p.key}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className={cn(
                "relative grid gap-6 md:gap-10",
                "md:grid-cols-2 md:items-center"
              )}
            >
              {/* Indicator on spine */}
              <span
                aria-hidden
                className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--accent-from),var(--accent-via),var(--accent-to))] text-white shadow-[var(--shadow-glow)] z-10"
              >
                <Icon className="h-4 w-4" />
              </span>

              {/* Content card */}
              <div
                className={cn(
                  "ml-16 md:ml-0 card-elevated p-6 md:p-8",
                  isRight ? "md:col-start-2" : "md:col-start-1 md:text-right"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 mb-3",
                    isRight ? "" : "md:flex-row-reverse"
                  )}
                >
                  <span className="text-3xl font-display font-semibold text-fg-subtle">
                    0{i + 1}
                  </span>
                  <div className={cn(isRight ? "" : "md:text-right")}>
                    <h3 className="font-display text-xl font-semibold">{t(`phases.${p.key}.label`)}</h3>
                    <p className="text-[11px] uppercase tracking-wider text-brand-600 dark:text-brand-400 font-semibold">
                      Diamant {p.diamond} · {t(`phases.${p.key}.tag`)}
                    </p>
                  </div>
                </div>
                <p className="text-sm italic text-fg-subtle mb-4">
                  {t(`phases.${p.key}.hint`)}
                </p>
                {p.body ? (
                  <p className="text-base text-fg-muted leading-relaxed whitespace-pre-wrap">
                    {p.body}
                  </p>
                ) : (
                  <p className="text-sm text-fg-subtle italic">
                    — Phase non documentée pour ce projet.
                  </p>
                )}
              </div>

              {/* Empty side */}
              <div className={cn("hidden md:block", isRight ? "md:col-start-1" : "md:col-start-2")} />
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
