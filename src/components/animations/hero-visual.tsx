"use client";

import { motion } from "framer-motion";
import {
  Smartphone, Settings2, Workflow, Brain, ShieldCheck,
} from "lucide-react";

type Variant = "about" | "services" | "portfolio" | "team" | "careers" | "contact";

export function HeroVisual({ variant }: { variant: Variant }) {
  return (
    <div className="relative aspect-square w-full max-w-[460px] mx-auto lg:max-w-[520px]">
      {/* Soft glow behind every variant */}
      <div
        aria-hidden
        className="absolute inset-8 rounded-full bg-brand-500/10 blur-3xl"
      />
      {variant === "about"     && <AboutVisual />}
      {variant === "services"  && <ServicesVisual />}
      {variant === "portfolio" && <PortfolioVisual />}
      {variant === "team"      && <TeamVisual />}
      {variant === "careers"   && <CareersVisual />}
      {variant === "contact"   && <ContactVisual />}
    </div>
  );
}

// ============================================================
// ABOUT — orbital with 4 numbered nodes + connection lines
// ============================================================
function AboutVisual() {
  const radius = 38;        // % distance from center
  const nodes = [0, 1, 2, 3];

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="strokeA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="var(--accent-from)" />
          <stop offset="100%" stopColor="var(--accent-via)" />
        </linearGradient>
        <radialGradient id="fillA" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="var(--brand-500)" stopOpacity="0.20" />
          <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Concentric circles */}
      {[60, 100, 140].map((r, i) => (
        <motion.circle
          key={r}
          cx="200" cy="200" r={r}
          fill="none"
          stroke="var(--border-strong)"
          strokeDasharray="4 6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ scale: { duration: 0.6 }, rotate: { duration: 60 + i * 10, repeat: Infinity, ease: "linear" } }}
          style={{ originX: "200px", originY: "200px" }}
        />
      ))}

      {/* Center mark */}
      <circle cx="200" cy="200" r="36" fill="url(#fillA)" />
      <circle cx="200" cy="200" r="28" fill="var(--bg)" stroke="var(--fg)" strokeWidth="2" />
      <text x="200" y="206" textAnchor="middle" className="fill-current text-foreground font-mono font-bold text-[13px]">DT</text>

      {/* Orbital group with 4 nodes */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ originX: "200px", originY: "200px" }}
      >
        {nodes.map((n) => {
          const angle = (n / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = 200 + Math.cos(angle) * (radius * 4);
          const y = 200 + Math.sin(angle) * (radius * 4);
          return (
            <motion.g key={n}>
              <line
                x1="200" y1="200" x2={x} y2={y}
                stroke="url(#strokeA)" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.5"
              />
              <motion.circle
                cx={x} cy={y} r="22"
                fill="var(--bg-elevated)"
                stroke="var(--brand-500)"
                strokeWidth="2"
                animate={{ r: [22, 26, 22] }}
                transition={{ duration: 2.5, delay: n * 0.4, repeat: Infinity }}
              />
              {/* counter-rotate text */}
              <motion.text
                x={x} y={y + 5} textAnchor="middle"
                className="fill-current text-brand-600 dark:text-brand-300 font-mono font-bold text-[13px]"
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ originX: `${x}px`, originY: `${y}px` }}
              >
                {String(n + 1).padStart(2, "0")}
              </motion.text>
            </motion.g>
          );
        })}
      </motion.g>
    </svg>
  );
}

