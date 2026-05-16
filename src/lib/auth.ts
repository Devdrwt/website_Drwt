import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "./prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "CLIENT";
    } & DefaultSession["user"];
  }
  interface User {
    role?: "ADMIN" | "CLIENT";
  }
}

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user?.password) return null;

        const ok = await bcrypt.compare(parsed.data.password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: "ADMIN" | "CLIENT" }).role ?? "CLIENT";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "ADMIN" | "CLIENT") ?? "CLIENT";
      }
      return session;
    },
  },
});
