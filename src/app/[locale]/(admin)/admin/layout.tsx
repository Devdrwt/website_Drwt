import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

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
    redirect({ href: "/sign-in", locale });
  }
  if (session.user.role !== "ADMIN") {
    redirect({ href: "/dashboard", locale });
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
