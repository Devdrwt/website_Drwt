"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

/**
 * Immersive, centered authentication shell with an animated background.
 * Used by the sign-in and sign-up pages. No logo by design.
 */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-[var(--bg)] px-5 py-12">
      {/* ---- Animated background ---- */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* Brand gradient wash — vibrant cyan (logo) */}
        <div className="absolute inset-0 bg-[linear-gradient(150deg,var(--brand-950),#0e7ac7_45%,#22d3ee)] opacity-[0.95]" />

        {/* Floating orbs */}
        <motion.div
          className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(34,211,238,.6), transparent 70%)" }}
          animate={{ x: [0, 40, -10, 0], y: [0, -30, 20, 0], scale: [1, 1.12, 0.96, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(6,182,212,.5), transparent 70%)" }}
          animate={{ x: [0, -30, 15, 0], y: [0, 25, -20, 0], scale: [1, 0.94, 1.1, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/3 h-[440px] w-[440px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(22,101,235,.55), transparent 70%)" }}
          animate={{ x: [0, 25, -15, 0], y: [0, -20, 15, 0], scale: [1, 1.08, 0.97, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />

        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)",
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,.45))]" />
      </div>

      {/* ---- Card ---- */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[440px]"
      >
        {/* Glow behind card */}
        <div
          aria-hidden
          className="absolute -inset-4 rounded-[2rem] bg-cyan-400/25 blur-2xl"
        />

        <div className="relative rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Top accent line */}
          <div className="h-1 w-full bg-[linear-gradient(90deg,#22d3ee,#06b6d4,#1683e7)]" />

          <div className="p-8 md:p-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 mb-6">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                {eyebrow}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>

            <div className="mt-7">{children}</div>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                ou
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="mt-5 text-center text-sm text-slate-600">{footer}</div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Drwintech · Espace sécurisé
        </p>
      </motion.div>
    </div>
  );
}
