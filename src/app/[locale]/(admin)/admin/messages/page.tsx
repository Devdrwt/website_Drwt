import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/page-shell";
import { MessageRow } from "./row";

export default async function AdminMessages({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <AdminPageShell title="Messages reçus" subtitle={`${messages.length} message(s) au total.`}>
      {messages.length === 0 ? (
        <div className="card-elevated p-10 text-center text-fg-muted">Aucun message.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <MessageRow key={m.id} message={m} />
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}
