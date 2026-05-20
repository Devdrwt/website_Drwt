"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Table2,
  KanbanSquare,
  LayoutGrid,
  Search,
  FileText,
  Link2,
  StickyNote,
  Users,
  ArrowRight,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { PROJECT_STATUS, PROJECT_PRIORITY, STATUS_ORDER } from "@/lib/project-status";
import type { ProjectRow } from "./project-types";
import { MiniDiamond } from "./mini-diamond";

type View = "table" | "kanban" | "cards";

const VIEWS: { key: View; label: string; Icon: typeof Table2 }[] = [
  { key: "table",  label: "Tableau", Icon: Table2 },
  { key: "kanban", label: "Kanban",  Icon: KanbanSquare },
  { key: "cards",  label: "Cartes",  Icon: LayoutGrid },
];

export function ProjectsExplorer({ projects }: { projects: ProjectRow[] }) {
  const [view, setView] = useState<View>("table");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (status !== "ALL" && p.status !== status) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q)
      );
    });
  }, [projects, query, status]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un projet ou un client…"
            className="h-11 w-full rounded-md border border-[var(--border-strong)] bg-[var(--bg-elevated)] pl-10 pr-4 text-sm text-foreground placeholder:text-fg-subtle focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/20"
          />
        </div>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 rounded-md border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3 text-sm text-foreground"
        >
          <option value="ALL">Tous les statuts</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>{PROJECT_STATUS[s].label}</option>
          ))}
        </select>

        {/* View switch */}
        <div className="inline-flex rounded-md border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-1 gap-1">
          {VIEWS.map((v) => {
            const Icon = v.Icon;
            return (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 h-9 px-3 rounded text-xs font-medium transition-colors",
                  view === v.key
                    ? "bg-brand-600 text-white"
                    : "text-fg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-fg-subtle mb-4 font-mono">
        {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="card-elevated p-12 text-center text-fg-muted">
          Aucun projet ne correspond à votre recherche.
        </div>
      ) : view === "table" ? (
        <TableView projects={filtered} />
      ) : view === "kanban" ? (
        <KanbanView projects={filtered} />
      ) : (
        <CardsView projects={filtered} />
      )}
    </div>
  );
}

/* ============================================================
   Vue Tableau
   ============================================================ */
function TableView({ projects }: { projects: ProjectRow[] }) {
  return (
    <div className="card-elevated overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-left">
            <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">Projet</th>
            <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-fg-subtle hidden md:table-cell">Statut</th>
            <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-fg-subtle hidden lg:table-cell">Avancement</th>
            <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-fg-subtle hidden xl:table-cell">Doc.</th>
            <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-fg-subtle w-10"></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const s = PROJECT_STATUS[p.status];
            return (
              <tr
                key={p.id}
                className="border-b border-[var(--border)] last:border-0 hover:bg-foreground/[0.03] transition-colors"
              >
                <td className="p-4">
                  <Link href={`/internal/projects/${p.slug}` as "/internal"} className="block group">
                    <p className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {p.title}
                    </p>
                    <p className="text-xs text-fg-subtle mt-0.5">
                      {p.client} · {p.category}
                    </p>
                  </Link>
                  <div className="md:hidden mt-2">
                    <StatusChip status={p.status} />
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <StatusChip status={p.status} />
                  <span className={cn("ml-2 text-[10px] font-mono uppercase", PROJECT_PRIORITY[p.priority].chip)}>
                    {PROJECT_PRIORITY[p.priority].label}
                  </span>
                </td>
                <td className="p-4 hidden lg:table-cell">
                  <div className="flex items-center gap-2 w-40">
                    <div className="h-1.5 flex-1 rounded-full bg-foreground/[0.07] overflow-hidden">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs font-mono text-fg-subtle w-9 text-right">{p.progress}%</span>
                  </div>
                </td>
                <td className="p-4 hidden xl:table-cell">
                  <div className="flex items-center gap-3 text-xs text-fg-subtle">
                    <span className="inline-flex items-center gap-1" title="Ressources">
                      <Link2 className="h-3.5 w-3.5" />{p.counts.resources}
                    </span>
                    <span className="inline-flex items-center gap-1" title="Notes">
                      <StickyNote className="h-3.5 w-3.5" />{p.counts.notes}
                    </span>
                    <span className="inline-flex items-center gap-1" title="Accès">
                      <FileText className="h-3.5 w-3.5" />{p.counts.accesses}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <Link
                    href={`/internal/projects/${p.slug}` as "/internal"}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-subtle hover:bg-foreground/[0.06] hover:text-foreground"
                    aria-label="Ouvrir"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   Vue Kanban
   ============================================================ */
function KanbanView({ projects }: { projects: ProjectRow[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STATUS_ORDER.map((status) => {
        const col = projects.filter((p) => p.status === status);
        const s = PROJECT_STATUS[status];
        return (
          <div key={status} className="w-72 shrink-0">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
              <span className="text-sm font-semibold text-foreground">{s.label}</span>
              <span className="ml-auto font-mono text-xs text-fg-subtle">{col.length}</span>
            </div>
            <div className="space-y-3 min-h-[120px] rounded-xl bg-foreground/[0.02] p-2">
              {col.length === 0 && (
                <p className="text-xs text-fg-subtle text-center py-8">—</p>
              )}
              {col.map((p) => (
                <Link
                  key={p.id}
                  href={`/internal/projects/${p.slug}` as "/internal"}
                  className="block card-elevated p-4 hover:border-brand-500"
                >
                  <p className="font-medium text-foreground text-sm leading-tight">{p.title}</p>
                  <p className="text-xs text-fg-subtle mt-1">{p.client}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-foreground/[0.07] overflow-hidden">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${p.progress}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <MiniDiamond phases={p.phases} className="h-5 w-24" />
                    <span className="font-mono text-[10px] text-fg-subtle">{p.progress}%</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   Vue Cartes design thinking
   ============================================================ */
function CardsView({ projects }: { projects: ProjectRow[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((p, i) => {
        const s = PROJECT_STATUS[p.status];
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: (i % 9) * 0.04 }}
          >
            <Link
              href={`/internal/projects/${p.slug}` as "/internal"}
              className="group block card-elevated overflow-hidden h-full"
            >
              <div className="relative h-28" style={{ background: p.coverImage }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 left-3">
                  <StatusChip status={p.status} onDark />
                </div>
                <span className="absolute bottom-3 right-3 font-mono text-[10px] text-white/80 uppercase tracking-wider">
                  {p.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-fg-subtle mt-0.5">{p.client}</p>
                <p className="mt-2 text-sm text-fg-muted line-clamp-2">{p.summary}</p>

                {/* Double diamond */}
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                      Double diamant
                    </span>
                    <span className="font-mono text-[10px] text-fg-subtle">{p.progress}%</span>
                  </div>
                  <MiniDiamond phases={p.phases} className="h-9 w-full" />
                  <div className="mt-2 grid grid-cols-4 gap-1 text-center">
                    {(["discover", "define", "develop", "deliver"] as const).map((ph) => (
                      <span
                        key={ph}
                        className={cn(
                          "font-mono text-[8px] uppercase tracking-wide",
                          p.phases[ph] ? "text-brand-600 dark:text-brand-400" : "text-fg-subtle/50"
                        )}
                      >
                        {ph}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 text-xs text-fg-subtle">
                  <span className="inline-flex items-center gap-1">
                    <Link2 className="h-3.5 w-3.5" />{p.counts.resources}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <StickyNote className="h-3.5 w-3.5" />{p.counts.notes}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />{p.teamSize}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================================================
   Status chip
   ============================================================ */
function StatusChip({ status, onDark }: { status: ProjectRow["status"]; onDark?: boolean }) {
  const s = PROJECT_STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider",
        onDark
          ? "bg-black/40 backdrop-blur text-white border-white/20"
          : s.chip
      )}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.short}
    </span>
  );
}
