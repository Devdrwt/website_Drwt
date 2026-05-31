import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const doc = await prisma.doc.findUnique({ where: { slug } });
  if (!doc) return {};
  return { title: locale === "en" ? doc.title_en : doc.title_fr };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const en = locale === "en";

  const doc = await prisma.doc.findUnique({ where: { slug } });
  if (!doc || !doc.published) notFound();

  const title = en ? doc.title_en : doc.title_fr;
  const category = en ? doc.category_en : doc.category_fr;
  const content = en ? doc.content_en : doc.content_fr;

  return (
    <article className="pt-32 pb-20 md:pt-40 md:pb-28 bg-[var(--bg)]">
      <div className="container-page max-w-3xl">
        <Link
          href={"/documentation" as never}
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> {en ? "All documentation" : "Toute la documentation"}
        </Link>

        {category && <p className="eyebrow-line mb-4">{category}</p>}

        <h1 className="heading-display text-balance text-3xl md:text-4xl text-foreground">
          {title}
        </h1>

        <div className="mt-10 text-base md:text-lg text-fg-muted leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </div>
    </article>
  );
}
