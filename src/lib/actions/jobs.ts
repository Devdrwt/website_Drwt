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
  department: z.string().min(2),
  location: z.string().min(2),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]).default("FULL_TIME"),
  description_fr: z.string().min(10),
  description_en: z.string().min(10),
  remote: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(true),
});

function parse(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return schema.parse({
    ...raw,
    remote: raw.remote === "on",
    published: raw.published === "on",
  });
}

export async function createJob(formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  await prisma.jobOpening.create({ data });
  revalidatePath("/admin/jobs");
  redirect("/admin/jobs");
}

export async function updateJob(id: string, formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  await prisma.jobOpening.update({ where: { id }, data });
  revalidatePath("/admin/jobs");
  redirect("/admin/jobs");
}

export async function deleteJob(id: string) {
  await requireAdmin();
  await prisma.jobOpening.delete({ where: { id } });
  revalidatePath("/admin/jobs");
}
