import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { DashboardTopbar } from "@/components/dashboard-topbar";

export default async function AdminLayout({
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
    return redirect({ href: "/sign-in", locale });
  }
  if (session.user.role !== "ADMIN") {
    return redirect({ href: "/dashboard", locale });
  }

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <DashboardTopbar label="Back-office" />
        {children}
      </div>
    </div>
  );
}
