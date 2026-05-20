import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Search, Target, Lightbulb, Rocket } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PROJECT_STATUS } from "@/lib/project-status";
import { TrackingEditor } from "@/components/internal/tracking-editor";
import { ResourceManager, AccessManager, NoteManager } from "@/components/internal/managers";
import { cn } from "@/lib/cn";

export default async function InternalProjectDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      resources: { orderBy: { createdAt: "desc" } },
      accesses: { orderBy: { createdAt: "asc" } },
      notes: { orderBy: [{ pinned: "desc" }, { createdAt: "desc" }], include: { author: true } },
      members: { include: { user: true } },
      milestones: { orderBy: { order: "asc" } },
    },
  });

  if (!project) notFound();

  const s = PROJECT_STATUS[project.status];

  const phases = [
    { key: "discover", label: "Discover", tag: "Diverger",  Icon: Search,    body: project.discover_fr },
    { key: "define",   label: "Define",   tag: "Converger", Icon: Target,    body: project.define_fr },
    { key: "develop",  label: "Develop",  tag: "Diverger",  Icon: Lightbulb, body: project.develop_fr },
    { key: "deliver",  label: "Deliver",  tag: "Converger", Icon: Rocket,    body: project.deliver_fr },
  ];

  return (
    <div className="p-5 md:p-10 max-w-6xl">
      {/* Back */}
      <Link
        href="/internal/projects"
        className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-foreground transition-colors mb-5"
      >
        <ArrowLeft className="h-4 w-4" /> Tous les projets
      </Link>

      {/* Header */}
      <header className="relative overflow-hidden rounded-xl mb-6">
        <div className="absolute inset-0" style={{ background: project.coverImage }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative p-6 md:p-8">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider",
              "bg-black/40 backdrop-blur text-white border-white/20"
            )}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-semibold text-white">
            {project.title_fr}
          </h1>
          <p className="mt-1 text-white/80 text-sm">
            {project.client ?? "—"} · {project.category}
            {project.duration ? ` · ${project.duration}` : ""}
          </p>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-white text-foreground text-sm font-semibold hover:bg-white/90"
            >
              <ExternalLink className="h-4 w-4" /> Voir en ligne
            </a>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main column */}
        <div className="space-y-6 min-w-0">
          {/* Double diamond narrative */}
          <section className="card-elevated p-5 md:p-6">
            <h2 className="text-sm font-semibold text-foreground mb-1">
              Présentation — Design Thinking
            </h2>
            <p className="text-xs text-fg-subtle mb-4">
              Le projet structuré selon le double diamant.
            </p>

            {project.challenge_fr && (
              <div className="mb-5 rounded-lg bg-brand-500/[0.06] border border-brand-500/20 p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
                  La problématique
                </p>
                <p className="text-sm text-foreground italic">"{project.challenge_fr}"</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {phases.map((ph) => {
                const Icon = ph.Icon;
                return (
                  <div
                    key={ph.key}
                    className={cn(
                      "rounded-lg border p-4",
                      ph.body
                        ? "border-[var(--border)]"
                        : "border-dashed border-[var(--border-strong)] opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-7 w-7 grid place-items-center rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-300">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground leading-none">{ph.label}</p>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-fg-subtle">{ph.tag}</p>
                      </div>
                    </div>
                    <p className="text-sm text-fg-muted leading-relaxed whitespace-pre-wrap">
                      {ph.body || "Phase non documentée."}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <ResourceManager
            projectId={project.id}
            slug={project.slug}
            isAdmin={isAdmin}
            resources={project.resources.map((r) => ({
              id: r.id, kind: r.kind, category: r.category, label: r.label,
              url: r.url, fileName: r.fileName, fileSize: r.fileSize, note: r.note,
            }))}
          />

          <AccessManager
            projectId={project.id}
            slug={project.slug}
            isAdmin={isAdmin}
            accesses={project.accesses.map((a) => ({
              id: a.id, environment: a.environment, label: a.label,
              url: a.url, credentialHint: a.credentialHint,
            }))}
          />

          <NoteManager
            projectId={project.id}
            slug={project.slug}
            isAdmin={isAdmin}
            notes={project.notes.map((n) => ({
              id: n.id, title: n.title, body: n.body, pinned: n.pinned,
              author: n.author?.name ?? n.author?.email ?? null,
              createdAt: n.createdAt.toISOString(),
            }))}
          />
        </div>

        {/* Side column */}
        <aside className="space-y-6">
          <TrackingEditor
            projectId={project.id}
            slug={project.slug}
            status={project.status}
            priority={project.priority}
            progress={project.progress}
            startDate={project.startDate ? project.startDate.toISOString() : null}
            endDate={project.endDate ? project.endDate.toISOString() : null}
            isAdmin={isAdmin}
          />

          {/* Team */}
          <section className="card-elevated p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Équipe ({project.members.length || project.teamSize || 0})
            </h2>
            {project.members.length === 0 ? (
              <p className="text-sm text-fg-subtle">
                {project.teamSize
                  ? `${project.teamSize} personne(s) — non détaillé.`
                  : "Aucun membre rattaché."}
              </p>
            ) : (
              <ul className="space-y-2">
                {project.members.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
                    <span className="h-8 w-8 grid place-items-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300 text-xs font-semibold">
                      {(m.user.name ?? m.user.email).slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {m.user.name ?? m.user.email}
                      </p>
                      {m.roleLabel && (
                        <p className="text-xs text-fg-subtle">{m.roleLabel}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Milestones */}
          {project.milestones.length > 0 && (
            <section className="card-elevated p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Jalons ({project.milestones.length})
              </h2>
              <ul className="space-y-2">
                {project.milestones.map((m) => (
                  <li key={m.id} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        m.status === "DONE" ? "bg-emerald-500"
                        : m.status === "IN_PROGRESS" ? "bg-brand-500"
                        : m.status === "BLOCKED" ? "bg-rose-500"
                        : "bg-slate-300 dark:bg-slate-600"
                      )}
                    />
                    <span className="text-foreground">{m.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
