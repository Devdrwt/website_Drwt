import { setRequestLocale } from "next-intl/server";
import { AdminPageShell } from "@/components/admin/page-shell";
import { ServiceForm } from "@/components/admin/service-form";
import { createService } from "@/lib/actions/services";

export default async function NewServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminPageShell title="Nouveau service" backHref="/admin/services">
      <ServiceForm action={createService} />
    </AdminPageShell>
  );
}
