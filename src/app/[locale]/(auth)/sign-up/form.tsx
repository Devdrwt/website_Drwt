"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  company: z.string().optional(),
});
type Values = z.infer<typeof schema>;

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
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">{t("password")}</Label>
        <Input id="password" type="password" autoComplete="new-password" {...register("password")} aria-invalid={!!errors.password} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="company">Entreprise</Label>
        <Input id="company" {...register("company")} />
      </div>

      {error && (
        <p className="inline-flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
        <UserPlus className="h-4 w-4" />
        {loading ? "..." : t("createAccount")}
      </Button>
    </form>
  );
}
