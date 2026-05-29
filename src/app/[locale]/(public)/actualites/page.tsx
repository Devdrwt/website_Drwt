import { setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { PageHeader, GradientText } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "News" : "Actualités" };
}

export default async function ActualitesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const en = locale === "en";

  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  return (
    <>
      <PageHeader
        variant="news"
        eyebrow={en ? "News" : "Actualités"}
        title={
          en ? (
            <>
              The latest from <GradientText>Drwintech</GradientText>
            </>
          ) : (
            <>
              Les dernières <GradientText>actualités</GradientText>
            </>
          )
        }
        subtitle={
          en
            ? "Insights, announcements and tech articles from our team."
            : "Insights, annonces et articles tech de notre équipe."
        }
      />

      <section className="py-16 md:py-24 bg-[var(--bg)]">
        <div className="container-page">
          {articles.length === 0 ? (
            <div className="card-elevated p-12 text-center text-fg-muted">
              {en ? "No articles yet." : "Aucun article pour le moment."}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => {
                const title = en ? a.title_en : a.title_fr;
                const excerpt = en ? a.excerpt_en : a.excerpt_fr;
                return (
                  <Link
                    key={a.id}
                    href={`/actualites/${a.slug}` as never}
                    className="group card-elevated overflow-hidden flex flex-col hover:border-brand-500 transition-colors"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-foreground/5">
                      {a.coverImage ? (
                        <img
                          src={a.coverImage}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--brand-600),var(--brand-900))]" />
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {a.category && <Badge tone="brand">{a.category}</Badge>}
                        <span className="font-mono text-[11px] text-fg-subtle">
                          {new Date(a.publishedAt).toLocaleDateString(en ? "en-GB" : "fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {title}
                      </h2>
                      {excerpt && (
                        <p className="mt-2 text-sm text-fg-muted leading-relaxed line-clamp-3">
                          {excerpt}
                        </p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 group-hover:gap-2.5 transition-all">
                        {en ? "Read" : "Lire"}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
