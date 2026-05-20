import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader, GradientText } from "@/components/ui/page-header";
import { TeamGrid } from "@/components/sections/team-grid";
import { CTA } from "@/components/sections/cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Team" });
  return { title: t("eyebrow") };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Team" });

  return (
    <>
      <PageHeader
        variant="team"
        eyebrow={t("eyebrow")}
        title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
        subtitle={t("subtitle")}
      />
      <TeamGrid />
      <CTA />
    </>
  );
}
