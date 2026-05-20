import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { randomBytes } from "node:crypto";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = join(process.cwd(), "private", "uploads");
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const ALLOWED = new Set([
  "application/pdf",
  "image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml",
  "application/zip",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain", "text/markdown", "text/csv",
]);

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const projectId = String(form.get("projectId") ?? "");
  const slug = String(form.get("slug") ?? "");
  const category = String(form.get("category") ?? "DOC");
  const label = String(form.get("label") ?? "").trim();

  if (!(file instanceof File) || !projectId) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }
  if (file.type && !ALLOWED.has(file.type)) {
    return NextResponse.json({ ok: false, error: "type" }, { status: 415 });
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return NextResponse.json({ ok: false, error: "no_project" }, { status: 404 });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = extname(file.name).slice(0, 12).replace(/[^.a-zA-Z0-9]/g, "");
  const stored = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(UPLOAD_DIR, stored), buffer);

  await prisma.projectResource.create({
    data: {
      projectId,
      kind: "FILE",
      category: (["SPEC","DESIGN","DOC","REPORT","ASSET","OTHER"].includes(category)
        ? category : "DOC") as never,
      label: label || file.name,
      filePath: stored,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || "application/octet-stream",
      uploadedById: session.user.id,
    },
  });

  return NextResponse.json({ ok: true, slug });
}
