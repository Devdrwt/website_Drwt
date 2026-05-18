"use client";

import { motion } from "framer-motion";
import { Children, ReactNode } from "react";

/**
 * Reveals text word-by-word with a mask going up.
 * Wraps each word in an inline-block container with overflow:hidden.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
  staggerChildren = 0.045,
}: {
  text: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren, delayChildren: delay } },
      }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline mr-[0.25em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "120%" },
              visible: { y: "0%", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/**
 * Wraps children inline elements so each one reveals with a mask.
 */
export function MaskReveal({
  children,
  className,
  delay = 0,
  staggerChildren = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren, delayChildren: delay } },
      }}
    >
      {Children.map(children, (child, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "120%" },
              visible: { y: "0%", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            {child}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
