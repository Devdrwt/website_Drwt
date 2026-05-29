import { setRequestLocale } from "next-intl/server";
import { AdminPageShell } from "@/components/admin/page-shell";
import { DocForm } from "@/components/admin/doc-form";
import { createDoc } from "@/lib/actions/docs";

export default async function NewDocPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <AdminPageShell title="Nouveau document" backHref="/admin/docs">
      <DocForm action={createDoc} />
    </AdminPageShell>
  );
}
