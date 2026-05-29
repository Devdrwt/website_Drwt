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
  excerpt_fr: z.string().optional(),
  excerpt_en: z.string().optional(),
  content_fr: z.string().min(1),
  content_en: z.string().min(1),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(true),
});

function parse(formData: FormData) {
  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const data = schema.parse({
    ...raw,
    featured: raw.featured === "on",
    published: raw.published === "on",
  });
  return {
    ...data,
    excerpt_fr: data.excerpt_fr || null,
    excerpt_en: data.excerpt_en || null,
    coverImage: data.coverImage || null,
    category: data.category || null,
    author: data.author || null,
  };
}

export async function createArticle(formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  await prisma.article.create({ data });
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  await prisma.article.update({ where: { id }, data });
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
}
