"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/layout/logo";

/** Slim mobile-only top bar for dashboard areas (no public navbar there). */
export function DashboardTopbar({ label }: { label: string }) {
  return (
    <div className="lg:hidden flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-5 h-16 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Logo height={26} />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
          {label}
        </span>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Déconnexion</span>
      </button>
    </div>
  );
}
