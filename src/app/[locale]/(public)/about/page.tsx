import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader, GradientText } from "@/components/ui/page-header";
import { AboutPreview } from "@/components/sections/about-preview";
import { StatsCounter } from "@/components/sections/stats-counter";
import { JourneyTimeline } from "@/components/sections/journey-timeline";
import { Testimonials } from "@/components/sections/testimonials";
import { LogosMarquee } from "@/components/sections/logos-marquee";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("eyebrow") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <>
      <PageHeader
        variant="about"
        eyebrow={t("eyebrow")}
        title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
        subtitle={t("paragraph1")}
      />
      <AboutPreview />
      <StatsCounter />
      <JourneyTimeline />
      <LogosMarquee />
      <Testimonials />
    </>
  );
}
