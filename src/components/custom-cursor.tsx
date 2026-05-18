"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Mode = "default" | "link" | "view" | "drag" | "hidden";

const LABELS: Record<Mode, string> = {
  default: "",
  link:    "",
  view:    "VIEW",
  drag:    "DRAG",
  hidden:  "",
};

export function CustomCursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  const sx = useSpring(x, { stiffness: 500, damping: 35, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 35, mass: 0.4 });

  // Outer ring (delayed)
  const ox = useSpring(x, { stiffness: 120, damping: 18, mass: 0.6 });
  const oy = useSpring(y, { stiffness: 120, damping: 18, mass: 0.6 });

  const [mode, setMode] = useState<Mode>("default");
  const [supports, setSupports] = useState(false);

  useEffect(() => {
    // Only enable on devices with fine pointer (mouse), not touch
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setSupports(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSupports(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!supports) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      // Detect the topmost interactive element under cursor
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!el) {
        setMode("default");
        return;
      }
      // Explicit data-cursor wins
      const dataCursor = el.closest<HTMLElement>("[data-cursor]");
      if (dataCursor) {
        setMode((dataCursor.dataset.cursor as Mode) || "link");
        return;
      }
      // Interactive elements
      if (el.closest("a, button, [role='button'], input, textarea, select, label")) {
        setMode("link");
        return;
      }
      // Images, videos, project covers
      if (el.closest("img, video, [data-media]")) {
        setMode("view");
        return;
      }
      setMode("default");
    };

    const leave = () => setMode("hidden");
    const enter = () => setMode("default");

    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    // Hide the native cursor while ours is active
    document.documentElement.classList.add("custom-cursor-on");

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
      document.documentElement.classList.remove("custom-cursor-on");
    };
  }, [supports, x, y]);

  if (!supports) return null;

  const hidden = mode === "hidden";
  const isLabel = mode === "view" || mode === "drag";
  const isLink = mode === "link";

  return (
    <>
      {/* Outer ring */}
      <motion.div
        aria-hidden
        style={{ x: ox, y: oy }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            width:  isLabel ? 84 : isLink ? 52 : 34,
            height: isLabel ? 84 : isLink ? 52 : 34,
            backgroundColor: isLabel ? "var(--brand-500)" : "transparent",
            borderColor: isLabel ? "var(--brand-500)" : "var(--fg)",
            opacity: hidden ? 0 : isLink ? 0.85 : 0.4,
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-full border flex items-center justify-center font-mono text-[10px] font-bold tracking-wider text-white mix-blend-difference"
        >
          {LABELS[mode]}
        </motion.div>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            scale: hidden ? 0 : isLabel ? 0 : isLink ? 0 : 1,
            opacity: hidden ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="h-2 w-2 rounded-full bg-foreground mix-blend-difference"
        />
      </motion.div>
    </>
  );
}
