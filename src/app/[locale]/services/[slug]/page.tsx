import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader, GradientText } from "@/components/ui/page-header";
import { CTA } from "@/components/sections/cta";

const SERVICES = ["consulting", "it-security", "software", "elearning", "media", "web"] as const;

const SLUG_TO_KEY: Record<string, string> = {
  "consulting": "consulting",
  "it-security": "it",
  "software": "software",
  "elearning": "elearning",
  "media": "media",
  "web": "web",
};

const FEATURES: Record<string, string[]> = {
  consulting: ["Audit numérique", "Roadmap stratégique", "Conduite du changement", "Gouvernance data"],
  it: ["Supervision 24/7", "Hardening sécurité", "Sauvegardes managées", "Plans de continuité"],
  software: ["Web apps", "Mobile (React Native)", "APIs REST/GraphQL", "Intégrations ERP/CRM"],
  elearning: ["LMS Moodle/Open edX", "Modules SCORM/xAPI", "Vidéos pédagogiques", "Quiz & évaluations"],
  media: ["Films corporate", "Motion design", "Photo & 360°", "Podcast"],
  web: ["Sites vitrines", "Portails clients", "E-commerce", "Intranets"],
};

export function generateStaticParams() {
  return SERVICES.map((slug) => ({ slug }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const key = SLUG_TO_KEY[slug];
  if (!key) notFound();

  const t = await getTranslations({ locale, namespace: "Services" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const features = FEATURES[key] ?? [];

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={
          <>
            <GradientText>{t(`items.${key}.title`)}</GradientText>
          </>
        }
        subtitle={t(`items.${key}.description`)}
      />

      <section className="py-16 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="prose-like space-y-5 text-base md:text-lg text-fg-muted leading-relaxed">
            <p>{t(`items.${key}.description`)}</p>
            <p>
              Notre approche combine ateliers stratégiques, prototypage rapide et livraisons itératives.
              Chaque mission est pilotée par un binôme senior pour garantir la qualité et la cohérence.
            </p>
            <p>
              Nous documentons chaque livrable, formons vos équipes à l'usage et assurons un support
              post-déploiement pour vous permettre de capitaliser durablement.
            </p>
          </div>

          <aside className="card-elevated p-7">
            <h3 className="font-display text-lg font-semibold mb-5">Inclus dans la mission</h3>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="block mt-6">
              <Button variant="gradient" size="md" className="w-full">
                {t("learnMore")}
              </Button>
            </Link>
          </aside>
        </div>

        <div className="container-page mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {tCommon("back")}
          </Link>
        </div>
      </section>

      <CTA />
    </>
  );
}
