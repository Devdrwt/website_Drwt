"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const schema = z.object({
  slug: z.string().min(2).max(120),
  category: z.enum(["CONSULTING", "IT_SECURITY", "SOFTWARE", "ELEARNING", "MEDIA", "WEB"]),
  title_fr: z.string().min(2),
  title_en: z.string().min(2),
  client: z.string().max(120).optional(),
  summary_fr: z.string().min(10),
  summary_en: z.string().min(10),
  content_fr: z.string().min(10),
  content_en: z.string().min(10),

  challenge_fr: z.string().optional(),
  challenge_en: z.string().optional(),
  discover_fr:  z.string().optional(),
  discover_en:  z.string().optional(),
  define_fr:    z.string().optional(),
  define_en:    z.string().optional(),
  develop_fr:   z.string().optional(),
  develop_en:   z.string().optional(),
  deliver_fr:   z.string().optional(),
  deliver_en:   z.string().optional(),
  duration:     z.string().max(60).optional(),
  teamSize:     z.coerce.number().int().min(0).optional(),

  coverImage: z.string().min(2),
  liveUrl: z.string().url().optional().or(z.literal("")),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(true),
});

function parseForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return schema.parse({
    ...raw,
    featured: raw.featured === "on" || raw.featured === "true",
    published: raw.published === "on" || raw.published === "true",
  });
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  const data = parseForm(formData);
  await prisma.project.create({
    data: { ...data, liveUrl: data.liveUrl || null },
  });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  redirect("/admin/portfolio");
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseForm(formData);
  await prisma.project.update({
    where: { id },
    data: { ...data, liveUrl: data.liveUrl || null },
  });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${data.slug}`);
  redirect("/admin/portfolio");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}
