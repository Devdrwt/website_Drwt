import { setRequestLocale } from "next-intl/server";
import { Plus } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProjectsExplorer } from "@/components/internal/projects-explorer";

export default async function InternalProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const rows = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true, slug: true, title_fr: true, summary_fr: true,
      client: true, category: true, status: true, priority: true,
      progress: true, startDate: true, endDate: true, teamSize: true,
      duration: true, coverImage: true, updatedAt: true,
      challenge_fr: true, discover_fr: true, define_fr: true,
      develop_fr: true, deliver_fr: true,
      _count: { select: { resources: true, accesses: true, notes: true, members: true } },
    },
  });

  const projects = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title_fr,
    summary: p.summary_fr,
    client: p.client ?? "—",
    category: p.category,
    status: p.status,
    priority: p.priority,
    progress: p.progress,
    startDate: p.startDate ? p.startDate.toISOString() : null,
    endDate: p.endDate ? p.endDate.toISOString() : null,
    teamSize: p.teamSize ?? p._count.members,
    duration: p.duration,
    coverImage: p.coverImage,
    updatedAt: p.updatedAt.toISOString(),
    phases: {
      challenge: !!p.challenge_fr,
      discover: !!p.discover_fr,
      define: !!p.define_fr,
      develop: !!p.develop_fr,
      deliver: !!p.deliver_fr,
    },
    counts: p._count,
  }));

  return (
    <div className="p-5 md:p-10">
      <header className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            {projects.length} projet{projects.length > 1 ? "s" : ""}
          </p>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-foreground">
            Tous les projets
          </h1>
        </div>
        {isAdmin && (
          <Link
            href={"/admin/portfolio/new" as "/internal"}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouveau projet</span>
          </Link>
        )}
      </header>

      <ProjectsExplorer projects={projects} />
    </div>
  );
}
