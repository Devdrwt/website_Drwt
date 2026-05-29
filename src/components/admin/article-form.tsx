"use client";

import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import type { Article } from "@prisma/client";
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

export function ArticleForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<Article>;
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
          <Label htmlFor="category">Catégorie</Label>
          <Input id="category" name="category" defaultValue={initial?.category ?? ""} placeholder="Actualité, Tech, Entreprise…" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="author">Auteur</Label>
          <Input id="author" name="author" defaultValue={initial?.author ?? ""} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="coverImage">Image de couverture (URL)</Label>
          <Input id="coverImage" name="coverImage" defaultValue={initial?.coverImage ?? ""} placeholder="/images/… ou https://…" />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="excerpt_fr">Extrait FR</Label>
          <Textarea id="excerpt_fr" name="excerpt_fr" rows={2} defaultValue={initial?.excerpt_fr ?? ""} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="excerpt_en">Excerpt EN</Label>
          <Textarea id="excerpt_en" name="excerpt_en" rows={2} defaultValue={initial?.excerpt_en ?? ""} />
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
            <input type="checkbox" name="featured" defaultChecked={initial?.featured ?? false} className="h-4 w-4 accent-[var(--brand-500)]" />
            À la une
          </label>
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
