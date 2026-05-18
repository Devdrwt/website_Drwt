"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";

type HItem = {
  slug: string;
  title: string;
  client: string;
  category: string;
  cover: string;
};

const items: HItem[] = [
  { slug: "zetcha",        title: "ZETCHA",        client: "Cartes numériques",       category: "Web",      cover: "linear-gradient(135deg,#06b6d4,#6366f1,#d946ef)" },
  { slug: "hcbe-usa-c",    title: "HCBE USA-C",    client: "Santé + IA",              category: "AI",       cover: "linear-gradient(135deg,#0891b2,#7c3aed,#db2777)" },
  { slug: "adsgenious",    title: "Adsgenious",    client: "Agence marketing",        category: "Analytics",cover: "linear-gradient(135deg,#0ea5e9,#7c3aed,#ec4899)" },
  { slug: "hrh-semca",     title: "HRH SEMCA",     client: "Établissement de santé",  category: "Software", cover: "linear-gradient(135deg,#10b981,#06b6d4,#3b82f6)" },
  { slug: "beeloyalty",    title: "Beeloyalty",    client: "E-commerce",              category: "Mobile",   cover: "linear-gradient(135deg,#f97316,#ec4899,#8b5cf6)" },
  { slug: "fewuproducts",  title: "FEWUPRODUCTS",  client: "Commerce local",          category: "Web",      cover: "linear-gradient(135deg,#16a34a,#0ea5e9,#a855f7)" },
  { slug: "juristouch",    title: "JURISTOUCH",    client: "Cabinet juridique",       category: "Software", cover: "linear-gradient(135deg,#1e3a8a,#0ea5e9,#22d3ee)" },
  { slug: "afropostmedia", title: "Afropostmedia", client: "Média",                   category: "Media",    cover: "linear-gradient(135deg,#ea580c,#dc2626,#7c2d12)" },
];

export function HorizontalProjects() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop ? <DesktopHorizontal /> : <MobileHorizontal />;
}

// ============================================================
// Desktop : scroll-jacking pinned section
// ============================================================
function DesktopHorizontal() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapperRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-87%"]);

  return (
    <section
      ref={wrapperRef}
      className="relative bg-foreground text-fg-on-dark"
      style={{ height: `${items.length * 90}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <Header progress={scrollYProgress} />

        <div className="flex-1 flex items-center overflow-hidden mt-12 md:mt-16">
          <motion.ul
            style={{ x }}
            className="flex gap-6 md:gap-8 pl-6 md:pl-12 pr-[20vw]"
          >
            {items.map((p, i) => (
              <li key={p.slug} className="shrink-0 w-[44vw] xl:w-[38vw]">
                <ProjectCard p={p} index={i} />
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Mobile / Tablet : native horizontal scroll with snap points
// ============================================================
function MobileHorizontal() {
  return (
    <section className="relative bg-foreground text-fg-on-dark py-20 md:py-24">
      <Header />

      <div
        className="mt-10 md:mt-12 overflow-x-auto overflow-y-hidden pb-6 snap-x snap-mandatory"
        style={{ scrollPaddingLeft: "1.25rem" }}
      >
        <ul className="flex gap-4 md:gap-6 pl-5 pr-[20vw] md:pl-10">
          {items.map((p, i) => (
            <li
              key={p.slug}
              className="shrink-0 snap-start w-[80vw] sm:w-[60vw] md:w-[48vw]"
            >
              <ProjectCard p={p} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ============================================================
// Shared header
// ============================================================
function Header({ progress }: { progress?: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  return (
    <div className="container-page pt-20 md:pt-32 shrink-0">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-300 mb-4 inline-flex items-center gap-3">
            <span className="h-px w-12 bg-brand-400" />
            Toutes les réalisations
          </p>
          <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-fg-on-dark text-balance">
            {progress ? "Faites défiler pour explorer" : "Glissez pour explorer"}<br />
            <span className="text-brand-400">nos {items.length} projets phares.</span>
          </h2>
        </div>
        {progress && (
          <div className="hidden md:flex items-center gap-4 text-fg-on-dark/60">
            <span className="font-mono text-xs uppercase tracking-wider">Scroll ↓</span>
            <div className="w-32 h-px bg-fg-on-dark/15 relative overflow-hidden">
              <motion.span
                style={{ scaleX: progress }}
                className="absolute inset-0 origin-left bg-brand-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Shared card
// ============================================================
function ProjectCard({ p, index }: { p: HItem; index: number }) {
  return (
    <Link
      href={`/portfolio/${p.slug}` as never}
      data-cursor="view"
      className="group block relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl"
    >
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
        style={{ background: p.cover }}
        aria-hidden
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,.5) 1px, transparent 0)",
          backgroundSize: "30px 30px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <div className="absolute top-4 md:top-6 left-4 md:left-6">
        <span className="font-mono text-xs md:text-sm font-semibold text-white/80">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
      </div>
      <span className="absolute top-4 md:top-6 right-4 md:right-6 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white group-hover:bg-brand-500 transition-colors">
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10 text-white">
        <Badge tone="light" className="mb-3 md:mb-4">{p.category}</Badge>
        <h3 className="heading-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl">{p.title}</h3>
        <p className="mt-2 md:mt-3 text-sm md:text-base text-white/85 max-w-md line-clamp-2">{p.client}</p>
      </div>
    </Link>
  );
}
