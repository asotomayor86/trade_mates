"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-helpers";
import { unstable_update } from "@/auth";

const displayNameSchema = z.string().trim().min(1, "Ponle un nombre").max(60);

/**
 * Cambia el nombre visible del propio usuario (clic sobre su nombre en la
 * cabecera). Solo el propio perfil — cambiar el de otro sigue sin existir,
 * ni falta que hace mientras el panel admin no lo pida.
 */
export async function updateDisplayName(displayName: string) {
  const session = await requireSession();

  const parsed = displayNameSchema.safeParse(displayName);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Nombre inválido");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { displayName: parsed.data },
  });

  // La sesión es JWT (ver auth.config.ts): sin esto el nombre nuevo no se
  // vería en la cabecera hasta el próximo login, porque el token ya lleva
  // horneado el nombre con el que se entró.
  await unstable_update({ user: { displayName: parsed.data } });

  // "/" + "layout": refresca toda la app, no solo una ruta — el nombre sale
  // en la cabecera de cualquier página.
  revalidatePath("/", "layout");
}
