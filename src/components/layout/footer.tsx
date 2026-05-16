import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { Logo } from "./logo";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-[var(--border)] bg-[var(--bg-muted)]/40">
      <div className="surface-grid absolute inset-0 opacity-30 pointer-events-none" aria-hidden />

      <div className="container-page relative py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-sm text-sm text-fg-muted leading-relaxed">
              {t("tagline")}
            </p>
            <div className="space-y-2 text-sm text-fg-muted">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-500" />
                {siteConfig.city}, {siteConfig.country}
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4 text-brand-500" />
                {siteConfig.email}
              </a>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4 text-brand-500" />
                {siteConfig.whatsapp}
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground mb-5">
              {t("explore")}
            </p>
            <ul className="space-y-3 text-sm text-fg-muted">
              <li><Link href="/services" className="hover:text-foreground transition-colors">{tNav("services")}</Link></li>
              <li><Link href="/portfolio" className="hover:text-foreground transition-colors">{tNav("portfolio")}</Link></li>
              <li><Link href="/team" className="hover:text-foreground transition-colors">{tNav("team")}</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">{tNav("careers")}</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground mb-5">
              {t("company")}
            </p>
            <ul className="space-y-3 text-sm text-fg-muted">
              <li><Link href="/about" className="hover:text-foreground transition-colors">{tNav("about")}</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">{tNav("contact")}</Link></li>
              <li><Link href="/sign-in" className="hover:text-foreground transition-colors">{tNav("clientArea")}</Link></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t("links.privacy")}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t("links.terms")}</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground mb-5">
              {t("newsletter")}
            </p>
            <p className="text-sm text-fg-muted mb-4">{t("newsletterDesc")}</p>
            <form
              action="/api/newsletter"
              method="post"
              className="flex flex-col sm:flex-row gap-2"
            >
              <Input
                type="email"
                name="email"
                required
                placeholder={t("emailPlaceholder")}
                className="h-11 flex-1"
              />
              <Button type="submit" variant="gradient" size="md">
                {t("subscribe")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] hover:border-brand-500 hover:text-brand-500 transition-colors"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.493-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.563V12h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.99 22 12z" />
                </svg>
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] hover:border-brand-500 hover:text-brand-500 transition-colors"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                </svg>
              </a>
              <a
                href={siteConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] hover:border-brand-500 hover:text-brand-500 transition-colors"
                aria-label="TikTok"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M16.5 3a4.5 4.5 0 0 0 4.5 4.5V11a8 8 0 0 1-4.5-1.4v6.4A5.5 5.5 0 1 1 11 10.5v3.1a2.4 2.4 0 1 0 1.7 2.3V3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-fg-subtle">
          <p>© {year} {siteConfig.legalName}. {t("rights")}</p>
          <p>Made with care in {siteConfig.city}.</p>
        </div>
      </div>
    </footer>
  );
}
