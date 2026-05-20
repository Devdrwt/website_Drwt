"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, ArrowRight, Loader2, Mail, Lock } from "lucide-react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type Values = z.infer<typeof schema>;

const fieldCls =
  "h-12 w-full rounded-xl border border-white/15 bg-white/10 pl-11 pr-4 text-sm text-white placeholder:text-white/40 transition-colors focus-visible:border-brand-300 focus-visible:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300/30";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
          {t("email")}
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@drwintech.com"
            className={fieldCls}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
            {t("password")}
          </label>
          <a href="#" className="text-xs text-brand-200 hover:text-white transition-colors">
            {t("forgot")}
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={fieldCls}
            aria-invalid={!!errors.password}
            {...register("password")}
          />
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-2 rounded-lg bg-rose-500/15 border border-rose-400/30 px-3 py-2 text-sm text-rose-100">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-brand-800 font-semibold text-sm shadow-lg transition-all hover:bg-white/95 hover:shadow-xl disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {t("submit")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
