import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AdminPageShell } from "@/components/admin/page-shell";
import { ProjectForm } from "@/components/admin/project-form";
import { updateProject } from "@/lib/actions/portfolio";
import { prisma } from "@/lib/prisma";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();
  return (
    <AdminPageShell title={`Éditer · ${project.title_fr}`} backHref="/admin/portfolio">
      <ProjectForm
        action={async (formData) => { "use server"; await updateProject(id, formData); }}
        initial={project}
      />
    </AdminPageShell>
  );
}
