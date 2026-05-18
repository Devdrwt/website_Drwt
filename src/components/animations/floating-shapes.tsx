"use client";

import { motion } from "framer-motion";

export function FloatingShapes({ density = "default" }: { density?: "default" | "intense" }) {
  const shapes =
    density === "intense"
      ? [
          { type: "circle", size: 480, x: "-12%", y: "0%",  color: "from-brand-500/30",  delay: 0,   dur: 22 },
          { type: "circle", size: 560, x: "70%",  y: "-10%", color: "from-brand-600/25",  delay: 3,   dur: 28 },
          { type: "circle", size: 420, x: "40%",  y: "60%", color: "from-brand-400/20",  delay: 6,   dur: 26 },
          { type: "circle", size: 280, x: "85%",  y: "70%", color: "from-brand-700/30",  delay: 1.5, dur: 24 },
        ]
      : [
          { type: "circle", size: 440, x: "-8%",  y: "5%",  color: "from-brand-500/22", delay: 0, dur: 26 },
          { type: "circle", size: 520, x: "75%",  y: "-5%", color: "from-brand-600/18", delay: 4, dur: 30 },
        ];

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={`absolute rounded-full bg-radial-gradient blur-3xl bg-gradient-radial ${s.color} to-transparent`}
          style={{
            width: s.size,
            height: s.size,
            left: s.x,
            top: s.y,
            background: `radial-gradient(closest-side, var(--brand-500), transparent 70%)`,
            opacity: 0.25,
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: [0.9, 1.1, 0.95, 1],
            opacity: [0, 0.35, 0.25, 0.3],
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
          }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
