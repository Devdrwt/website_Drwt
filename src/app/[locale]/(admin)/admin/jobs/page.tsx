import { setRequestLocale } from "next-intl/server";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { AdminPageShell } from "@/components/admin/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteJob } from "@/lib/actions/jobs";
import { DeleteForm } from "@/components/admin/delete-form";

export default async function AdminJobs({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jobs = await prisma.jobOpening.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
  });

  return (
    <AdminPageShell
      title="Offres d'emploi"
      subtitle="Gérer les offres affichées sur la page Carrière."
      actions={
        <Link href={"/admin/jobs/new" as never}>
          <Button variant="gradient" size="md">
            <Plus className="h-4 w-4" /> Nouvelle offre
          </Button>
        </Link>
      }
    >
      {jobs.length === 0 ? (
        <div className="card-elevated p-10 text-center text-fg-muted">Aucune offre.</div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full">
            <thead className="bg-foreground/[0.03] text-xs uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="text-left p-4">Titre</th>
                <th className="text-left p-4">Dépt.</th>
                <th className="text-left p-4">Lieu</th>
                <th className="text-center p-4">Candidatures</th>
                <th className="text-center p-4">Publié</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {jobs.map((j) => (
                <tr key={j.id} className="text-sm">
                  <td className="p-4 font-medium">{j.title_fr}</td>
                  <td className="p-4 text-fg-muted">{j.department}</td>
                  <td className="p-4 text-fg-muted">{j.location}{j.remote ? " · Remote" : ""}</td>
                  <td className="p-4 text-center">{j._count.applications}</td>
                  <td className="p-4 text-center">
                    {j.published ? <Badge tone="brand">OK</Badge> : <Badge tone="neutral">brouillon</Badge>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/jobs/${j.id}` as never}
                        className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline text-xs"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Éditer
                      </Link>
                      <DeleteForm action={deleteJob.bind(null, j.id)} />
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
