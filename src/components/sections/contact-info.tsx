"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function ContactInfo() {
  const t = useTranslations("Contact");

  const info = [
    { Icon: Phone,         label: t("info.phone"),    value: siteConfig.whatsapp,        href: `tel:${siteConfig.whatsapp.replace(/\s/g, "")}` },
    { Icon: MessageCircle, label: t("info.whatsapp"), value: "Discussion instantanée",   href: siteConfig.whatsappUrl, accent: true },
    { Icon: Mail,          label: t("info.email"),    value: siteConfig.email,           href: `mailto:${siteConfig.email}` },
    { Icon: MapPin,        label: t("info.address"),  value: t("info.addressValue") },
    { Icon: Clock,         label: t("info.hours"),    value: t("info.hoursValue") },
  ];

  return (
    <aside className="space-y-3">
      {/* Animated map mock */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative h-48 rounded-xl overflow-hidden border border-[var(--border)] bg-foreground"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(31,163,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(31,163,255,.25) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Concentric pulses */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="relative inline-flex">
            <motion.span
              aria-hidden
              className="absolute inset-0 -m-8 rounded-full border border-brand-400"
              animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              aria-hidden
              className="absolute inset-0 -m-8 rounded-full border border-brand-400"
              animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
              transition={{ duration: 2.5, delay: 1.25, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative h-4 w-4 rounded-full bg-brand-500 shadow-[0_0_0_4px_rgba(31,163,255,0.3)]" />
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="font-mono text-[10px] uppercase tracking-wider text-brand-300 mb-1">Notre bureau</p>
          <p className="font-semibold">Cotonou, Bénin</p>
        </div>
      </motion.div>

      {info.map((i, idx) => {
        const Icon = i.Icon;
        const Body = (
          <div className="flex items-start gap-4">
            <div className={`h-11 w-11 grid place-items-center rounded-xl shrink-0 transition-colors ${
              i.accent
                ? "bg-brand-600 text-white"
                : "bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300"
            }`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                {i.label}
              </p>
              <p className="mt-1 text-base text-foreground break-words font-medium">{i.value}</p>
            </div>
          </div>
        );
        return (
          <motion.div
            key={i.label}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: idx * 0.06 }}
          >
            {i.href ? (
              <a
                href={i.href}
                target={i.href.startsWith("http") ? "_blank" : undefined}
                rel={i.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block card-elevated p-5 hover:border-brand-500"
              >
                {Body}
              </a>
            ) : (
              <div className="card-elevated p-5">{Body}</div>
            )}
          </motion.div>
        );
      })}
    </aside>
  );
}
