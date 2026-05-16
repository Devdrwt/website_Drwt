import { setRequestLocale, getTranslations } from "next-intl/server";
import { Download } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function ClientInvoices({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ClientArea" });
  const session = await auth();
  const userId = session?.user?.id;

  const invoices = userId
    ? await prisma.invoice.findMany({
        where: { userId },
        orderBy: { issuedAt: "desc" },
      })
    : [];

  const fmt = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US");

  return (
    <div className="container-page py-10 md:py-14 max-w-6xl mx-auto">
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-8">
        {t("invoices")}
      </h1>

      {invoices.length === 0 ? (
        <div className="card-elevated p-10 text-center text-fg-muted">
          Aucune facture.
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full">
            <thead className="bg-foreground/[0.03] text-xs uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="text-left p-4">Numéro</th>
                <th className="text-left p-4">Émise le</th>
                <th className="text-right p-4">Montant</th>
                <th className="text-center p-4">Statut</th>
                <th className="text-right p-4">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {invoices.map((i) => (
                <tr key={i.id} className="text-sm">
                  <td className="p-4 font-mono">{i.number}</td>
                  <td className="p-4 text-fg-muted">
                    {new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US").format(i.issuedAt)}
                  </td>
                  <td className="p-4 text-right font-semibold">
                    {fmt.format(Number(i.amount))} {i.currency}
                  </td>
                  <td className="p-4 text-center">
                    <Badge tone={i.status === "PAID" ? "brand" : "neutral"}>{i.status}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    {i.pdfUrl && (
                      <a
                        href={i.pdfUrl}
                        className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
