"use server";

import { revalidatePath } from "next/cache";
import type { ApplicationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  await requireAdmin();
  await prisma.jobApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/applications");
}

export async function deleteApplication(id: string) {
  await requireAdmin();
  await prisma.jobApplication.delete({ where: { id } });
  revalidatePath("/admin/applications");
}
