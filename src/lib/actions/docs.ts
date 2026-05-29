"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const schema = z.object({
  slug: z.string().min(2),
  title_fr: z.string().min(2),
  title_en: z.string().min(2),
  summary_fr: z.string().optional(),
  summary_en: z.string().optional(),
  content_fr: z.string().min(1),
  content_en: z.string().min(1),
  category_fr: z.string().optional(),
  category_en: z.string().optional(),
  icon: z.string().optional(),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(true),
});

function parse(formData: FormData) {
  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const data = schema.parse({
    ...raw,
    published: raw.published === "on",
  });
  return {
    ...data,
    summary_fr: data.summary_fr || null,
    summary_en: data.summary_en || null,
    category_fr: data.category_fr || null,
    category_en: data.category_en || null,
    icon: data.icon || null,
  };
}

export async function createDoc(formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  await prisma.doc.create({ data });
  revalidatePath("/admin/docs");
  redirect("/admin/docs");
}

export async function updateDoc(id: string, formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  await prisma.doc.update({ where: { id }, data });
  revalidatePath("/admin/docs");
  redirect("/admin/docs");
}

export async function deleteDoc(id: string) {
  await requireAdmin();
  await prisma.doc.delete({ where: { id } });
  revalidatePath("/admin/docs");
}
