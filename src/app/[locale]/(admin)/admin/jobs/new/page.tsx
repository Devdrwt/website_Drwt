import { setRequestLocale } from "next-intl/server";
import { AdminPageShell } from "@/components/admin/page-shell";
import { JobForm } from "@/components/admin/job-form";
import { createJob } from "@/lib/actions/jobs";

export default async function NewJobPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <AdminPageShell title="Nouvelle offre" backHref="/admin/jobs">
      <JobForm action={createJob} />
    </AdminPageShell>
  );
}
