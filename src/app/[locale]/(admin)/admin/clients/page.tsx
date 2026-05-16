import { setRequestLocale } from "next-intl/server";
import { Mail, Phone, Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/page-shell";
import { Badge } from "@/components/ui/badge";

export default async function AdminClients({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { projects: true, invoices: true, tickets: true } } },
  });

  return (
    <AdminPageShell title="Clients" subtitle={`${clients.length} client(s) enregistré(s).`}>
      {clients.length === 0 ? (
        <div className="card-elevated p-10 text-center text-fg-muted">Aucun client.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {clients.map((c) => (
            <div key={c.id} className="card-elevated p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{c.name ?? c.email}</h3>
                  <p className="text-sm text-fg-muted truncate">
                    <Mail className="inline h-3.5 w-3.5 mr-1" />
                    {c.email}
                  </p>
                  {c.company && (
                    <p className="text-sm text-fg-muted truncate">
                      <Building2 className="inline h-3.5 w-3.5 mr-1" />
                      {c.company}
                    </p>
                  )}
                  {c.phone && (
                    <p className="text-sm text-fg-muted truncate">
                      <Phone className="inline h-3.5 w-3.5 mr-1" />
                      {c.phone}
                    </p>
                  )}
                </div>
                <span className="text-xs text-fg-subtle whitespace-nowrap">
                  {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Badge tone="neutral">{c._count.projects} projet(s)</Badge>
                <Badge tone="neutral">{c._count.invoices} facture(s)</Badge>
                <Badge tone="neutral">{c._count.tickets} ticket(s)</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}
