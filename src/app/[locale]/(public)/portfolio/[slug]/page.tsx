import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  Layers,
  Users,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Section, SectionHeader } from "@/components/ui/section";
import { GradientText } from "@/components/ui/gradient-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DoubleDiamondViz,
  DoubleDiamondPhases,
} from "@/components/double-diamond";
import { ProjectHeroCover } from "@/components/project-hero-cover";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return {};
  return {
    title: locale === "en" ? project.title_en : project.title_fr,
    description: locale === "en" ? project.summary_en : project.summary_fr,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const t = await getTranslations({ locale, namespace: "Portfolio.detail" });
  const tPort = await getTranslations({ locale, namespace: "Portfolio" });

  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project || !project.published) notFound();

  const others = await prisma.project.findMany({
    where: { published: true, slug: { not: slug } },
    orderBy: { updatedAt: "desc" },
    take: 3,
  });

  const title    = isEn ? project.title_en   : project.title_fr;
  const summary  = isEn ? project.summary_en : project.summary_fr;
  const content  = isEn ? project.content_en : project.content_fr;
  const challenge = isEn ? project.challenge_en : project.challenge_fr;

  return (
    <>
      {/* === Hero === */}
      <section className="relative pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden">
        <ProjectHeroCover cover={project.coverImage} />

        <div className="container-page relative">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Link>

          <div className="max-w-3xl">
            <Badge tone="accent" className="mb-6">{tPort(`filters.${project.category.toLowerCase().replace("_", "")}` as never)}</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-white text-balance drop-shadow-sm">
              {title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl">
              {summary}
            </p>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block"
              >
                <Button variant="gradient" size="lg">
                  {t("liveSite")}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>

          {/* Meta grid */}
          <div className="mt-16 grid gap-px rounded-3xl overflow-hidden glass-strong">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)]">
              <MetaCell Icon={Building2} label={t("client")}   value={project.client ?? "—"} />
              <MetaCell Icon={Layers}    label={t("category")} value={project.category} />
              <MetaCell Icon={Calendar}  label={t("duration")} value={project.duration ?? "—"} />
              <MetaCell Icon={Users}     label={t("team")}     value={project.teamSize ? `${project.teamSize} pers.` : "—"} />
            </div>
          </div>
        </div>
      </section>

      {/* === Challenge === */}
      {challenge && (
        <Section className="py-16 md:py-20">
          <div className="container-page max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400 mb-4">
              {t("challenge")}
            </p>
            <p className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold leading-[1.2] tracking-tight text-balance">
              "{challenge}"
            </p>
            {content && (
              <p className="mt-8 text-base md:text-lg text-fg-muted leading-relaxed">
                {content}
              </p>
            )}
          </div>
        </Section>
      )}

      {/* === Méthode : intro double diamant === */}
      <Section className="bg-[var(--bg-muted)]/40 border-y border-[var(--border)] py-20 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="Design Thinking"
            title={
              <>
                <GradientText>{t("method")}</GradientText>
              </>
            }
            subtitle={t.rich("methodIntro", {
              strong: (c) => <strong className="text-foreground">{c}</strong>,
              em: (c) => <em>{c}</em>,
            })}
          />
          <DoubleDiamondViz />
        </div>
      </Section>

      {/* === Les 4 phases === */}
      <Section className="py-20 md:py-28">
        <div className="container-page">
          <DoubleDiamondPhases
            data={{
              discover_fr: project.discover_fr, discover_en: project.discover_en,
              define_fr:   project.define_fr,   define_en:   project.define_en,
              develop_fr:  project.develop_fr,  develop_en:  project.develop_en,
              deliver_fr:  project.deliver_fr,  deliver_en:  project.deliver_en,
            }}
            locale={isEn ? "en" : "fr"}
          />
        </div>
      </Section>

      {/* === Autres projets === */}
      {others.length > 0 && (
        <Section className="bg-[var(--bg-muted)]/40 border-t border-[var(--border)] py-20">
          <div className="container-page">
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8">
              {t("related")}
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.id}
                  href={`/portfolio/${o.slug}` as never}
                  className="group block overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)]"
                >
                  <div
                    className="aspect-[4/3] transition-transform duration-700 group-hover:scale-105"
                    style={{ background: o.coverImage }}
                    aria-hidden
                  />
                  <div className="p-5">
                    <Badge tone="neutral" className="mb-3">{o.category}</Badge>
                    <h3 className="font-display font-semibold leading-tight">{isEn ? o.title_en : o.title_fr}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

    </>
  );
}

function MetaCell({
  Icon,
  label,
  value,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[var(--bg-elevated)]/60 p-5 md:p-6">
      <div className="flex items-center gap-2 text-fg-subtle">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 font-display text-lg font-semibold truncate">{value}</p>
    </div>
  );
}
