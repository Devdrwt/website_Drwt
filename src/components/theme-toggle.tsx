"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Nav");

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={t("toggleTheme")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative h-10 w-10 inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-foreground transition-colors hover:bg-foreground/[0.06]",
        className
      )}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all",
          isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0"
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all",
          isDark ? "scale-100 rotate-0" : "scale-0 rotate-90"
        )}
      />
    </button>
  );
}
