"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function toggleMessageHandled(id: string, handled: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { handled } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
