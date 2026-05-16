"use client";

import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import type { TeamMember } from "@prisma/client";
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

export function TeamForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<TeamMember>;
}) {
  return (
    <form action={action} className="card-elevated p-6 md:p-8 space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nom complet *</Label>
          <Input id="name" name="name" required defaultValue={initial?.name ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" name="slug" required defaultValue={initial?.slug ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role_fr">Rôle FR *</Label>
          <Input id="role_fr" name="role_fr" required defaultValue={initial?.role_fr ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role_en">Role EN *</Label>
          <Input id="role_en" name="role_en" required defaultValue={initial?.role_en ?? ""} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="bio_fr">Bio FR</Label>
          <Textarea id="bio_fr" name="bio_fr" rows={3} defaultValue={initial?.bio_fr ?? ""} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="bio_en">Bio EN</Label>
          <Textarea id="bio_en" name="bio_en" rows={3} defaultValue={initial?.bio_en ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="photo">Photo (URL)</Label>
          <Input id="photo" name="photo" defaultValue={initial?.photo ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" name="linkedin" type="url" defaultValue={initial?.linkedin ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={initial?.email ?? ""} />
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
