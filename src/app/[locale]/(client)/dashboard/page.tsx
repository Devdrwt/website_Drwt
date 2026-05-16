import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight, FolderKanban, Receipt, LifeBuoy, TrendingUp } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";

export default async function ClientDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ClientArea" });

  const session = await auth();
  const userId = session?.user?.id;

  const [projects, invoices, tickets] = userId
    ? await Promise.all([
        prisma.project.findMany({
          where: { clientUserId: userId },
          take: 4,
          orderBy: { updatedAt: "desc" },
        }),
        prisma.invoice.findMany({
          where: { userId },
          take: 4,
          orderBy: { issuedAt: "desc" },
        }),
        prisma.supportTicket.findMany({
          where: { userId },
          take: 4,
          orderBy: { updatedAt: "desc" },
        }),
      ])
    : [[], [], []];

  return (
    <div className="container-page py-10 md:py-14 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
          {t("welcome", { name: session?.user?.name ?? session?.user?.email ?? "" })}
        </h1>
        <p className="mt-2 text-fg-muted">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard label={t("projects")} value={projects.length} Icon={FolderKanban} href="/projects" />
        <StatCard label={t("invoices")} value={invoices.length} Icon={Receipt} href="/invoices" />
        <StatCard label={t("support")}  value={tickets.length}  Icon={LifeBuoy} href="/support" />
        <StatCard label="Activité" value="↑ 12%" Icon={TrendingUp} href="/dashboard" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={t("projects")} href="/projects">
          {projects.length === 0 ? (
            <Empty label="Aucun projet pour le moment." />
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {projects.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{p.title_fr}</p>
                    <p className="text-xs text-fg-muted">{p.category}</p>
                  </div>
                  <Badge tone="brand">{p.featured ? "Featured" : "Actif"}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title={t("invoices")} href="/invoices">
          {invoices.length === 0 ? (
            <Empty label="Aucune facture." />
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {invoices.map((i) => (
                <li key={i.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-sm truncate">{i.number}</p>
                    <p className="text-xs text-fg-muted">
                      {new Intl.NumberFormat("fr-FR").format(Number(i.amount))} {i.currency}
                    </p>
                  </div>
                  <Badge tone={i.status === "PAID" ? "brand" : "neutral"}>{i.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  Icon,
  href,
}: {
  label: string;
  value: string | number;
  Icon: React.ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <Link
      href={href as "/dashboard"}
      className="card-elevated p-5 group hover:border-brand-500/40 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300">
          <Icon className="h-4 w-4" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-fg-subtle group-hover:text-brand-500 transition-colors" />
      </div>
      <p className="mt-4 text-2xl md:text-3xl font-display font-semibold">{value}</p>
      <p className="text-xs text-fg-muted mt-1">{label}</p>
    </Link>
  );
}

function Panel({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">{title}</h2>
        <Link
          href={href as "/projects"}
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
        >
          Tout voir <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      {children}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <p className="py-6 text-center text-sm text-fg-subtle">{label}</p>
  );
}
