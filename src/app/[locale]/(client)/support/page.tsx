import { setRequestLocale, getTranslations } from "next-intl/server";
import { LifeBuoy } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ClientSupport({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ClientArea" });
  const session = await auth();
  const userId = session?.user?.id;

  const tickets = userId
    ? await prisma.supportTicket.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      })
    : [];

  return (
    <div className="container-page py-10 md:py-14 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{t("support")}</h1>
        <Button variant="gradient" size="md">
          <LifeBuoy className="h-4 w-4" /> Nouveau ticket
        </Button>
      </div>

      {tickets.length === 0 ? (
        <div className="card-elevated p-10 text-center text-fg-muted">
          Aucun ticket pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((tk) => (
            <div key={tk.id} className="card-elevated p-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-xs text-fg-subtle">{tk.reference}</p>
                <h3 className="font-semibold mt-1">{tk.subject}</h3>
                <p className="mt-1 text-sm text-fg-muted line-clamp-2">{tk.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <Badge tone={tk.status === "RESOLVED" || tk.status === "CLOSED" ? "neutral" : "brand"}>
                  {tk.status}
                </Badge>
                <span className="text-xs text-fg-subtle">{tk.priority}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
