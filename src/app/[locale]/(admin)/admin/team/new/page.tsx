import { setRequestLocale } from "next-intl/server";
import { AdminPageShell } from "@/components/admin/page-shell";
import { TeamForm } from "@/components/admin/team-form";
import { createMember } from "@/lib/actions/team";

export default async function NewMemberPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <AdminPageShell title="Nouveau membre" backHref="/admin/team">
      <TeamForm action={createMember} />
    </AdminPageShell>
  );
}
