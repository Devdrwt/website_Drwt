"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

type Slide = {
  video: string;
  poster?: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
};

export function Hero() {
  const t = useTranslations("Hero");
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides: Slide[] = [
    {
      video: "/videos/hero-portrait.mp4",
      eyebrow: "Push Beyond Today",
      title: (
        <>
          Solutions digitales<br />
          <em className="not-italic text-brand-400">qui transforment</em><br />
          votre entreprise.
        </>
      ),
      subtitle:
        "Nous concevons, développons et déployons des plateformes web, mobiles et IA sur mesure pour les organisations exigeantes.",
    },
    {
      video: "/videos/hero-circuit.mp4",
      eyebrow: "Intelligence Artificielle · Data",
      title: (
        <>
          La donnée et l'IA<br />
          <em className="not-italic text-brand-400">au service</em><br />
          de votre performance.
        </>
      ),
      subtitle:
        "De la stratégie data à la mise en production de modèles ML, nous transformons vos données en avantage compétitif.",
    },
    {
      video: "/videos/hero-cpu.mp4",
      eyebrow: "Cybersécurité · Infrastructure",
      title: (
        <>
          Sécurisons<br />
          <em className="not-italic text-brand-400">votre infrastructure</em><br />
          informatique.
        </>
      ),
      subtitle:
        "Audit, hardening, supervision 24/7, plans de continuité. Une approche pragmatique de la cybersécurité.",
    },
  ];

  const next = () => setIdx((i) => (i + 1) % slides.length);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    timer.current = setInterval(next, 8000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const slide = slides[idx];

  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden flex items-end pb-20 md:pb-28">
      {/* Background video carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 -z-10"
        >
          <video
            key={slide.video}
            src={slide.video}
            autoPlay
            muted
            loop
            playsInline
            poster={slide.poster}
            className="absolute inset-0 h-full w-full object-cover kenburns-img"
            aria-hidden
          />
          <div className="hero-overlay" />
        </motion.div>
      </AnimatePresence>

      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 -z-[5] opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container-wide relative w-full">
        <div className="max-w-3xl text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Eyebrow with line */}
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <span className="h-px w-12 bg-brand-400" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-200">
                  {slide.eyebrow}
                </span>
              </div>

              <h1 className="heading-mega text-white text-balance">{slide.title}</h1>

              <p className="mt-8 max-w-2xl text-base md:text-lg lg:text-xl text-white/85 leading-relaxed">
                {slide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link href="/contact">
              <Button variant="primary" size="lg">
                {t("ctaPrimary")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:border-white hover:text-white"
              >
                <Play className="h-4 w-4" />
                {t("ctaSecondary")}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Carousel controls (bottom) */}
        <div className="mt-16 md:mt-24 flex items-end justify-between gap-6">
          {/* Slide indicators */}
          <div className="flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={`relative h-0.5 rounded-full transition-all duration-300 ${
                  i === idx ? "w-16 bg-white" : "w-8 bg-white/40 hover:bg-white/60"
                }`}
              >
                {i === idx && (
                  <motion.span
                    key={idx}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 8, ease: "linear" }}
                    className="absolute inset-y-0 left-0 origin-left bg-brand-400 rounded-full w-full"
                  />
                )}
              </button>
            ))}
            <span className="ml-3 font-mono text-xs text-white/60">
              {String(idx + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="h-11 w-11 inline-flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/15 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="h-11 w-11 inline-flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/15 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
