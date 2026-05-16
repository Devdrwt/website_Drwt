"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

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
    <section className="py-12 md:py-16">
      <div className="container-page">
        <div className="mb-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "h-10 px-5 rounded-full text-sm font-medium transition-all",
                filter === f.key
                  ? "bg-foreground text-[var(--bg)] shadow-md"
                  : "border border-[var(--border-strong)] text-fg-muted hover:text-foreground hover:bg-foreground/[0.04]"
              )}
            >
              {t(`filters.${f.key}`)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card-elevated p-10 text-center text-fg-muted">
            Aucun projet dans cette catégorie pour le moment.
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: (i % 6) * 0.04 }}
                >
                  <Link
                    href={`/portfolio/${p.slug}` as never}
                    className="group block overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] hover:border-brand-500/40 transition-colors h-full"
                  >
                    <div
                      className="aspect-[4/3] transition-transform duration-700 group-hover:scale-105"
                      style={{ background: p.coverImage }}
                      aria-hidden
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <Badge tone="brand">{t(`filters.${CATEGORY_LABEL[p.category]}`)}</Badge>
                        <ArrowUpRight className="h-4 w-4 text-fg-subtle transition-transform group-hover:rotate-45" />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold leading-tight">{p.title}</h3>
                      <p className="mt-1 text-sm text-fg-muted">{p.client}</p>
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
