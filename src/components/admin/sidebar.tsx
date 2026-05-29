"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Users,
  Mail,
  FileText,
  Newspaper,
  BookOpen,
  LogOut,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/layout/logo";

const items = [
  { href: "/admin",              label: "Dashboard",     Icon: LayoutDashboard },
  { href: "/admin/services",     label: "Services",      Icon: Layers },
  { href: "/admin/portfolio",    label: "Portfolio",     Icon: Briefcase },
  { href: "/admin/articles",     label: "Actualités",    Icon: Newspaper },
  { href: "/admin/docs",         label: "Documentation", Icon: BookOpen },
  { href: "/admin/team",         label: "Équipe",        Icon: Users },
  { href: "/admin/jobs",         label: "Offres d'emploi", Icon: FileText },
  { href: "/admin/applications", label: "Candidatures",  Icon: FileText },
  { href: "/admin/messages",     label: "Messages",      Icon: Mail },
  { href: "/admin/clients",      label: "Clients",       Icon: Building2 },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex sticky top-0 h-dvh w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)]/60 backdrop-blur">
      <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
        <Logo />
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
          Admin
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.Icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href as "/admin"}
              className={cn(
                "flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-brand-500/10 text-brand-700 dark:text-brand-300"
                  : "text-fg-muted hover:bg-foreground/[0.05] hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[var(--border)]">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
