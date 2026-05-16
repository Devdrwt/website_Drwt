import { setRequestLocale } from "next-intl/server";
import {
  Briefcase,
  Building2,
  FileText,
  Layers,
  Mail,
  Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [services, projects, team, jobs, applications, messages, clients] =
    await Promise.all([
      prisma.service.count(),
      prisma.project.count(),
      prisma.teamMember.count(),
      prisma.jobOpening.count(),
      prisma.jobApplication.count({ where: { status: "RECEIVED" } }),
      prisma.contactMessage.count({ where: { handled: false } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
    ]);

  const cards = [
    { href: "/admin/services",     label: "Services",      value: services,    Icon: Layers,     accent: "from-cyan-400 to-blue-600" },
    { href: "/admin/portfolio",    label: "Projets",       value: projects,    Icon: Briefcase,  accent: "from-violet-400 to-fuchsia-600" },
    { href: "/admin/team",         label: "Équipe",        value: team,        Icon: Users,      accent: "from-amber-400 to-rose-600" },
    { href: "/admin/jobs",         label: "Offres",        value: jobs,        Icon: FileText,   accent: "from-emerald-400 to-teal-600" },
    { href: "/admin/applications", label: "Candidatures",  value: applications, Icon: FileText,  accent: "from-pink-400 to-purple-600" },
    { href: "/admin/messages",     label: "Messages",      value: messages,    Icon: Mail,       accent: "from-orange-400 to-red-600" },
    { href: "/admin/clients",      label: "Clients",       value: clients,     Icon: Building2,  accent: "from-sky-400 to-indigo-600" },
  ];

  return (
    <div className="container-page py-10 md:py-14 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
          Tableau de bord
        </h1>
        <p className="mt-2 text-fg-muted">Vue d'ensemble de la plateforme.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.Icon;
          return (
            <Link
              key={c.href}
              href={c.href as "/admin"}
              className="group relative card-elevated p-5 overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]"
            >
              <div
                className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${c.accent} opacity-15 blur-2xl group-hover:opacity-30 transition-opacity`}
              />
              <div className="relative">
                <Icon className="h-5 w-5 text-fg-muted" />
                <p className="mt-4 text-3xl md:text-4xl font-display font-semibold">{c.value}</p>
                <p className="text-xs text-fg-muted mt-1 uppercase tracking-wider">{c.label}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
