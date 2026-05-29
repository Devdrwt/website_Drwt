import { setRequestLocale } from "next-intl/server";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { AdminPageShell } from "@/components/admin/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteArticle } from "@/lib/actions/articles";
import { DeleteForm } from "@/components/admin/delete-form";

export default async function AdminArticles({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <AdminPageShell
      title="Actualités"
      subtitle="Gérer les articles affichés sur la page Actualités."
      actions={
        <Link href={"/admin/articles/new" as never}>
          <Button variant="gradient" size="md">
            <Plus className="h-4 w-4" /> Nouvel article
          </Button>
        </Link>
      }
    >
      {articles.length === 0 ? (
        <div className="card-elevated p-10 text-center text-fg-muted">Aucun article.</div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full">
            <thead className="bg-foreground/[0.03] text-xs uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="text-left p-4">Titre</th>
                <th className="text-left p-4">Catégorie</th>
                <th className="text-center p-4">À la une</th>
                <th className="text-center p-4">Publié</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {articles.map((a) => (
                <tr key={a.id} className="text-sm">
                  <td className="p-4 font-medium">{a.title_fr}</td>
                  <td className="p-4 text-fg-muted">{a.category ?? "—"}</td>
                  <td className="p-4 text-center">{a.featured ? "★" : ""}</td>
                  <td className="p-4 text-center">
                    {a.published ? <Badge tone="brand">OK</Badge> : <Badge tone="neutral">brouillon</Badge>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/articles/${a.id}` as never}
                        className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline text-xs"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Éditer
                      </Link>
                      <DeleteForm action={deleteArticle.bind(null, a.id)} />
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
