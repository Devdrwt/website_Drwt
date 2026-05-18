"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { GradientText } from "./gradient-text";
import { FloatingShapes } from "../animations/floating-shapes";
import { ScrollIndicator } from "../animations/scroll-indicator";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
  scrollHint = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  scrollHint?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section
      ref={ref}
      className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-[var(--bg-muted)] border-b border-[var(--border)]"
    >
      <FloatingShapes />

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

      <motion.div style={{ y, opacity }} className="container-page relative">
        <div className="max-w-4xl">
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow-line mb-5"
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="heading-display text-balance text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-balance text-base md:text-lg text-fg-muted leading-relaxed max-w-2xl"
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

      {scrollHint && <ScrollIndicator />}
    </section>
  );
}

export { GradientText };
