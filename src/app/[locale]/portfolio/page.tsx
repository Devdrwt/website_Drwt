import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader, GradientText } from "@/components/ui/page-header";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { CTA } from "@/components/sections/cta";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portfolio" });
  return { title: t("eyebrow") };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Portfolio" });

  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  const items = projects.map((p) => ({
    slug: p.slug,
    title: locale === "en" ? p.title_en : p.title_fr,
    summary: locale === "en" ? p.summary_en : p.summary_fr,
    client: p.client ?? "",
    category: p.category,
    coverImage: p.coverImage,
    featured: p.featured,
  }));

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
        subtitle={t("subtitle")}
      />
      <PortfolioGrid items={items} />
      <CTA />
    </>
  );
}
