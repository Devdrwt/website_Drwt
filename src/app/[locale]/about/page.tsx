import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader, GradientText } from "@/components/ui/page-header";
import { AboutPreview } from "@/components/sections/about-preview";
import { Testimonials } from "@/components/sections/testimonials";
import { LogosMarquee } from "@/components/sections/logos-marquee";
import { CTA } from "@/components/sections/cta";

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
        eyebrow={t("eyebrow")}
        title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
      />
      <AboutPreview />
      <LogosMarquee />
      <Testimonials />
      <CTA />
    </>
  );
}
