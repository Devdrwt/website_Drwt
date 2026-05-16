"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles, Star } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/ui/gradient-text";
import { siteConfig } from "@/lib/site";

export function Hero() {
  const t = useTranslations("Hero");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden pt-10 pb-28 md:pt-20 md:pb-40"
    >
      {/* Animated background — gradient blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="surface-grid absolute inset-0 opacity-50" aria-hidden />
        <motion.div
          style={{ y }}
          className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,var(--accent-from),transparent_70%)] opacity-50 blur-3xl animate-blob"
          aria-hidden
        />
        <motion.div
          style={{ y }}
          className="absolute top-10 right-[-120px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,var(--accent-via),transparent_70%)] opacity-50 blur-3xl animate-blob [animation-delay:-4s]"
          aria-hidden
        />
        <motion.div
          style={{ y }}
          className="absolute bottom-[-80px] left-1/3 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,var(--accent-to),transparent_70%)] opacity-30 blur-3xl animate-blob [animation-delay:-8s]"
          aria-hidden
        />
      </div>

      <motion.div style={{ opacity }} className="container-page relative">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-fg-muted"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-500" />
            {t("eyebrow")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-balance font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight"
          >
            {t.rich("title", {
              gradient: (chunks) => <GradientText>{chunks}</GradientText>,
            })}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 mx-auto max-w-2xl text-balance text-base sm:text-lg md:text-xl text-fg-muted leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/contact">
              <Button variant="gradient" size="xl" className="font-semibold">
                {t("ctaPrimary")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="xl">
                {t("ctaSecondary")}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex items-center justify-center gap-3 text-sm text-fg-muted"
          >
            <div className="flex -space-x-2">
              {[
                "from-cyan-400 to-blue-600",
                "from-violet-400 to-fuchsia-600",
                "from-emerald-400 to-teal-600",
                "from-orange-400 to-rose-600",
              ].map((g, i) => (
                <span
                  key={i}
                  className={`h-7 w-7 rounded-full ring-2 ring-[var(--bg)] bg-gradient-to-br ${g}`}
                />
              ))}
            </div>
            <span className="flex items-center gap-1.5">
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </span>
              <strong className="font-semibold text-foreground">
                {siteConfig.stats.satisfaction}%
              </strong>
              <span>{t("stats.satisfaction").toLowerCase()}</span>
            </span>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-24 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-3xl overflow-hidden glass-strong"
        >
          {[
            { value: `${siteConfig.stats.products.toLocaleString()}+`, label: t("stats.products") },
            { value: `${siteConfig.stats.clients.toLocaleString()}+`, label: t("stats.clients") },
            { value: `${siteConfig.stats.years}+`, label: t("stats.years") },
            { value: `${siteConfig.stats.satisfaction}%`, label: t("stats.satisfaction") },
          ].map((s) => (
            <div
              key={s.label}
              className="p-6 md:p-8 text-center bg-[var(--bg-elevated)]/60"
            >
              <p className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
                <GradientText>{s.value}</GradientText>
              </p>
              <p className="mt-2 text-xs md:text-sm text-fg-muted">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
