"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ProjectHeroCover({ cover }: { cover: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <div
      ref={ref}
      className="absolute inset-x-0 top-0 h-[620px] -z-10 overflow-hidden"
      aria-hidden
    >
      <motion.div
        style={{ y, scale, background: cover }}
        className="absolute inset-0 origin-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg)]/40 to-[var(--bg)]" />
    </div>
  );
}
