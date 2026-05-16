"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  Receipt,
  LifeBuoy,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/layout/logo";

const items = [
  { href: "/dashboard", labelKey: "dashboard", Icon: LayoutDashboard },
  { href: "/projects",  labelKey: "projects",  Icon: FolderKanban },
  { href: "/invoices",  labelKey: "invoices",  Icon: Receipt },
  { href: "/support",   labelKey: "support",   Icon: LifeBuoy },
] as const;

export function ClientSidebar() {
  const t = useTranslations("ClientArea");
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex sticky top-20 h-[calc(100dvh-5rem)] w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)]/60 backdrop-blur">
      <div className="p-6 border-b border-[var(--border)]">
        <Logo />
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.Icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-brand-500/10 text-brand-700 dark:text-brand-300"
                  : "text-fg-muted hover:bg-foreground/[0.05] hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[var(--border)] space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium text-fg-muted hover:bg-foreground/[0.05]"
        >
          <Settings className="h-4 w-4" />
          {t("settings")}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}
