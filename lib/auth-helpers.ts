import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Exige sesión activa; si no la hay, redirige a /login. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

/** Exige sesión de ADMIN; si no lo es, redirige al dashboard. */
export async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  return session;
}
