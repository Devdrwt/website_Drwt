import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/page-shell";
import { ApplicationRow } from "./row";

export default async function AdminApplications({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const applications = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { job: true },
    take: 200,
  });

  return (
    <AdminPageShell title="Candidatures" subtitle={`${applications.length} candidature(s) reçue(s).`}>
      {applications.length === 0 ? (
        <div className="card-elevated p-10 text-center text-fg-muted">Aucune candidature.</div>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <ApplicationRow key={a.id} application={a} />
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}
