"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { GradientText } from "./gradient-text";
import { ScrollIndicator } from "../animations/scroll-indicator";

type Variant = "about" | "services" | "portfolio" | "team" | "careers" | "contact";

const BACKGROUNDS: Record<Variant, { src: string; credit: string }> = {
  about:     { src: "/images/heroes/hero-about.jpg",     credit: "Unsplash · lZqmEhe2if4" },
  services:  { src: "/images/heroes/hero-services.jpg",  credit: "Unsplash · OqtafYT5kTw" },
  portfolio: { src: "/images/heroes/hero-portfolio.jpg", credit: "Unsplash · KDMsC1xglWs" },
  team:      { src: "/images/heroes/hero-team.jpg",      credit: "Unsplash · glRqyWJgUeY" },
  careers:   { src: "/images/heroes/hero-careers.jpg",   credit: "Unsplash · pfR18JNEMv8" },
  contact:   { src: "/images/heroes/hero-contact.jpg",   credit: "Unsplash · m2pxgGc1Yas" },
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
  scrollHint = true,
  variant,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  scrollHint?: boolean;
  variant?: Variant;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  const bg = variant ? BACKGROUNDS[variant] : null;
  const hasImage = !!bg;

  return (
    <section
      ref={ref}
      className={`relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden border-b border-[var(--border)] ${
        hasImage ? "bg-foreground" : "bg-[var(--bg-muted)]"
      }`}
      style={hasImage ? { minHeight: "70vh" } : undefined}
    >
      {/* Image background with parallax + zoom */}
      {hasImage && bg && (
        <motion.div
          style={{ y: yBg, scale }}
          aria-hidden
          className="absolute inset-0 -z-10"
        >
          <img
            src={bg.src}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
          {/* Color grading + readability overlays */}
          <div className="absolute inset-0 bg-foreground/50" />
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/40 via-transparent to-brand-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />
          {/* Subtle grid texture on top */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </motion.div>
      )}

      {/* Fallback subtle grid for headers without image */}
      {!hasImage && (
        <motion.div
          style={{ y, opacity }}
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(var(--border-strong) 1px, transparent 1px), linear-gradient(90deg, var(--border-strong) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              maskImage:
                "radial-gradient(ellipse 75% 60% at 50% 0%, #000 30%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 60% at 50% 0%, #000 30%, transparent 80%)",
            }}
          />
        </motion.div>
      )}

      <motion.div style={{ y, opacity }} className="container-page relative">
        <div className="max-w-4xl">
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`mb-5 inline-flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] ${
                hasImage ? "text-brand-300" : "text-brand-700 dark:text-brand-300"
              }`}
            >
              <span className={`h-px w-12 ${hasImage ? "bg-brand-300" : "bg-current"}`} />
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`heading-display text-balance text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${
              hasImage ? "text-white drop-shadow-md" : "text-foreground"
            }`}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`mt-6 text-balance text-base md:text-lg leading-relaxed max-w-2xl ${
                hasImage ? "text-white/85" : "text-fg-muted"
              }`}
            >
              {subtitle}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10"
            >
              {children}
            </motion.div>
          )}
        </div>
      </motion.div>

      {scrollHint && <ScrollIndicator label={hasImage ? "Scroll" : "Scroll"} />}

      {/* Photo credit small print */}
      {hasImage && bg && (
        <span className="absolute bottom-3 right-4 text-[9px] font-mono text-white/40 uppercase tracking-wider">
          Photo : {bg.credit}
        </span>
      )}
    </section>
  );
}

export { GradientText };
