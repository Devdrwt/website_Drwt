import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  locale: z.string().optional(),
});

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let payload: unknown;
  if (contentType.includes("application/json")) {
    payload = await request.json();
  } else {
    const form = await request.formData();
    payload = Object.fromEntries(form.entries());
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: { active: true, locale: parsed.data.locale ?? "fr" },
    create: { email: parsed.data.email, locale: parsed.data.locale ?? "fr" },
  });

  return NextResponse.json({ ok: true });
}
