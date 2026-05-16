import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight, MapPin, Rocket, Users, Sparkles, Globe2 } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { PageHeader, GradientText } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CTA } from "@/components/sections/cta";

const openings = [
  { slug: "fullstack-engineer",  title_fr: "Ingénieur·e Full-stack senior", title_en: "Senior Full-stack Engineer",  dept: "Engineering", location: "Cotonou", type: "FULL_TIME" as const, remote: true },
  { slug: "ux-designer",         title_fr: "UX/UI Designer",                title_en: "UX/UI Designer",                dept: "Design",      location: "Cotonou", type: "FULL_TIME" as const, remote: true },
  { slug: "pedagogy-lead",       title_fr: "Lead ingénierie pédagogique",   title_en: "Pedagogy Lead",                 dept: "E-learning",  location: "Cotonou", type: "FULL_TIME" as const, remote: false },
  { slug: "motion-designer",     title_fr: "Motion designer",               title_en: "Motion Designer",               dept: "Media",       location: "Cotonou", type: "CONTRACT" as const,  remote: true },
];

const perks = [
  { key: "growth",  Icon: Sparkles },
  { key: "remote",  Icon: Globe2 },
  { key: "team",    Icon: Users },
  { key: "impact",  Icon: Rocket },
] as const;

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
        eyebrow={t("eyebrow")}
        title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
        subtitle={t("subtitle")}
      />

      <section className="py-12 md:py-16">
        <div className="container-page">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {perks.map((p) => {
              const Icon = p.Icon;
              return (
                <div key={p.key} className="card-elevated p-5">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-semibold text-sm">{t(`perks.${p.key}.title`)}</h4>
                  <p className="mt-1 text-xs text-fg-muted leading-relaxed">
                    {t(`perks.${p.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6">
            {t("perks.title")} — postes ouverts
          </h2>

          {openings.length === 0 ? (
            <div className="card-elevated p-8 text-center text-fg-muted">{t("noOpenings")}</div>
          ) : (
            <div className="space-y-3">
              {openings.map((o) => (
                <Link
                  key={o.slug}
                  href="/careers"
                  className="group flex items-center justify-between gap-6 card-elevated p-5 md:p-6 hover:border-brand-500/50 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-12 w-12 rounded-xl bg-[linear-gradient(135deg,var(--accent-from),var(--accent-via))] grid place-items-center text-white shrink-0">
                      <Rocket className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-semibold text-base md:text-lg truncate">
                        {locale === "en" ? o.title_en : o.title_fr}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-fg-muted">
                        <Badge tone="neutral">{o.dept}</Badge>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {o.location}
                        </span>
                        <span>· {o.type === "FULL_TIME" ? "CDI" : "Contrat"}</span>
                        {o.remote && <span>· Remote OK</span>}
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block shrink-0">
                    <Button variant="outline" size="sm">
                      {t("apply")}
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <ArrowUpRight className="sm:hidden h-4 w-4 text-fg-subtle transition-transform group-hover:rotate-45 shrink-0" />
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/contact">
              <Button variant="ghost" size="md">
                {t("spontaneousApplication")} →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
