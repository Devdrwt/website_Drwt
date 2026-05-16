"use client";

import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import type { Service } from "@prisma/client";
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

export function ServiceForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<Service>;
}) {
  return (
    <form action={action} className="card-elevated p-6 md:p-8 space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" name="slug" required defaultValue={initial?.slug ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Catégorie *</Label>
          <select
            id="category"
            name="category"
            required
            defaultValue={initial?.category ?? "WEB"}
            className="h-12 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="icon">Icône (nom Lucide) *</Label>
          <Input id="icon" name="icon" required defaultValue={initial?.icon ?? "Code2"} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="title_fr">Titre FR *</Label>
          <Input id="title_fr" name="title_fr" required defaultValue={initial?.title_fr ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="title_en">Titre EN *</Label>
          <Input id="title_en" name="title_en" required defaultValue={initial?.title_en ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="subtitle_fr">Sous-titre FR</Label>
          <Input id="subtitle_fr" name="subtitle_fr" defaultValue={initial?.subtitle_fr ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="subtitle_en">Sous-titre EN</Label>
          <Input id="subtitle_en" name="subtitle_en" defaultValue={initial?.subtitle_en ?? ""} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="description_fr">Description FR *</Label>
          <Textarea id="description_fr" name="description_fr" rows={5} required defaultValue={initial?.description_fr ?? ""} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="description_en">Description EN *</Label>
          <Textarea id="description_en" name="description_en" rows={5} required defaultValue={initial?.description_en ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="order">Ordre</Label>
          <Input id="order" name="order" type="number" defaultValue={initial?.order ?? 0} />
        </div>
        <div className="flex items-end gap-2">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={initial?.published ?? true}
              className="h-4 w-4 accent-[var(--brand-500)]"
            />
            Publié
          </label>
        </div>
      </div>
      <Submit />
    </form>
  );
}
