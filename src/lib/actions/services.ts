"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const schema = z.object({
  slug: z.string().min(2).max(80),
  category: z.enum(["CONSULTING", "IT_SECURITY", "SOFTWARE", "ELEARNING", "MEDIA", "WEB"]),
  icon: z.string().min(1).max(60),
  title_fr: z.string().min(2).max(160),
  title_en: z.string().min(2).max(160),
  subtitle_fr: z.string().max(400).optional(),
  subtitle_en: z.string().max(400).optional(),
  description_fr: z.string().min(10),
  description_en: z.string().min(10),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(true),
});

function parseForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return schema.parse({
    ...raw,
    published: raw.published === "on" || raw.published === "true",
  });
}

export async function createService(formData: FormData) {
  await requireAdmin();
  const data = parseForm(formData);
  await prisma.service.create({ data });
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateService(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseForm(formData);
  await prisma.service.update({ where: { id }, data });
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
}
