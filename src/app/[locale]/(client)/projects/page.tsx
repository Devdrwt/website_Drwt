import { setRequestLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function ClientProjects({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ClientArea" });
  const session = await auth();
  const userId = session?.user?.id;

  const projects = userId
    ? await prisma.project.findMany({
        where: { clientUserId: userId },
        orderBy: { updatedAt: "desc" },
        include: { milestones: true },
      })
    : [];

  return (
    <div className="container-page py-10 md:py-14 max-w-6xl mx-auto">
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-8">
        {t("projects")}
      </h1>

      {projects.length === 0 ? (
        <div className="card-elevated p-10 text-center text-fg-muted">
          Aucun projet pour l'instant.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => {
            const done = p.milestones.filter((m) => m.status === "DONE").length;
            const total = p.milestones.length || 1;
            const pct = Math.round((done / total) * 100);
            return (
              <div key={p.id} className="card-elevated p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-display font-semibold">{p.title_fr}</h3>
                  <Badge tone="brand">{p.category}</Badge>
                </div>
                <p className="text-sm text-fg-muted mb-4">{p.summary_fr}</p>
                <div className="h-2 rounded-full bg-foreground/[0.05] overflow-hidden">
                  <div
                    className="h-full bg-[linear-gradient(90deg,var(--accent-from),var(--accent-via),var(--accent-to))]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-fg-subtle">{pct}% complété · {done}/{total} jalons</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
