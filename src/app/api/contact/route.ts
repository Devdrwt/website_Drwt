import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  company: z.string().max(120).optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  subject: z.string().max(200).optional().or(z.literal("")),
  budget: z.string().max(40).optional().or(z.literal("")),
  message: z.string().min(10).max(4000),
  source: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }
    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company || null,
        phone: parsed.data.phone || null,
        subject: parsed.data.subject || null,
        budget: parsed.data.budget || null,
        message: parsed.data.message,
        source: parsed.data.source || null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
