import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";

import { PageHeader, GradientText } from "@/components/ui/page-header";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/lib/site";

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

  const info = [
    { Icon: MapPin,        label: t("info.address"),  value: t("info.addressValue") },
    { Icon: Mail,          label: t("info.email"),    value: siteConfig.email,           href: `mailto:${siteConfig.email}` },
    { Icon: Phone,         label: t("info.phone"),    value: siteConfig.whatsapp,        href: `tel:${siteConfig.whatsapp.replace(/\s/g, "")}` },
    { Icon: MessageCircle, label: t("info.whatsapp"), value: siteConfig.whatsapp,        href: siteConfig.whatsappUrl },
    { Icon: Clock,         label: t("info.hours"),    value: t("info.hoursValue") },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", { gradient: (c) => <GradientText>{c}</GradientText> })}
        subtitle={t("subtitle")}
      />

      <section className="py-16 md:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <ContactForm />

          <aside className="space-y-4">
            {info.map((i) => {
              const Icon = i.Icon;
              const Body = (
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 grid place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300 shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                      {i.label}
                    </p>
                    <p className="mt-1 text-sm text-foreground break-words">{i.value}</p>
                  </div>
                </div>
              );
              return i.href ? (
                <a
                  key={i.label}
                  href={i.href}
                  target={i.href.startsWith("http") ? "_blank" : undefined}
                  rel={i.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block card-elevated p-5 hover:border-brand-500/40 transition-colors"
                >
                  {Body}
                </a>
              ) : (
                <div key={i.label} className="card-elevated p-5">
                  {Body}
                </div>
              );
            })}
          </aside>
        </div>
      </section>
    </>
  );
}
