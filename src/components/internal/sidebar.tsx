"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { signOut } from "next-auth/react";
import { LayoutGrid, FolderKanban, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { href: "/internal",          label: "Vue d'ensemble", Icon: LayoutGrid,   exact: true },
  { href: "/internal/projects", label: "Projets",        Icon: FolderKanban, exact: false },
] as const;

function useItems() {
  const pathname = usePathname();
  return items.map((it) => ({
    ...it,
    active: it.exact ? pathname === it.href : pathname.startsWith(it.href),
  }));
}

export function InternalSidebar({
  role,
  userName,
}: {
  role: string;
  userName: string;
}) {
  const nav = useItems();

  return (
    <aside className="hidden lg:flex sticky top-20 h-[calc(100dvh-5rem)] w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="p-6 border-b border-[var(--border)]">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
          Espace interne
        </p>
        <p className="mt-1 text-lg font-semibold text-foreground">Projets Drwintech</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const Icon = item.Icon;
          return (
            <Link
              key={item.href}
              href={item.href as "/internal"}
              className={cn(
                "flex items-center gap-3 px-3 h-11 rounded-lg text-sm font-medium transition-colors",
                item.active
                  ? "bg-brand-500/10 text-brand-700 dark:text-brand-300"
                  : "text-fg-muted hover:bg-foreground/[0.05] hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {role === "ADMIN" && (
          <div className="pt-4 mt-4 border-t border-[var(--border)]">
            <Link
              href={"/admin" as "/internal"}
              className="flex items-center gap-3 px-3 h-11 rounded-lg text-sm font-medium text-fg-muted hover:bg-foreground/[0.05] hover:text-foreground transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              Back-office admin
            </Link>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-[var(--border)]">
        <div className="px-3 mb-3">
          <p className="text-sm font-medium text-foreground truncate">{userName}</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            {role === "ADMIN" ? "Administrateur" : "Membre d'équipe"}
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 h-11 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

export function InternalMobileNav() {
  const nav = useItems();
  return (
    <nav className="lg:hidden flex gap-1 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 overflow-x-auto">
      {nav.map((item) => {
        const Icon = item.Icon;
        return (
          <Link
            key={item.href}
            href={item.href as "/internal"}
            className={cn(
              "flex items-center gap-2 px-3 h-9 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
              item.active
                ? "bg-brand-500/10 text-brand-700 dark:text-brand-300"
                : "text-fg-muted"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
