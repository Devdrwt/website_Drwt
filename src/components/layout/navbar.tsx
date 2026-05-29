"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "./logo";
import { ThemeToggle } from "../theme-toggle";
import { LocaleSwitcher } from "../locale-switcher";
import { Button } from "../ui/button";

type NavChild = { href: string; label: string };
type NavLink = { href: string; label: string; children?: NavChild[] };

export function Navbar() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  const links: NavLink[] = [
    { href: "/", label: t("home") },
    {
      href: "/about",
      label: t("about"),
      children: [
        { href: "/team", label: t("team") },
        { href: "/careers", label: t("careers") },
      ],
    },
    {
      href: "/services",
      label: t("services"),
      children: [{ href: "/actualites", label: t("news") }],
    },
    {
      href: "/portfolio",
      label: t("portfolio"),
      children: [{ href: "/documentation", label: t("documentation") }],
    },
    { href: "/contact", label: t("contact") },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between gap-6 h-20">
          <Logo height={36} />

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const active = isActive(link.href);
              const underline = active && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-brand-500 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              );

              if (!link.children) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      active ? "text-brand-600 dark:text-brand-400" : "text-fg-muted hover:text-foreground"
                    )}
                  >
                    {link.label}
                    {underline}
                  </Link>
                );
              }

              return (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={cn(
                      "relative inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      active ? "text-brand-600 dark:text-brand-400" : "text-fg-muted hover:text-foreground"
                    )}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                    {underline}
                  </Link>
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0">
                    <div className="min-w-[210px] rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-lg p-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            isActive(child.href)
                              ? "text-brand-600 dark:text-brand-400 bg-brand-500/10"
                              : "text-fg-muted hover:bg-foreground/[0.05] hover:text-foreground"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
            <Link
              href="/sign-in"
              className="h-10 inline-flex items-center gap-1.5 px-3 rounded-md text-sm text-fg-muted hover:text-foreground transition-colors"
              aria-label={t("clientArea")}
            >
              <User className="h-4 w-4" />
            </Link>
            <Link href="/contact">
              <Button variant="primary" size="sm">
                {t("getQuote")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-md border border-[var(--border-strong)] text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-x-0 top-[80px] bottom-0 z-40 bg-[var(--bg)] overflow-y-auto"
          >
            <div className="container-page py-8 flex flex-col">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-[var(--border)]"
                >
                  <Link
                    href={link.href}
                    className="flex items-center justify-between py-4 text-2xl font-semibold text-foreground"
                  >
                    {link.label}
                    <ArrowRight className="h-5 w-5 text-fg-subtle" />
                  </Link>
                  {link.children && (
                    <div className="pb-4 -mt-1 flex flex-col gap-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-2 py-2 pl-4 text-base text-fg-muted hover:text-foreground"
                        >
                          <span className="h-px w-4 bg-fg-subtle" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              <div className="mt-8 flex items-center gap-3">
                <LocaleSwitcher />
                <ThemeToggle />
                <Link href="/sign-in" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    <User className="h-4 w-4" />
                    {t("clientArea")}
                  </Button>
                </Link>
              </div>
              <Link href="/contact" className="mt-3">
                <Button variant="primary" size="lg" className="w-full">
                  {t("getQuote")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
