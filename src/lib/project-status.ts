import type { ProjectStatus, ProjectPriority } from "@prisma/client";

export const PROJECT_STATUS: Record<
  ProjectStatus,
  { label: string; short: string; dot: string; chip: string }
> = {
  PROSPECT: {
    label: "Prospect",
    short: "Prospect",
    dot: "bg-slate-400",
    chip: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/25",
  },
  ACTIVE: {
    label: "En cours",
    short: "Actif",
    dot: "bg-brand-500",
    chip: "bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-500/30",
  },
  ON_HOLD: {
    label: "En pause",
    short: "Pause",
    dot: "bg-amber-500",
    chip: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
  COMPLETED: {
    label: "Terminé",
    short: "Terminé",
    dot: "bg-emerald-500",
    chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },
  ARCHIVED: {
    label: "Archivé",
    short: "Archivé",
    dot: "bg-slate-300 dark:bg-slate-600",
    chip: "bg-slate-400/10 text-slate-500 border-slate-400/25",
  },
};

export const STATUS_ORDER: ProjectStatus[] = [
  "PROSPECT",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "ARCHIVED",
];

export const PROJECT_PRIORITY: Record<
  ProjectPriority,
  { label: string; chip: string }
> = {
  LOW:      { label: "Basse",    chip: "text-slate-500" },
  MEDIUM:   { label: "Moyenne",  chip: "text-brand-600 dark:text-brand-400" },
  HIGH:     { label: "Haute",    chip: "text-amber-600 dark:text-amber-400" },
  CRITICAL: { label: "Critique", chip: "text-rose-600 dark:text-rose-400" },
};

export const RESOURCE_CATEGORY: Record<string, string> = {
  SPEC:   "Cahier des charges",
  DESIGN: "Design",
  DOC:    "Documentation",
  REPORT: "Compte-rendu",
  ASSET:  "Ressource média",
  OTHER:  "Autre",
};

export const ACCESS_ENV: Record<string, string> = {
  REPOSITORY:   "Dépôt de code",
  STAGING:      "Préproduction",
  PRODUCTION:   "Production",
  DESIGN_TOOL:  "Outil de design",
  PROJECT_MGMT: "Gestion de projet",
  OTHER:        "Autre",
};
