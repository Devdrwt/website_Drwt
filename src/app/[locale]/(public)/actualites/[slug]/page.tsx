import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return {};
  return { title: locale === "en" ? article.title_en : article.title_fr };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const en = locale === "en";

  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || !article.published) notFound();

  const title = en ? article.title_en : article.title_fr;
  const content = en ? article.content_en : article.content_fr;

  return (
    <article className="pt-32 pb-20 md:pt-40 md:pb-28 bg-[var(--bg)]">
      <div className="container-page max-w-3xl">
        <Link
          href={"/actualites" as never}
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> {en ? "All news" : "Toutes les actualités"}
        </Link>

        <div className="flex items-center gap-3 mb-5">
          {article.category && <Badge tone="brand">{article.category}</Badge>}
          <span className="font-mono text-[11px] text-fg-subtle">
            {new Date(article.publishedAt).toLocaleDateString(en ? "en-GB" : "fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <h1 className="heading-display text-balance text-4xl md:text-5xl text-foreground">
          {title}
        </h1>
        {article.author && (
          <p className="mt-4 text-sm text-fg-muted">{en ? "By" : "Par"} {article.author}</p>
        )}

        {article.coverImage && (
          <img
            src={article.coverImage}
            alt=""
            className="mt-10 w-full rounded-2xl object-cover aspect-[16/9]"
          />
        )}

        <div className="mt-10 text-base md:text-lg text-fg-muted leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </div>
    </article>
  );
}
