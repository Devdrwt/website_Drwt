"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("Nav");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = locale === "fr" ? "en" : "fr";

  return (
    <button
      type="button"
      aria-label={t("switchLanguage")}
      disabled={isPending}
      onClick={() => startTransition(() => router.replace(pathname, { locale: switchTo }))}
      className={cn(
        "h-11 inline-flex items-center gap-2 px-3 rounded-full text-foreground hover:bg-foreground/[0.08] transition-colors mono text-[11px] uppercase tracking-[0.14em] disabled:opacity-60",
        className
      )}
    >
      <span className="font-semibold">{locale === "fr" ? "FR" : "EN"}</span>
      <span className="text-fg-subtle">/</span>
      <span className="text-fg-subtle">{locale === "fr" ? "EN" : "FR"}</span>
    </button>
  );
}

export function _allLocales() {
  return routing.locales;
}
