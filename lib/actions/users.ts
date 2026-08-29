"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

const roleSchema = z.enum(["ADMIN", "USER"]);

async function countAdmins() {
  return prisma.user.count({ where: { role: "ADMIN" } });
}

/** Cambia el rol de un usuario. No permite quedarse sin ningún ADMIN. */
export async function updateUserRole(userId: string, roleInput: string) {
  await requireAdmin();

  const parsed = roleSchema.safeParse(roleInput);
  if (!parsed.success) throw new Error("Rol inválido");

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) throw new Error("Usuario no encontrado");

  if (target.role === "ADMIN" && parsed.data === "USER") {
    const admins = await countAdmins();
    if (admins <= 1) throw new Error("No puedes quitar el último administrador");
  }

  await prisma.user.update({ where: { id: userId }, data: { role: parsed.data } });
  revalidatePath("/admin");
}

/** Elimina un usuario. No permite eliminarte a ti mismo ni al último ADMIN. */
export async function deleteUser(userId: string) {
  const session = await requireAdmin();

  if (userId === session.user.id) {
    throw new Error("No puedes eliminar tu propia cuenta");
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) throw new Error("Usuario no encontrado");

  if (target.role === "ADMIN") {
    const admins = await countAdmins();
    if (admins <= 1) throw new Error("No puedes eliminar al último administrador");
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin");
}
