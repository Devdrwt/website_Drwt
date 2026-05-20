import { setRequestLocale, getTranslations } from "next-intl/server";
import { SignInForm } from "./form";
import { Link } from "@/i18n/navigation";
import { AuthShell } from "@/components/auth-shell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });
  return { title: t("signInTitle") };
}

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Auth" });

  return (
    <AuthShell
      eyebrow="Espace sécurisé"
      title={t("signInTitle")}
      subtitle={t("signInSubtitle")}
      footer={
        <>
          {t("noAccount")}{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-brand-200 hover:text-white transition-colors"
          >
            {t("createAccount")}
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}
