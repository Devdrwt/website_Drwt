import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AdminPageShell } from "@/components/admin/page-shell";
import { TeamForm } from "@/components/admin/team-form";
import { updateMember } from "@/lib/actions/team";
import { prisma } from "@/lib/prisma";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) notFound();
  return (
    <AdminPageShell title={`Éditer · ${member.name}`} backHref="/admin/team">
      <TeamForm
        action={async (formData) => { "use server"; await updateMember(id, formData); }}
        initial={member}
      />
    </AdminPageShell>
  );
}
