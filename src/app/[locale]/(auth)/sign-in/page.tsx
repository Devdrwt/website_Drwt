import { setRequestLocale, getTranslations } from "next-intl/server";
import { SignInForm } from "./form";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";

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
    <div className="min-h-[calc(100dvh-5rem)] grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden bg-[linear-gradient(140deg,var(--brand-900),var(--brand-700)_45%,var(--accent-via)_85%,var(--accent-to))] bg-[length:200%_200%] animate-gradient">
        <div className="surface-dots absolute inset-0 opacity-20" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <Logo />
          <div>
            <h2 className="font-display text-3xl xl:text-4xl font-semibold leading-tight max-w-md">
              {t("signInTitle")}
            </h2>
            <p className="mt-4 text-white/80 max-w-md">{t("signInSubtitle")}</p>
          </div>
          <p className="text-xs text-white/60">© Drwintech · {new Date().getFullYear()}</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
            {t("signInTitle")}
          </h1>
          <p className="mt-2 text-sm text-fg-muted">{t("signInSubtitle")}</p>

          <SignInForm />

          <p className="mt-8 text-sm text-fg-muted text-center">
            {t("noAccount")}{" "}
            <Link href="/sign-up" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              {t("createAccount")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
