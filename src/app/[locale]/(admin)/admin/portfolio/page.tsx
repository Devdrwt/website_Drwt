import { setRequestLocale } from "next-intl/server";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { AdminPageShell } from "@/components/admin/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteProject } from "@/lib/actions/portfolio";
import { DeleteForm } from "@/components/admin/delete-form";

export default async function AdminPortfolio({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <AdminPageShell
      title="Portfolio"
      subtitle="Gérer les réalisations affichées."
      actions={
        <Link href={"/admin/portfolio/new" as never}>
          <Button variant="gradient" size="md">
            <Plus className="h-4 w-4" /> Nouveau projet
          </Button>
        </Link>
      }
    >
      {projects.length === 0 ? (
        <div className="card-elevated p-10 text-center text-fg-muted">Aucun projet.</div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full">
            <thead className="bg-foreground/[0.03] text-xs uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="text-left p-4">Titre</th>
                <th className="text-left p-4">Client</th>
                <th className="text-center p-4">Catégorie</th>
                <th className="text-center p-4">Statut</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {projects.map((p) => (
                <tr key={p.id} className="text-sm">
                  <td className="p-4 font-medium">{p.title_fr}</td>
                  <td className="p-4 text-fg-muted">{p.client ?? "—"}</td>
                  <td className="p-4 text-center"><Badge tone="neutral">{p.category}</Badge></td>
                  <td className="p-4 text-center">
                    {p.featured && <Badge tone="accent" className="mr-1">★</Badge>}
                    {p.published ? <Badge tone="brand">publié</Badge> : <Badge tone="neutral">brouillon</Badge>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-fg-subtle hover:text-foreground">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <Link
                        href={`/admin/portfolio/${p.id}` as never}
                        className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline text-xs"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Éditer
                      </Link>
                      <DeleteForm action={deleteProject.bind(null, p.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPageShell>
  );
}
