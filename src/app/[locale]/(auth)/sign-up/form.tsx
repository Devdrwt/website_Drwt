"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, ArrowRight, Loader2, User, Mail, Lock, Building2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  company: z.string().optional(),
});
type Values = z.infer<typeof schema>;

const fieldCls =
  "h-12 w-full rounded-xl border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:border-brand-500 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/25";

export function SignUpForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: Values) => {
    setError(null);
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      setLoading(false);
      const data = await res.json().catch(() => ({}));
      setError(data.error === "exists" ? "Email déjà utilisé." : "Erreur serveur.");
      return;
    }
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field icon={<User className="h-4 w-4" />} label={t("name")}>
        <input id="name" placeholder="Votre nom complet" className={fieldCls} aria-invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field icon={<Mail className="h-4 w-4" />} label={t("email")}>
        <input id="email" type="email" autoComplete="email" placeholder="vous@email.com" className={fieldCls} aria-invalid={!!errors.email} {...register("email")} />
      </Field>
      <Field icon={<Lock className="h-4 w-4" />} label={t("password")}>
        <input id="password" type="password" autoComplete="new-password" placeholder="8 caractères minimum" className={fieldCls} aria-invalid={!!errors.password} {...register("password")} />
      </Field>
      <Field icon={<Building2 className="h-4 w-4" />} label="Entreprise (optionnel)">
        <input id="company" placeholder="Votre entreprise" className={fieldCls} {...register("company")} />
      </Field>

      {error && (
        <p className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-white font-semibold text-sm shadow-lg transition-all hover:bg-brand-700 hover:shadow-xl disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {t("createAccount")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        {children}
      </div>
    </div>
  );
}
