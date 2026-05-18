"use client";

import { motion } from "framer-motion";

export function ScrollIndicator({ label = "Scroll" }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
        {label}
      </span>
      <span className="block h-10 w-px overflow-hidden">
        <motion.span
          className="block h-1/2 w-full bg-brand-500"
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </motion.div>
  );
}
