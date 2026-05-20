import { setRequestLocale } from "next-intl/server";
import { FolderKanban, FileText, Link2, Users, ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PROJECT_STATUS, STATUS_ORDER } from "@/lib/project-status";

export default async function InternalOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();

  const [projects, resourceCount, accessCount, noteCount, recent] =
    await Promise.all([
      prisma.project.findMany({ select: { status: true, progress: true } }),
      prisma.projectResource.count(),
      prisma.projectAccess.count(),
      prisma.projectNote.count(),
      prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
        take: 6,
        select: {
          id: true, slug: true, title_fr: true, status: true,
          progress: true, client: true, updatedAt: true,
        },
      }),
    ]);

  const byStatus = STATUS_ORDER.map((s) => ({
    status: s,
    count: projects.filter((p) => p.status === s).length,
  }));
  const activeCount = projects.filter((p) => p.status === "ACTIVE").length;
  const avgProgress =
    projects.length === 0
      ? 0
      : Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length);

  return (
    <div className="p-5 md:p-10 max-w-6xl">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
          Espace interne
        </p>
        <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-foreground">
          Bonjour {(session?.user?.name ?? "").split(" ")[0] || "👋"}
        </h1>
        <p className="mt-1 text-fg-muted">
          Vue d'ensemble de tous les projets Drwintech, leur avancement et leur documentation.
        </p>
      </header>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <KpiTile Icon={FolderKanban} value={projects.length} label="Projets" />
        <KpiTile Icon={FileText}     value={`${avgProgress}%`} label="Avancement moyen" />
        <KpiTile Icon={Link2}        value={resourceCount + accessCount} label="Ressources & accès" />
        <KpiTile Icon={Users}        value={noteCount} label="Notes & comptes-rendus" />
      </div>

      {/* Status breakdown */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-foreground mb-3">Répartition par statut</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {byStatus.map(({ status, count }) => {
            const s = PROJECT_STATUS[status];
            return (
              <div key={status} className="card-elevated p-4">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                    {s.label}
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-foreground">{count}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent projects */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Activité récente</h2>
          <Link
            href="/internal/projects"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Tous les projets <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="card-elevated divide-y divide-[var(--border)]">
          {recent.length === 0 && (
            <p className="p-6 text-center text-sm text-fg-subtle">Aucun projet pour le moment.</p>
          )}
          {recent.map((p) => {
            const s = PROJECT_STATUS[p.status];
            return (
              <Link
                key={p.id}
                href={`/internal/projects/${p.slug}` as "/internal"}
                className="flex items-center gap-4 p-4 hover:bg-foreground/[0.03] transition-colors"
              >
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${s.dot}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{p.title_fr}</p>
                  <p className="text-xs text-fg-subtle truncate">
                    {p.client ?? "—"} · {s.label}
                  </p>
                </div>
                <div className="w-28 shrink-0 hidden sm:block">
                  <div className="h-1.5 rounded-full bg-foreground/[0.07] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] font-mono text-fg-subtle text-right">
                    {p.progress}%
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-fg-subtle shrink-0" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function KpiTile({
  Icon,
  value,
  label,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
}) {
  return (
    <div className="card-elevated p-4 md:p-5">
      <Icon className="h-5 w-5 text-brand-500" />
      <p className="mt-3 text-2xl md:text-3xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-fg-muted mt-0.5">{label}</p>
    </div>
  );
}
