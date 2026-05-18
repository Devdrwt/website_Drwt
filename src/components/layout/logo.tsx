"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function Logo({
  className,
  variant = "auto",
  full = false,
  height = 36,
}: {
  className?: string;
  /** auto = follows theme, light = always light, dark = always dark */
  variant?: "auto" | "light" | "dark";
  /** true = use logo-full.png (with tagline) */
  full?: boolean;
  height?: number;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The provided logo is colored (cyan); both light/dark backgrounds work, but
  // on very dark backgrounds we'd want a white version — which we don't have.
  // We use the same PNG for both, with optional drop-shadow on dark theme.
  const src = full ? "/logo/logo-full.png" : "/logo/logo.png";

  const isDarkBg =
    variant === "dark" || (variant === "auto" && mounted && resolvedTheme === "dark");

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="Drwintech — Accueil"
    >
      <Image
        src={src}
        alt="Drwintech"
        width={full ? 360 : 200}
        height={height}
        priority
        className={cn(
          "h-auto w-auto",
          isDarkBg && "drop-shadow-[0_0_12px_rgba(31,163,255,0.25)]"
        )}
        style={{ height }}
      />
    </Link>
  );
}
