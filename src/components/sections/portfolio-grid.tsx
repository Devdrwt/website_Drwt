"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export type PortfolioItem = {
  slug: string;
  title: string;
  summary: string;
  client: string;
  category: "CONSULTING" | "IT_SECURITY" | "SOFTWARE" | "ELEARNING" | "MEDIA" | "WEB";
  coverImage: string;
  featured: boolean;
};

const FILTERS = [
  { key: "all",        match: () => true },
  { key: "web",        match: (c: PortfolioItem["category"]) => c === "WEB" },
  { key: "software",   match: (c: PortfolioItem["category"]) => c === "SOFTWARE" },
  { key: "elearning",  match: (c: PortfolioItem["category"]) => c === "ELEARNING" },
  { key: "media",      match: (c: PortfolioItem["category"]) => c === "MEDIA" },
  { key: "consulting", match: (c: PortfolioItem["category"]) => c === "CONSULTING" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

const CATEGORY_LABEL: Record<PortfolioItem["category"], FilterKey> = {
  WEB: "web",
  SOFTWARE: "software",
  ELEARNING: "elearning",
  MEDIA: "media",
  CONSULTING: "consulting",
  IT_SECURITY: "consulting",
};

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const t = useTranslations("Portfolio");
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    const f = FILTERS.find((x) => x.key === filter)!;
    return items.filter((p) => f.match(p.category));
  }, [items, filter]);

  return (
    <section className="py-16 md:py-24">
      <div className="container-page">
        <div className="mb-12 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "h-10 px-5 rounded-md font-mono text-xs uppercase tracking-[0.12em] transition-all",
                filter === f.key
                  ? "bg-brand-600 text-white"
                  : "border border-[var(--border-strong)] text-fg-muted hover:text-foreground hover:border-brand-500"
              )}
            >
              {t(`filters.${f.key}`)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card-elevated p-12 text-center text-fg-muted">
            Aucun projet dans cette catégorie.
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}
                >
                  <Link
                    href={`/portfolio/${p.slug}` as never}
                    className="group block overflow-hidden card-elevated h-full"
                  >
                    <div
                      className="aspect-[16/11] transition-transform duration-700 group-hover:scale-105"
                      style={{ background: p.coverImage }}
                      aria-hidden
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <Badge tone="brand">{t(`filters.${CATEGORY_LABEL[p.category]}`)}</Badge>
                        <ArrowRight className="h-4 w-4 text-fg-subtle -rotate-45 transition-transform group-hover:rotate-0" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{p.title}</h3>
                      <p className="mt-1 text-xs text-fg-subtle uppercase tracking-wider font-mono">{p.client}</p>
                      <p className="mt-3 text-sm text-fg-muted leading-relaxed line-clamp-2">{p.summary}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
