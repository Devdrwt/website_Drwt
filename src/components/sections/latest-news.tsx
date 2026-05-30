import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Section, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma"; 
import type { Article } from "@prisma/client";

export async function LatestNews({ locale }: { locale: string }) {
  const en = locale === "en";

  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: 3,
  });

  if (articles.length === 0) return null;

  return (
    <Section className="bg-bg-muted">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14 md:mb-20">
          <SectionHeader
            className="mb-0"
            eyebrow={en ? "News" : "Actualités"}
            title={
              en ? (
                <>
                  Latest from{" "}
                  <span className="text-brand-600 dark:text-brand-400">Drwintech</span>
                </>
              ) : (
                <>
                  Nos dernières{" "}
                  <span className="text-brand-600 dark:text-brand-400">actualités</span>
                </>
              )
            }
            subtitle={
              en
                ? "Insights, announcements and tech articles from our team."
                : "Insights, annonces et articles tech de notre équipe."
            }
          />
          <Link href="/actualites" className="shrink-0">
            <Button variant="secondary" size="md">
              {en ? "All news" : "Toutes les actualités"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a: Article) => {
            const title = en ? a.title_en : a.title_fr;
            const excerpt = en ? a.excerpt_en : a.excerpt_fr;
            return (
              <Link
                key={a.id}
                href={`/actualites/${a.slug}` as never}
                className="group card-elevated overflow-hidden flex flex-col hover:border-brand-500 transition-colors"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-foreground/5">
                  {a.coverImage ? (
                    <Image
                      src={a.coverImage}
                      alt={title || "Article cover"}
                      fill
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {title}
                  </h3>
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
      </div>
    </Section>
  );
}
