"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, source: typeof window !== "undefined" ? window.location.pathname : "" }),
      });
      if (!res.ok) throw new Error("server");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-elevated p-6 md:p-8 space-y-5"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">{t("form.name")} *</Label>
          <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("form.email")} *</Label>
          <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">{t("form.company")}</Label>
          <Input id="company" {...register("company")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">{t("form.phone")}</Label>
          <Input id="phone" {...register("phone")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="subject">{t("form.subject")}</Label>
          <Input id="subject" {...register("subject")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="budget">{t("form.budget")}</Label>
          <Input id="budget" placeholder="< 5k€ · 5–20k€ · 20–50k€ · 50k€+" {...register("budget")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">{t("form.message")} *</Label>
        <Textarea id="message" rows={6} {...register("message")} aria-invalid={!!errors.message} />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" variant="gradient" size="lg" disabled={status === "loading"}>
          <Send className="h-4 w-4" />
          {status === "loading" ? t("form.sending") : t("form.submit")}
        </Button>

        {status === "success" && (
          <p className="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            {t("form.success")}
          </p>
        )}
        {status === "error" && (
          <p className="inline-flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-4 w-4" />
            {t("form.error")}
          </p>
        )}
      </div>
    </form>
  );
}
