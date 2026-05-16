import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/sections/hero";
import { LogosMarquee } from "@/components/sections/logos-marquee";
import { ServicesSection } from "@/components/sections/services";
import { AboutPreview } from "@/components/sections/about-preview";
import { PortfolioPreview } from "@/components/sections/portfolio-preview";
import { ProcessSection } from "@/components/sections/process";
import { Testimonials } from "@/components/sections/testimonials";
import { CTA } from "@/components/sections/cta";

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
      <PortfolioPreview />
      <Testimonials />
      <CTA />
    </>
  );
}
