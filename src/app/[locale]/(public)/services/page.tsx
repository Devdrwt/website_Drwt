import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader, GradientText } from "@/components/ui/page-header";
import { ServicesSection } from "@/components/sections/services";
import { ProcessSection } from "@/components/sections/process";
import { StatsCounter } from "@/components/sections/stats-counter";
import { Testimonials } from "@/components/sections/testimonials";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Services" });
  return { title: t("eyebrow") };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Services" });

  return (
    <>
      <PageHeader
        variant="services"
        eyebrow={t("eyebrow")}
        title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
        subtitle={t("subtitle")}
      />
      <ServicesSection />
      <ProcessSection />
      <StatsCounter />
      <Testimonials />
    </>
  );
}
