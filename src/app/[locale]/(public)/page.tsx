import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/sections/hero";
import { LogosMarquee } from "@/components/sections/logos-marquee";
import { ServicesSection } from "@/components/sections/services";
import { AboutPreview } from "@/components/sections/about-preview";
import { ProcessSection } from "@/components/sections/process";
import { LatestNews } from "@/components/sections/latest-news";
import { Testimonials } from "@/components/sections/testimonials";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <LogosMarquee />
      <ServicesSection />
      <AboutPreview />
      <ProcessSection />
      <LatestNews locale={locale} />
      <Testimonials />
    </>
  );
}
