"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "./logo";
import { ThemeToggle } from "../theme-toggle";
import { LocaleSwitcher } from "../locale-switcher";
import { Button } from "../ui/button";

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

  const links = [
    { href: "/",          label: t("home") },
    { href: "/about",     label: t("about") },
    { href: "/services",  label: t("services") },
    { href: "/portfolio", label: t("portfolio") },
    { href: "/team",      label: t("team") },
    { href: "/careers",   label: t("careers") },
    { href: "/contact",   label: t("contact") },
  ];

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
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
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
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-brand-500 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
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
                >
                  <Link
                    href={link.href}
                    className="flex items-center justify-between py-4 border-b border-[var(--border)] text-2xl font-semibold text-foreground"
                  >
                    {link.label}
                    <ArrowRight className="h-5 w-5 text-fg-subtle" />
                  </Link>
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
