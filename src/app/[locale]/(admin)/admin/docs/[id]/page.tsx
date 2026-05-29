import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AdminPageShell } from "@/components/admin/page-shell";
import { DocForm } from "@/components/admin/doc-form";
import { updateDoc } from "@/lib/actions/docs";
import { prisma } from "@/lib/prisma";

export default async function EditDocPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const doc = await prisma.doc.findUnique({ where: { id } });
  if (!doc) notFound();
  return (
    <AdminPageShell title={`Éditer · ${doc.title_fr}`} backHref="/admin/docs">
      <DocForm
        action={async (formData) => { "use server"; await updateDoc(id, formData); }}
        initial={doc}
      />
    </AdminPageShell>
  );
}
