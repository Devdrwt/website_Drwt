"use client";

import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import type { JobOpening } from "@prisma/client";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"] as const;

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="gradient" size="lg" disabled={pending}>
      <Save className="h-4 w-4" />
      {pending ? "Enregistrement..." : "Enregistrer"}
    </Button>
  );
}

export function JobForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<JobOpening>;
}) {
  return (
    <form action={action} className="card-elevated p-6 md:p-8 space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" name="slug" required defaultValue={initial?.slug ?? ""} />
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
          <Label htmlFor="department">Département *</Label>
          <Input id="department" name="department" required defaultValue={initial?.department ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Lieu *</Label>
          <Input id="location" name="location" required defaultValue={initial?.location ?? "Cotonou"} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="type">Type de contrat</Label>
          <select
            id="type" name="type"
            defaultValue={initial?.type ?? "FULL_TIME"}
            className="h-12 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 text-sm"
          >
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-end gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="remote" defaultChecked={initial?.remote ?? false} className="h-4 w-4 accent-[var(--brand-500)]" />
            Remote OK
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} className="h-4 w-4 accent-[var(--brand-500)]" />
            Publié
          </label>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="description_fr">Description FR *</Label>
          <Textarea id="description_fr" name="description_fr" rows={6} required defaultValue={initial?.description_fr ?? ""} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="description_en">Description EN *</Label>
          <Textarea id="description_en" name="description_en" rows={6} required defaultValue={initial?.description_en ?? ""} />
        </div>
      </div>
      <Submit />
    </form>
  );
}
