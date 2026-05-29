"use client";

import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import type { Doc } from "@prisma/client";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="gradient" size="lg" disabled={pending}>
      <Save className="h-4 w-4" />
      {pending ? "Enregistrement..." : "Enregistrer"}
    </Button>
  );
}

export function DocForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<Doc>;
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
          <Label htmlFor="category_fr">Catégorie FR</Label>
          <Input id="category_fr" name="category_fr" defaultValue={initial?.category_fr ?? ""} placeholder="Démarrage, Guides, API…" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category_en">Category EN</Label>
          <Input id="category_en" name="category_en" defaultValue={initial?.category_en ?? ""} placeholder="Getting started, Guides, API…" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="icon">Icône (lucide)</Label>
          <Input id="icon" name="icon" defaultValue={initial?.icon ?? ""} placeholder="BookOpen, FileText…" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="order">Ordre</Label>
          <Input id="order" name="order" type="number" defaultValue={String(initial?.order ?? 0)} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="summary_fr">Résumé FR</Label>
          <Textarea id="summary_fr" name="summary_fr" rows={2} defaultValue={initial?.summary_fr ?? ""} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="summary_en">Summary EN</Label>
          <Textarea id="summary_en" name="summary_en" rows={2} defaultValue={initial?.summary_en ?? ""} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="content_fr">Contenu FR *</Label>
          <Textarea id="content_fr" name="content_fr" rows={10} required defaultValue={initial?.content_fr ?? ""} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="content_en">Content EN *</Label>
          <Textarea id="content_en" name="content_en" rows={10} required defaultValue={initial?.content_en ?? ""} />
        </div>
        <div className="flex items-end gap-4 md:col-span-2">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} className="h-4 w-4 accent-[var(--brand-500)]" />
            Publié
          </label>
        </div>
      </div>
      <Submit />
    </form>
  );
}
