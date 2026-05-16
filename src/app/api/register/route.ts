import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(120),
  company: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "exists" },
        { status: 409 }
      );
    }
    const hash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hash,
        company: parsed.data.company,
        phone: parsed.data.phone,
        role: "CLIENT",
      },
      select: { id: true, email: true, name: true },
    });
    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
