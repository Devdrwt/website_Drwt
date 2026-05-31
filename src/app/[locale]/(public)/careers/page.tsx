import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, MapPin } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { PageHeader, GradientText } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CareersPerks } from "@/components/sections/careers-perks";
import { CareersProcess } from "@/components/sections/careers-process";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });
  return { title: t("eyebrow") };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Careers" });

  const openings = await prisma.jobOpening.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        variant="careers"
        eyebrow={t("eyebrow")}
        title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
        subtitle={t("subtitle")}
      />

      <CareersPerks />

      {/* Open positions */}
      <section className="py-20 md:py-28 bg-[var(--bg)]">
        <div className="container-page">
          <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
            <div>
              <p className="eyebrow-line mb-5">Postes ouverts</p>
              <h2 className="heading-display text-2xl md:text-3xl lg:text-4xl text-foreground">
                {openings.length} opportunités à <span className="text-brand-600 dark:text-brand-400">saisir.</span>
              </h2>
            </div>
            <Link href="/contact">
              <Button variant="outline" size="md">
                {t("spontaneousApplication")} →
              </Button>
            </Link>
          </div>

          {openings.length === 0 ? (
            <div className="card-elevated p-12 text-center text-fg-muted">{t("noOpenings")}</div>
          ) : (
            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {openings.map((o, i) => (
                <Link
                  key={o.slug}
                  href={`/careers/${o.slug}` as never}
                  className="group flex items-center justify-between gap-6 py-6 md:py-8 transition-all hover:pl-3"
                >
                  <div className="flex items-center gap-6 min-w-0">
                    <span className="font-mono text-xs font-semibold text-fg-subtle shrink-0">
                      0{i + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                        {locale === "en" ? o.title_en : o.title_fr}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-fg-muted">
                        <Badge tone="neutral">{o.department}</Badge>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {o.location}
                        </span>
                        <span>· {o.type === "FULL_TIME" ? "CDI" : "Contrat"}</span>
                        {o.remote && <span>· Remote OK</span>}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-fg-subtle group-hover:text-brand-500 group-hover:translate-x-2 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CareersProcess />
    </>
  );
}
