import { auth } from "./auth";

/** Requires an ADMIN session — throws otherwise. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/** Requires a STAFF or ADMIN session (internal team) — throws otherwise. */
export async function requireStaff() {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "STAFF")) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/** True when the session may edit internal data (ADMIN only). */
export function canEditInternal(role?: string | null) {
  return role === "ADMIN";
}
