import { setRequestLocale, getTranslations } from "next-intl/server";

import { PageHeader, GradientText } from "@/components/ui/page-header";
import { ContactForm } from "@/components/contact-form";
import { ContactInfo } from "@/components/sections/contact-info";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: t("eyebrow") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Contact" });

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
        subtitle={t("subtitle")}
        scrollHint={false}
      />

      <section className="py-16 md:py-24 bg-[var(--bg)]">
        <div className="container-page grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
    </>
  );
}
