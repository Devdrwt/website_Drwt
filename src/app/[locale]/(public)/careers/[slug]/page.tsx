import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Building2, Clock, Globe2, CheckCircle2 } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, { fr: string; en: string }> = {
  FULL_TIME: { fr: "CDI · Temps plein", en: "Full-time" },
  PART_TIME: { fr: "Temps partiel", en: "Part-time" },
  CONTRACT: { fr: "Contrat", en: "Contract" },
  INTERNSHIP: { fr: "Stage", en: "Internship" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const job = await prisma.jobOpening.findUnique({ where: { slug } });
  if (!job) return {};
  return { title: locale === "en" ? job.title_en : job.title_fr };
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const en = locale === "en";

  const job = await prisma.jobOpening.findUnique({ where: { slug } });
  if (!job || !job.published) notFound();

  const title = en ? job.title_en : job.title_fr;
  const description = en ? job.description_en : job.description_fr;
  const rawRequirements = en ? job.requirements_en : job.requirements_fr;
  const requirements = Array.isArray(rawRequirements)
    ? (rawRequirements as string[])
    : [];
  const typeLabel = TYPE_LABELS[job.type]?.[en ? "en" : "fr"] ?? job.type;

  return (
    <article className="pt-32 pb-20 md:pt-40 md:pb-28 bg-[var(--bg)]">
      <div className="container-page max-w-3xl">
        <Link
          href={"/careers" as never}
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> {en ? "All positions" : "Tous les postes"}
        </Link>

        <Badge tone="neutral">{job.department}</Badge>

        <h1 className="mt-5 heading-display text-balance text-4xl md:text-5xl text-foreground">
          {title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-muted">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="h-4 w-4" /> {job.department}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {typeLabel}
          </span>
          {job.remote && (
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="h-4 w-4" /> {en ? "Remote OK" : "Télétravail possible"}
            </span>
          )}
        </div>

        <div className="mt-10 text-base md:text-lg text-fg-muted leading-relaxed whitespace-pre-line">
          {description}
        </div>

        {requirements.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">
              {en ? "What we're looking for" : "Profil recherché"}
            </h2>
            <ul className="mt-5 space-y-3">
              {requirements.map((req, i) => (
                <li key={i} className="flex gap-3 items-start text-base text-fg-muted leading-relaxed">
                  <CheckCircle2 className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-14 pt-10 border-t border-[var(--border)] flex flex-wrap items-center gap-4">
          <Link href={`/contact?job=${job.slug}` as never}>
            <Button variant="primary" size="lg">
              {en ? "Apply for this role" : "Postuler à cette offre"}
            </Button>
          </Link>
          <Link href={"/careers" as never}>
            <Button variant="outline" size="lg">
              {en ? "See other positions" : "Voir les autres postes"}
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