// ============================================================
// SERVICES — central hex with 5 orbiting service icons
// ============================================================
function ServicesVisual() {
  const services = [
    { Icon: Smartphone, color: "#1fa3ff" },
    { Icon: Settings2,  color: "#6366f1" },
    { Icon: Workflow,   color: "#a855f7" },
    { Icon: Brain,      color: "#ec4899" },
    { Icon: ShieldCheck,color: "#0ea5e9" },
  ];
  return (
    <div className="absolute inset-0">
      {/* Concentric SVG */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        {[80, 130, 180].map((r, i) => (
          <motion.circle
            key={r}
            cx="200" cy="200" r={r}
            fill="none"
            stroke="var(--border-strong)"
            strokeDasharray={i === 1 ? "1 0" : "3 5"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: i * 0.15 }}
          />
        ))}
        <circle cx="200" cy="200" r="180" fill="none" stroke="var(--brand-500)" strokeWidth="1.5" strokeDasharray="2 8" opacity="0.5" />
      </svg>

      {/* Central core */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 360] }}
        transition={{ scale: { duration: 0.6, type: "spring" }, rotate: { duration: 30, repeat: Infinity, ease: "linear" } }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-2xl bg-foreground text-[var(--bg)] flex items-center justify-center font-display text-2xl font-bold shadow-2xl"
      >
        DT
      </motion.div>

      {/* Pulse rings around core */}
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-brand-500"
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 3, delay: i * 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* 5 orbiting service icons */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {services.map((s, i) => {
          const angle = (i / services.length) * Math.PI * 2 - Math.PI / 2;
          const r = 38; // % from center
          const x = 50 + Math.cos(angle) * r;
          const y = 50 + Math.sin(angle) * r;
          const Icon = s.Icon;
          return (
            <motion.div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${y}%`, left: `${x}%` }}
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            >
              <div
                className="h-12 w-12 rounded-xl bg-[var(--bg-elevated)] border-2 flex items-center justify-center shadow-lg"
                style={{ borderColor: s.color, color: s.color }}
              >
                <Icon className="h-5 w-5" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

// ============================================================
// PORTFOLIO — 3 stacked browser mocks with shimmer
// ============================================================
function PortfolioVisual() {
  const mocks = [
    { gradient: "linear-gradient(135deg,#06b6d4,#6366f1,#d946ef)", rotate: -8, offsetX: -20, offsetY:  20, z: 1 },
    { gradient: "linear-gradient(135deg,#10b981,#06b6d4,#3b82f6)", rotate:  0, offsetX:   0, offsetY:   0, z: 3 },
    { gradient: "linear-gradient(135deg,#f97316,#ec4899,#8b5cf6)", rotate:  8, offsetX:  22, offsetY:  18, z: 2 },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {mocks.map((m, i) => (
        <motion.div
          key={i}
          className="absolute w-3/4 aspect-[4/3] rounded-xl overflow-hidden border border-[var(--border-strong)] shadow-2xl"
          style={{ transform: `translate(${m.offsetX}px, ${m.offsetY}px) rotate(${m.rotate}deg)`, zIndex: m.z }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1, scale: 1,
            y: [m.offsetY, m.offsetY - 10, m.offsetY],
          }}
          transition={{
            opacity: { delay: i * 0.15 },
            scale: { delay: i * 0.15 },
            y: { duration: 4, delay: i * 0.6, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {/* Browser bar */}
          <div className="h-6 bg-[var(--bg-elevated)] flex items-center gap-1 px-3 border-b border-[var(--border)]">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            <span className="h-2 w-2 rounded-full bg-green-400" />
          </div>
          <div className="relative flex-1 h-full">
            <div className="absolute inset-0" style={{ background: m.gradient }} />
            <div
              aria-hidden
              className="absolute inset-0 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,.5) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />
            {/* Shimmer */}
            <motion.div
              aria-hidden
              className="absolute inset-y-0 -inset-x-1/2"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent)",
                width: "50%",
              }}
              animate={{ x: ["0%", "300%"] }}
              transition={{ duration: 3, delay: i * 0.7 + 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// TEAM — network graph of 6 avatars connected by lines
// ============================================================
function TeamVisual() {
  // Pre-computed avatar positions (% within 400 viewBox)
  const avatars = [
    { x: 200, y: 80,  i: "ND" },
    { x: 100, y: 160, i: "WH" },
    { x: 300, y: 160, i: "CK" },
    { x: 70,  y: 280, i: "AB" },
    { x: 200, y: 320, i: "SD" },
    { x: 330, y: 280, i: "KO" },
  ];
  // Build all edges
  const edges: [number, number][] = [];
  for (let i = 0; i < avatars.length; i++) {
    for (let j = i + 1; j < avatars.length; j++) {
      // Skip a couple to look less dense
      if ((i + j) % 3 === 0) edges.push([i, j]);
    }
  }
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="strokeT" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="var(--accent-from)" />
          <stop offset="100%" stopColor="var(--accent-to)" />
        </linearGradient>
      </defs>

      {/* Edges */}
      {edges.map(([a, b], i) => {
        const A = avatars[a], B = avatars[b];
        return (
          <motion.line
            key={i}
            x1={A.x} y1={A.y} x2={B.x} y2={B.y}
            stroke="url(#strokeT)" strokeWidth="1.5" opacity="0.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: i * 0.12 }}
          />
        );
      })}

      {/* Avatars */}
      {avatars.map((a, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
          style={{ originX: `${a.x}px`, originY: `${a.y}px` }}
        >
          <motion.circle
            cx={a.x} cy={a.y} r="36"
            fill="var(--bg-elevated)"
            stroke="var(--brand-500)"
            strokeWidth="2"
            animate={{ r: [36, 40, 36] }}
            transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
          />
          <text x={a.x} y={a.y + 5} textAnchor="middle"
                className="fill-current text-foreground font-mono font-bold text-[12px]">
            {a.i}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

// ============================================================
// CAREERS — growing bar chart with floating sparkles
// ============================================================
function CareersVisual() {
  const bars = [
    { h: 35, label: "01" },
    { h: 55, label: "02" },
    { h: 70, label: "03" },
    { h: 95, label: "04" },
  ];
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-3 md:gap-5 p-12">
      {bars.map((b, i) => (
        <div key={i} className="relative flex-1 max-w-[80px] h-full flex flex-col items-center justify-end">
          {/* Bar */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: `${b.h}%`, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.2, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full rounded-t-2xl overflow-hidden"
            style={{
              background: `linear-gradient(180deg, var(--brand-400) 0%, var(--brand-600) 60%, var(--brand-700) 100%)`,
              boxShadow: "0 -8px 24px -10px rgba(31,163,255,0.5)",
            }}
          >
            {/* Inner shine */}
            <motion.div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent"
            />
            {/* Floating sparkle */}
            <motion.span
              aria-hidden
              className="absolute left-1/2 -top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_3px_rgba(255,255,255,0.8)]"
              animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2, delay: i * 0.5 + 1, repeat: Infinity }}
            />
          </motion.div>
          {/* Label */}
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.18 + 0.6 }}
            className="mt-3 font-mono text-xs text-fg-subtle"
          >
            {b.label}
          </motion.span>
        </div>
      ))}
      {/* Arrow rising */}
      <motion.div
        aria-hidden
        className="absolute top-12 right-12 text-brand-500"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7" />
          <path d="M8 7h9v9" />
        </svg>
      </motion.div>
    </div>
  );
}

// ============================================================
// CONTACT — pulsing world dot with concentric waves + paper plane
// ============================================================
function ContactVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Concentric pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute rounded-full border border-brand-500"
          animate={{ scale: [0.5, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 4, delay: i * 1.3, repeat: Infinity, ease: "easeOut" }}
          style={{ width: 80, height: 80 }}
        />
      ))}

      {/* Central globe-like SVG */}
      <svg viewBox="0 0 200 200" className="relative h-48 w-48 z-10">
        <defs>
          <linearGradient id="globeC" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="var(--brand-400)" />
            <stop offset="100%" stopColor="var(--brand-700)" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="60" fill="url(#globeC)" />
        {/* Latitude lines */}
        {[-40, -20, 0, 20, 40].map((y) => (
          <ellipse key={y} cx="100" cy={100 + y} rx="60" ry={y === 0 ? 60 : Math.abs(60 - Math.abs(y) * 0.6)}
                   fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="0.8" />
        ))}
        {/* Vertical line */}
        <ellipse cx="100" cy="100" rx="20" ry="60" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="0.8" />
        {/* Cotonou dot */}
        <circle cx="110" cy="120" r="4" fill="white">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Paper plane orbiting */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="absolute -translate-x-1/2 -translate-y-1/2 text-brand-500"
          style={{ top: "12%", left: "50%", width: 36, height: 36 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          <path
            d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}
