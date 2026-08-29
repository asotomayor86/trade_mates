"use server";

import { z } from "zod";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { hashPassword, generateInvitationToken } from "@/lib/password";
import { requireAdmin } from "@/lib/auth-helpers";
import { signIn } from "@/auth";

const roleSchema = z.enum(["ADMIN", "USER"]);

/** Crea una invitación de un solo uso con el rol indicado. Solo ADMIN. */
export async function createInvitation(_prev: unknown, formData: FormData) {
  const session = await requireAdmin();

  const parsed = roleSchema.safeParse(formData.get("role"));
  if (!parsed.success) return { ok: false as const, error: "Rol inválido" };

  await prisma.invitation.create({
    data: {
      token: generateInvitationToken(),
      role: parsed.data,
      createdById: session.user.id,
    },
  });

  revalidatePath("/admin");
  return { ok: true as const };
}

/** Revoca una invitación pendiente (nunca una ya usada). Solo ADMIN. */
export async function revokeInvitation(id: string) {
  await requireAdmin();

  const result = await prisma.invitation.deleteMany({
    where: { id, usedAt: null },
  });
  if (result.count === 0) {
    throw new Error("La invitación ya fue usada o no existe");
  }

  revalidatePath("/admin");
}

const acceptSchema = z
  .object({
    username: z
      .string()
      .min(3, "Mínimo 3 caracteres")
      .max(32, "Máximo 32 caracteres")
      .regex(/^[a-zA-Z0-9_.-]+$/, "Solo letras, números, punto, guion y guion bajo"),
    displayName: z.string().min(1, "Obligatorio").max(60),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

/**
 * Consume una invitación de un solo uso: crea la cuenta con el rol de la
 * invitación y fija la contraseña elegida por el invitado. Pública (sin
 * sesión) — el token es la propia credencial de acceso al formulario.
 *
 * Devuelve un mensaje de error, o nunca vuelve (redirige) si todo va bien —
 * mismo patrón que `authenticate` en lib/actions/auth.ts.
 */
export async function acceptInvitation(
  token: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const invitation = await prisma.invitation.findUnique({ where: { token } });
  if (!invitation || invitation.usedAt) {
    return "Esta invitación no es válida o ya se usó";
  }
  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    return "Esta invitación ha caducado";
  }

  const parsed = acceptSchema.safeParse({
    username: formData.get("username"),
    displayName: formData.get("displayName"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Datos inválidos";
  }

  const existing = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });
  if (existing) return "Ese usuario ya existe";

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        username: parsed.data.username,
        displayName: parsed.data.displayName,
        passwordHash,
        role: invitation.role,
      },
    });
    await tx.invitation.update({
      where: { id: invitation.id },
      data: { usedAt: new Date(), userId: user.id },
    });
  });

  try {
    await signIn("credentials", {
      username: parsed.data.username,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // La cuenta ya se creó bien; si el login automático fallara por lo
      // que sea, que entre a mano desde /login en vez de perder el registro.
      redirect("/login");
    }
    throw error;
  }

  return null;
}
