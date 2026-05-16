"use client";

import { useFormStatus } from "react-dom";
import { Save, Search, Target, Lightbulb, Rocket } from "lucide-react";
import type { Project } from "@prisma/client";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["CONSULTING", "IT_SECURITY", "SOFTWARE", "ELEARNING", "MEDIA", "WEB"] as const;

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="gradient" size="lg" disabled={pending}>
      <Save className="h-4 w-4" />
      {pending ? "Enregistrement..." : "Enregistrer"}
    </Button>
  );
}

const phases = [
  {
    key: "discover",
    Icon: Search,
    label: "Discover · Diverger",
    hint: "Recherche utilisateur, immersion, ethnographie, benchmark…",
  },
  {
    key: "define",
    Icon: Target,
    label: "Define · Converger",
    hint: "Synthèse, problématisation, insights, priorisation…",
  },
  {
    key: "develop",
    Icon: Lightbulb,
    label: "Develop · Diverger",
    hint: "Idéation, ateliers, prototypage, tests utilisateurs…",
  },
  {
    key: "deliver",
    Icon: Rocket,
    label: "Deliver · Converger",
    hint: "Production, livraison, mise à l'échelle, mesure d'impact…",
  },
] as const;

export function ProjectForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<Project>;
}) {
  return (
    <form action={action} className="space-y-6">
      {/* === Identité & contenu général === */}
      <section className="card-elevated p-6 md:p-8 space-y-5">
        <h2 className="font-display text-lg font-semibold">Identité & contenu</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" name="slug" required defaultValue={initial?.slug ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Catégorie *</Label>
            <select
              id="category" name="category"
              defaultValue={initial?.category ?? "WEB"}
              className="h-12 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 text-sm"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="title_fr">Titre FR *</Label>
            <Input id="title_fr" name="title_fr" required defaultValue={initial?.title_fr ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="title_en">Title EN *</Label>
            <Input id="title_en" name="title_en" required defaultValue={initial?.title_en ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client">Client</Label>
            <Input id="client" name="client" defaultValue={initial?.client ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="liveUrl">URL live</Label>
            <Input id="liveUrl" name="liveUrl" type="url" defaultValue={initial?.liveUrl ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="duration">Durée projet</Label>
            <Input id="duration" name="duration" placeholder="ex: 4 mois" defaultValue={initial?.duration ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="teamSize">Taille d'équipe</Label>
            <Input id="teamSize" name="teamSize" type="number" min={0} defaultValue={initial?.teamSize ?? 0} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="coverImage">Image de couverture (URL ou gradient CSS) *</Label>
            <Input id="coverImage" name="coverImage" required defaultValue={initial?.coverImage ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="summary_fr">Résumé FR *</Label>
            <Textarea id="summary_fr" name="summary_fr" rows={3} required defaultValue={initial?.summary_fr ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="summary_en">Summary EN *</Label>
            <Textarea id="summary_en" name="summary_en" rows={3} required defaultValue={initial?.summary_en ?? ""} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="content_fr">Contexte complet FR *</Label>
            <Textarea id="content_fr" name="content_fr" rows={4} required defaultValue={initial?.content_fr ?? ""} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="content_en">Full context EN *</Label>
            <Textarea id="content_en" name="content_en" rows={4} required defaultValue={initial?.content_en ?? ""} />
          </div>
        </div>
      </section>

      {/* === Challenge === */}
      <section className="card-elevated p-6 md:p-8 space-y-5">
        <h2 className="font-display text-lg font-semibold">Problématique initiale</h2>
        <p className="text-sm text-fg-muted">Le contexte qui a déclenché la mission, en une à deux phrases.</p>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="challenge_fr">Challenge FR</Label>
            <Textarea id="challenge_fr" name="challenge_fr" rows={3} defaultValue={initial?.challenge_fr ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="challenge_en">Challenge EN</Label>
            <Textarea id="challenge_en" name="challenge_en" rows={3} defaultValue={initial?.challenge_en ?? ""} />
          </div>
        </div>
      </section>

      {/* === Double diamant === */}
      <section className="card-elevated p-6 md:p-8 space-y-6">
        <header>
          <h2 className="font-display text-lg font-semibold">Double diamant — Design Thinking</h2>
          <p className="mt-1 text-sm text-fg-muted">
            Décrivez le projet selon les 4 phases : ce qu'on a fait à chaque étape, et ce qui en est sorti.
          </p>
        </header>

        {phases.map((p) => {
          const Icon = p.Icon;
          return (
            <div key={p.key} className="rounded-2xl border border-[var(--border)] p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--accent-from),var(--accent-via))] text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider">{p.label}</h3>
                  <p className="text-xs text-fg-subtle">{p.hint}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`${p.key}_fr`}>FR</Label>
                  <Textarea
                    id={`${p.key}_fr`}
                    name={`${p.key}_fr`}
                    rows={5}
                    defaultValue={(initial as Record<string, string | null | undefined>)?.[`${p.key}_fr`] ?? ""}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`${p.key}_en`}>EN</Label>
                  <Textarea
                    id={`${p.key}_en`}
                    name={`${p.key}_en`}
                    rows={5}
                    defaultValue={(initial as Record<string, string | null | undefined>)?.[`${p.key}_en`] ?? ""}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* === Statuts === */}
      <section className="card-elevated p-6 md:p-8">
        <h2 className="font-display text-lg font-semibold mb-4">Publication</h2>
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={initial?.featured ?? false} className="h-4 w-4 accent-[var(--brand-500)]" />
            Mis en avant
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} className="h-4 w-4 accent-[var(--brand-500)]" />
            Publié
          </label>
        </div>
      </section>

      <Submit />
    </form>
  );
}
