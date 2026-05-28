import { setRequestLocale, getTranslations } from "next-intl/server";
import { SignUpForm } from "./form";
import { Link } from "@/i18n/navigation";
import { AuthShell } from "@/components/auth-shell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });
  return { title: t("registerTitle") };
}

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Auth" });

  return (
    <AuthShell
      eyebrow="Créer un compte"
      title={t("registerTitle")}
      subtitle={t("signInSubtitle")}
      footer={
        <>
          {t("haveAccount")}{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            {t("signIn")}
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
