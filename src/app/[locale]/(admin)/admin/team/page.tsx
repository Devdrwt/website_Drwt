import { setRequestLocale } from "next-intl/server";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { AdminPageShell } from "@/components/admin/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteMember } from "@/lib/actions/team";
import { DeleteForm } from "@/components/admin/delete-form";

export default async function AdminTeam({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const members = await prisma.teamMember.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <AdminPageShell
      title="Équipe"
      subtitle="Membres affichés sur la page Équipe."
      actions={
        <Link href={"/admin/team/new" as never}>
          <Button variant="gradient" size="md">
            <Plus className="h-4 w-4" /> Nouveau membre
          </Button>
        </Link>
      }
    >
      {members.length === 0 ? (
        <div className="card-elevated p-10 text-center text-fg-muted">Aucun membre.</div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full">
            <thead className="bg-foreground/[0.03] text-xs uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="text-left p-4">Nom</th>
                <th className="text-left p-4">Rôle</th>
                <th className="text-center p-4">Ordre</th>
                <th className="text-center p-4">Publié</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {members.map((m) => (
                <tr key={m.id} className="text-sm">
                  <td className="p-4 font-medium">{m.name}</td>
                  <td className="p-4 text-fg-muted">{m.role_fr}</td>
                  <td className="p-4 text-center">{m.order}</td>
                  <td className="p-4 text-center">
                    {m.published ? <Badge tone="brand">OK</Badge> : <Badge tone="neutral">brouillon</Badge>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/team/${m.id}` as never}
                        className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline text-xs"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Éditer
                      </Link>
                      <DeleteForm action={deleteMember.bind(null, m.id)} />
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
