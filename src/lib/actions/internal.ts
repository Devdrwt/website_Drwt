"use server";

import { revalidatePath } from "next/cache";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const UPLOAD_DIR = join(process.cwd(), "private", "uploads");

function revalidateProject(slug: string) {
  revalidatePath("/internal");
  revalidatePath("/internal/projects");
  revalidatePath(`/internal/projects/${slug}`);
}

/* ---------- Project tracking (status / progress / priority / dates) ---------- */

const trackingSchema = z.object({
  projectId: z.string().min(1),
  slug: z.string().min(1),
  status: z.enum(["PROSPECT", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  progress: z.coerce.number().int().min(0).max(100),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function updateProjectTracking(formData: FormData) {
  await requireAdmin();
  const data = trackingSchema.parse(Object.fromEntries(formData.entries()));
  await prisma.project.update({
    where: { id: data.projectId },
    data: {
      status: data.status,
      priority: data.priority,
      progress: data.progress,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });
  revalidateProject(data.slug);
}

/* ---------- Resources (links) ---------- */

const resourceSchema = z.object({
  projectId: z.string().min(1),
  slug: z.string().min(1),
  category: z.enum(["SPEC", "DESIGN", "DOC", "REPORT", "ASSET", "OTHER"]),
  label: z.string().min(2).max(160),
  url: z.string().url(),
  note: z.string().max(500).optional(),
});

export async function createResourceLink(formData: FormData) {
  await requireAdmin();
  const data = resourceSchema.parse(Object.fromEntries(formData.entries()));
  await prisma.projectResource.create({
    data: {
      projectId: data.projectId,
      kind: "LINK",
      category: data.category,
      label: data.label,
      url: data.url,
      note: data.note || null,
    },
  });
  revalidateProject(data.slug);
}

export async function deleteResource(id: string, slug: string) {
  await requireAdmin();
  const resource = await prisma.projectResource.findUnique({ where: { id } });
  if (resource?.kind === "FILE" && resource.filePath) {
    await unlink(join(UPLOAD_DIR, resource.filePath)).catch(() => {});
  }
  await prisma.projectResource.delete({ where: { id } });
  revalidateProject(slug);
}

/* ---------- Access (links + references only — no secrets) ---------- */

const accessSchema = z.object({
  projectId: z.string().min(1),
  slug: z.string().min(1),
  environment: z.enum([
    "REPOSITORY", "STAGING", "PRODUCTION", "DESIGN_TOOL", "PROJECT_MGMT", "OTHER",
  ]),
  label: z.string().min(2).max(160),
  url: z.string().url().optional().or(z.literal("")),
  credentialHint: z.string().max(500).optional(),
});

export async function createAccess(formData: FormData) {
  await requireAdmin();
  const data = accessSchema.parse(Object.fromEntries(formData.entries()));
  await prisma.projectAccess.create({
    data: {
      projectId: data.projectId,
      environment: data.environment,
      label: data.label,
      url: data.url || null,
      credentialHint: data.credentialHint || null,
    },
  });
  revalidateProject(data.slug);
}

export async function deleteAccess(id: string, slug: string) {
  await requireAdmin();
  await prisma.projectAccess.delete({ where: { id } });
  revalidateProject(slug);
}

/* ---------- Notes ---------- */

const noteSchema = z.object({
  projectId: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(2).max(200),
  body: z.string().min(1),
  pinned: z.coerce.boolean().optional(),
});

export async function createNote(formData: FormData) {
  const session = await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const data = noteSchema.parse({ ...raw, pinned: raw.pinned === "on" });
  await prisma.projectNote.create({
    data: {
      projectId: data.projectId,
      title: data.title,
      body: data.body,
      pinned: data.pinned ?? false,
      authorId: session.user.id,
    },
  });
  revalidateProject(data.slug);
}

export async function deleteNote(id: string, slug: string) {
  await requireAdmin();
  await prisma.projectNote.delete({ where: { id } });
  revalidateProject(slug);
}
