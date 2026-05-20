import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = join(process.cwd(), "private", "uploads");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "STAFF") {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const resource = await prisma.projectResource.findUnique({ where: { id } });
  if (!resource || resource.kind !== "FILE" || !resource.filePath) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // filePath is a generated base name — guard against traversal anyway
  if (resource.filePath.includes("/") || resource.filePath.includes("\\")) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  let data: Buffer;
  try {
    data = await readFile(join(UPLOAD_DIR, resource.filePath));
  } catch {
    return NextResponse.json({ error: "missing_file" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": resource.mimeType ?? "application/octet-stream",
      "Content-Disposition": `inline; filename="${encodeURIComponent(resource.fileName ?? "fichier")}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
