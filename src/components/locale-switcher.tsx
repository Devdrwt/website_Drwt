"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";
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
      onClick={() =>
        startTransition(() => {
          router.replace(pathname, { locale: switchTo });
        })
      }
      className={cn(
        "h-10 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-foreground/[0.06] disabled:opacity-60",
        className
      )}
    >
      <Globe className="h-4 w-4" />
      <span>{locale === "fr" ? "FR" : "EN"}</span>
      <span className="text-fg-subtle">/</span>
      <span className="text-fg-subtle">{locale === "fr" ? "EN" : "FR"}</span>
    </button>
  );
}

export function _allLocales() {
  return routing.locales;
}
