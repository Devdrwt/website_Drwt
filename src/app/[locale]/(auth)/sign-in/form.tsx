"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type Values = z.infer<typeof schema>;

export function SignInForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Values) => {
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setLoading(false);
    if (!res || res.error) {
      setError(t("invalidCredentials"));
      return;
    }
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t("password")}</Label>
          <a href="#" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
            {t("forgot")}
          </a>
        </div>
        <Input id="password" type="password" autoComplete="current-password" {...register("password")} aria-invalid={!!errors.password} />
      </div>

      {error && (
        <p className="inline-flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
        <LogIn className="h-4 w-4" />
        {loading ? "..." : t("submit")}
      </Button>
    </form>
  );
}
