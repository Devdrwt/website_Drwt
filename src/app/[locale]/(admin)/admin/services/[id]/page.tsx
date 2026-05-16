import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AdminPageShell } from "@/components/admin/page-shell";
import { ServiceForm } from "@/components/admin/service-form";
import { updateService } from "@/lib/actions/services";
import { prisma } from "@/lib/prisma";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <AdminPageShell title={`Éditer · ${service.title_fr}`} backHref="/admin/services">
      <ServiceForm
        action={async (formData) => {
          "use server";
          await updateService(id, formData);
        }}
        initial={service}
      />
    </AdminPageShell>
  );
}
