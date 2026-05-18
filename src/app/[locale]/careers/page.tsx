import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, MapPin, Rocket, Users, Sparkles, Globe2, Heart, Scale } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { PageHeader, GradientText } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CTA } from "@/components/sections/cta";
import { CareersPerks } from "@/components/sections/careers-perks";
import { CareersProcess } from "@/components/sections/careers-process";

const openings = [
  { slug: "chef-projet-digital", title_fr: "Chef·fe de projet digital", title_en: "Digital Project Manager", dept: "Management", location: "Cotonou", type: "FULL_TIME" as const, remote: true },
  { slug: "data-analyst",        title_fr: "Data Analyst",              title_en: "Data Analyst",            dept: "Data",       location: "Cotonou", type: "FULL_TIME" as const, remote: true },
  { slug: "developpeur-mobile",  title_fr: "Développeur·se Mobile",     title_en: "Mobile Developer",        dept: "Engineering",location: "Cotonou", type: "FULL_TIME" as const, remote: true },
  { slug: "ingenieur-logiciel",  title_fr: "Ingénieur·e Logiciel",      title_en: "Software Engineer",       dept: "Engineering",location: "Cotonou", type: "FULL_TIME" as const, remote: true },
  { slug: "devops-engineer",     title_fr: "DevOps Engineer",           title_en: "DevOps Engineer",         dept: "Infrastructure",location: "Cotonou",type: "FULL_TIME" as const, remote: true },
];

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
              <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-foreground">
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
                  href="/careers"
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
                        <Badge tone="neutral">{o.dept}</Badge>
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
      <CTA />
    </>
  );
}
