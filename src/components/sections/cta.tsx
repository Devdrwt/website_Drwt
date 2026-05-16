"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function CTA() {
  const t = useTranslations("CTA");
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2rem] p-10 md:p-16 lg:p-20 text-center"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(120deg,var(--brand-900),var(--brand-700)_45%,var(--accent-via)_80%,var(--accent-to))] bg-[length:200%_200%] animate-gradient"
          />
          <div aria-hidden className="absolute inset-0 surface-dots opacity-20" />
          <div aria-hidden className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
          <div aria-hidden className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          <div className="relative text-white">
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-6 mx-auto max-w-2xl text-base md:text-lg text-white/80 leading-relaxed">
              {t("subtitle")}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/contact">
                <Button
                  size="xl"
                  className="bg-white text-brand-900 hover:bg-white/95 font-semibold"
                >
                  {t("primary")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="xl"
                  variant="ghost"
                  className="text-white border border-white/30 hover:bg-white/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t("secondary")}
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
