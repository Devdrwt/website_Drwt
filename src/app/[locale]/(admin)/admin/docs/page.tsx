import { setRequestLocale } from "next-intl/server";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { AdminPageShell } from "@/components/admin/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteDoc } from "@/lib/actions/docs";
import { DeleteForm } from "@/components/admin/delete-form";

export default async function AdminDocs({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const docs = await prisma.doc.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <AdminPageShell
      title="Documentation"
      subtitle="Gérer les guides affichés sur la page Documentation."
      actions={
        <Link href={"/admin/docs/new" as never}>
          <Button variant="gradient" size="md">
            <Plus className="h-4 w-4" /> Nouveau document
          </Button>
        </Link>
      }
    >
      {docs.length === 0 ? (
        <div className="card-elevated p-10 text-center text-fg-muted">Aucun document.</div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full">
            <thead className="bg-foreground/[0.03] text-xs uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="text-left p-4">Titre</th>
                <th className="text-left p-4">Catégorie</th>
                <th className="text-center p-4">Ordre</th>
                <th className="text-center p-4">Publié</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {docs.map((d) => (
                <tr key={d.id} className="text-sm">
                  <td className="p-4 font-medium">{d.title_fr}</td>
                  <td className="p-4 text-fg-muted">{d.category_fr ?? "—"}</td>
                  <td className="p-4 text-center text-fg-muted">{d.order}</td>
                  <td className="p-4 text-center">
                    {d.published ? <Badge tone="brand">OK</Badge> : <Badge tone="neutral">brouillon</Badge>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/docs/${d.id}` as never}
                        className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline text-xs"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Éditer
                      </Link>
                      <DeleteForm action={deleteDoc.bind(null, d.id)} />
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
