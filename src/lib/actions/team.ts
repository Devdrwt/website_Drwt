"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const schema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  role_fr: z.string().min(2),
  role_en: z.string().min(2),
  bio_fr: z.string().optional(),
  bio_en: z.string().optional(),
  photo: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(true),
});

function parse(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return schema.parse({ ...raw, published: raw.published === "on" });
}

export async function createMember(formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  await prisma.teamMember.create({ data });
  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function updateMember(id: string, formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  await prisma.teamMember.update({ where: { id }, data });
  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function deleteMember(id: string) {
  await requireAdmin();
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/admin/team");
}
