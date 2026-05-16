import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { ClientSidebar } from "@/components/client/sidebar";

export default async function ClientLayout({
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

  return (
    <div className="flex">
      <ClientSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
