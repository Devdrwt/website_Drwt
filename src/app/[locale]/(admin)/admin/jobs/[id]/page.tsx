import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AdminPageShell } from "@/components/admin/page-shell";
import { JobForm } from "@/components/admin/job-form";
import { updateJob } from "@/lib/actions/jobs";
import { prisma } from "@/lib/prisma";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const job = await prisma.jobOpening.findUnique({ where: { id } });
  if (!job) notFound();
  return (
    <AdminPageShell title={`Éditer · ${job.title_fr}`} backHref="/admin/jobs">
      <JobForm
        action={async (formData) => { "use server"; await updateJob(id, formData); }}
        initial={job}
      />
    </AdminPageShell>
  );
}
