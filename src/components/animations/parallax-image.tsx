"use client";

import { useRef, ReactNode, CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Wraps an image / div so its background translates Y as the user scrolls.
 * Pass `strength` between 0 and 1 (default 0.18).
 */
export function ParallaxImage({
  children,
  strength = 0.18,
  className,
  style,
  innerClassName,
}: {
  children?: ReactNode;
  strength?: number;
  className?: string;
  style?: CSSProperties;
  innerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const move = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${strength * 100}%`, `${strength * 100}%`]
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className ?? ""}`}
      style={style}
    >
      <motion.div
        style={{ y: move, height: `${100 + strength * 200}%`, top: `-${strength * 100}%` }}
        className={`absolute inset-x-0 ${innerClassName ?? ""}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
