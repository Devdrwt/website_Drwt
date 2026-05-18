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
    <footer className="relative bg-foreground text-fg-on-dark mt-24">
      <div className="container-wide pt-20 md:pt-24 pb-12">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand column */}
          <div className="space-y-6 max-w-sm">
            <Logo height={42} variant="dark" />
            <p className="text-base text-fg-on-dark/80 leading-relaxed">
              {t("tagline")}
            </p>
            <p className="text-sm text-fg-on-dark/60 leading-relaxed">
              Studio technologique basé à Cotonou, nous accompagnons particuliers, entreprises et institutions dans leur transformation numérique et leur sécurisation.
            </p>

            <ul className="space-y-3 text-sm text-fg-on-dark/80 pt-2">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-brand-400" />
                {siteConfig.city}, {siteConfig.country}
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2.5 hover:text-fg-on-dark transition-colors">
                  <Mail className="h-4 w-4 text-brand-400" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-fg-on-dark transition-colors">
                  <Phone className="h-4 w-4 text-brand-400" />
                  {siteConfig.whatsapp}
                </a>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-400 mb-5">
              {t("explore")}
            </p>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/">{tNav("home")}</FooterLink>
              <FooterLink href="/about">{tNav("about")}</FooterLink>
              <FooterLink href="/services">{tNav("services")}</FooterLink>
              <FooterLink href="/portfolio">{tNav("portfolio")}</FooterLink>
              <FooterLink href="/team">{tNav("team")}</FooterLink>
              <FooterLink href="/careers">{tNav("careers")}</FooterLink>
              <FooterLink href="/contact">{tNav("contact")}</FooterLink>
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-400 mb-5">
              Services
            </p>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/services/web-mobile">Web & Mobile</FooterLink>
              <FooterLink href="/services/custom">Sur mesure</FooterLink>
              <FooterLink href="/services/transformation">Transformation</FooterLink>
              <FooterLink href="/services/ai-data">IA & Data</FooterLink>
              <FooterLink href="/services/security">Cybersécurité</FooterLink>
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-400 mb-5">
              {t("newsletter")}
            </p>
            <p className="text-sm text-fg-on-dark/70 mb-4 leading-relaxed">
              {t("newsletterDesc")}
            </p>
            <form action="/api/newsletter" method="post" className="flex flex-col gap-2">
              <Input
                type="email"
                name="email"
                required
                placeholder={t("emailPlaceholder")}
                className="h-11 bg-fg-on-dark/5 border-fg-on-dark/15 text-fg-on-dark placeholder:text-fg-on-dark/40 focus-visible:border-brand-400"
              />
              <Button type="submit" variant="primary" size="md">
                {t("subscribe")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-8 flex items-center gap-2">
              {[
                { url: siteConfig.social.linkedin, label: "LinkedIn", icon:
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                  </svg> },
                { url: siteConfig.social.facebook, label: "Facebook", icon:
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.493-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.563V12h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.99 22 12z" />
                  </svg> },
                { url: siteConfig.social.youtube, label: "YouTube", icon:
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" />
                  </svg> },
                { url: siteConfig.social.twitter, label: "Twitter", icon:
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg> },
                { url: siteConfig.social.tiktok, label: "TikTok", icon:
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M16.5 3a4.5 4.5 0 0 0 4.5 4.5V11a8 8 0 0 1-4.5-1.4v6.4A5.5 5.5 0 1 1 11 10.5v3.1a2.4 2.4 0 1 0 1.7 2.3V3z" />
                  </svg> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="h-10 w-10 inline-flex items-center justify-center rounded-md border border-fg-on-dark/15 hover:border-brand-400 hover:text-brand-400 text-fg-on-dark/70 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-fg-on-dark/10">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-fg-on-dark/60">
          <p>© {year} {siteConfig.legalName} · {t("rights")}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><a href="#" className="hover:text-fg-on-dark transition-colors">{t("links.mentions")}</a></li>
            <li><a href="#" className="hover:text-fg-on-dark transition-colors">{t("links.privacy")}</a></li>
            <li><a href="#" className="hover:text-fg-on-dark transition-colors">{t("links.terms")}</a></li>
            <li><a href="#" className="hover:text-fg-on-dark transition-colors">{t("links.cookies")}</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href as "/about"}
        className="group inline-flex items-center gap-1.5 text-fg-on-dark/80 hover:text-fg-on-dark transition-colors"
      >
        {children}
        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </Link>
    </li>
  );
}
