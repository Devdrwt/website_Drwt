import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { InternalSidebar, InternalMobileNav } from "@/components/internal/sidebar";
import { DashboardTopbar } from "@/components/dashboard-topbar";

export default async function InternalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) {
    redirect({ href: "/sign-in", locale });
  }
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "STAFF") {
    redirect({ href: "/dashboard", locale });
  }

  const userName = session.user.name ?? session.user.email ?? "Membre";

  return (
    <div className="flex min-h-dvh bg-[var(--bg-muted)]/30">
      <InternalSidebar role={role} userName={userName} />
      <div className="flex-1 min-w-0">
        <DashboardTopbar label="Espace interne" />
        <InternalMobileNav />
        {children}
      </div>
    </div>
  );
}
