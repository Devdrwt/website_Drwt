import { setRequestLocale } from "next-intl/server";
import { AdminPageShell } from "@/components/admin/page-shell";
import { ProjectForm } from "@/components/admin/project-form";
import { createProject } from "@/lib/actions/portfolio";

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <AdminPageShell title="Nouveau projet" backHref="/admin/portfolio">
      <ProjectForm action={createProject} />
    </AdminPageShell>
  );
}
