"use server";

import { z } from "zod";
import { put, del } from "@vercel/blob";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireSession, requireAdmin } from "@/lib/auth-helpers";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

const nameSchema = z.string().trim().min(1, "Ponle un nombre a la estrategia").max(120);
const resumenSchema = z.string().trim().min(1, "Escribe un resumen breve").max(300);
const explicacionSchema = z.string().trim().min(1, "Explica la estrategia").max(8000);

/**
 * Genera un code corto y (prácticamente) único a partir del nombre, para no
 * pedírselo a quien crea la estrategia — solo sirve de etiqueta de
 * referencia, no hace falta que lo piense nadie.
 */
function stripDiacritics(s: string) {
  // Evita un rango de escape Unicode literal en el regex (frágil de
  // teclear/editar sin corromperlo): NFD separa cada letra acentuada en
  // base + marca combinante, y aquí simplemente descartamos cualquier
  // carácter fuera del rango ASCII imprimible.
  return Array.from(s.normalize("NFD"))
    .filter((ch) => ch.codePointAt(0)! < 128)
    .join("");
}

function slugCode(name: string) {
  const base =
    stripDiacritics(name)
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24) || "ESTRATEGIA";
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${suffix}`;
}

/**
 * Crea una estrategia del playbook — solo un admin: el contenido base debe
 * quedar curado, a diferencia de las verificaciones (backtesting), que sí
 * puede añadir cualquier usuario.
 */
export async function createStrategy(_prev: string | null, formData: FormData): Promise<string | null> {
  const session = await requireAdmin();

  const name = nameSchema.safeParse(formData.get("name"));
  if (!name.success) return name.error.issues[0]?.message ?? "Nombre inválido";

  const resumen = resumenSchema.safeParse(formData.get("resumen"));
  if (!resumen.success) return resumen.error.issues[0]?.message ?? "Resumen inválido";

  const explicacion = explicacionSchema.safeParse(formData.get("explicacion"));
  if (!explicacion.success) return explicacion.error.issues[0]?.message ?? "Explicación inválida";

  const strategy = await prisma.strategy.create({
    data: {
      code: slugCode(name.data),
      name: name.data,
      resumen: resumen.data,
      explicacion: explicacion.data,
      // Nace oculta a propósito: el admin la revisa en su propia página de
      // detalle y la publica cuando esté conforme (ver setStrategyVisible).
      visible: false,
      createdById: session.user.id,
    },
  });

  revalidatePath("/playbook");
  redirect(`/playbook/${strategy.id}`);
}

/** Publica u oculta una estrategia — solo admin, es la revisión antes de que la vea el grupo. */
export async function setStrategyVisible(id: string, visible: boolean) {
  await requireAdmin();

  await prisma.strategy.update({ where: { id }, data: { visible } });
  revalidatePath("/playbook");
  revalidatePath(`/playbook/${id}`);
}

/** Quien creó la estrategia, o un admin, puede eliminarla (y sus verificaciones, en cascada). */
export async function deleteStrategy(id: string) {
  const session = await requireSession();

  const strategy = await prisma.strategy.findUnique({ where: { id } });
  if (!strategy) throw new Error("Estrategia no encontrada");

  const isOwner = strategy.createdById === session.user.id;
  if (!isOwner && session.user.role !== "ADMIN") {
    throw new Error("No tienes permiso para eliminar esta estrategia");
  }

  await prisma.strategy.delete({ where: { id } });
  revalidatePath("/playbook");
}

// ---- Verificaciones (backtesting manual sobre la estrategia) ----

const symbolSchema = z.string().trim().min(1, "Indica el símbolo o valor").max(40);
const levelSchema = z.string().trim().min(1, "Indica el nivel").max(40);
const backtestResultSchema = z.enum(["CON_BENEFICIOS", "NEUTRA", "SIN_BENEFICIOS"]);
const descriptionSchema = z
  .string()
  .trim()
  .min(1, "Describe cómo ha ido el backtesting")
  .max(4000);

/** Crea una verificación (backtesting) de una estrategia: sube la imagen a Vercel Blob y guarda el registro. */
export async function createVerification(_prev: string | null, formData: FormData): Promise<string | null> {
  const session = await requireSession();

  const strategyId = formData.get("strategyId");
  if (typeof strategyId !== "string" || !strategyId) return "Falta la estrategia";
  const strategy = await prisma.strategy.findUnique({ where: { id: strategyId } });
  if (!strategy) return "Estrategia no encontrada";
  // Refuerzo server-side: una estrategia oculta es "no encontrada" para
  // quien no sea admin, igual que si no existiera — no solo se oculta en
  // la UI, tampoco se puede verificar por detrás conociendo el id.
  if (!strategy.visible && session.user.role !== "ADMIN") {
    return "Estrategia no encontrada";
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return "Selecciona una imagen";
  }
  if (!image.type.startsWith("image/")) {
    return "El archivo debe ser una imagen";
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return "La imagen no puede superar 5MB";
  }

  // Segunda imagen opcional: los resultados del backtesting. Si no se
  // adjunta, se guarda como null — a diferencia de la primera, no es
  // obligatoria.
  const backtestImage = formData.get("backtestImage");
  const hasBacktestImage = backtestImage instanceof File && backtestImage.size > 0;
  if (hasBacktestImage) {
    if (!backtestImage.type.startsWith("image/")) {
      return "La segunda imagen debe ser una imagen";
    }
    if (backtestImage.size > MAX_IMAGE_BYTES) {
      return "La segunda imagen no puede superar 5MB";
    }
  }

  const symbol = symbolSchema.safeParse(formData.get("symbol"));
  if (!symbol.success) return symbol.error.issues[0]?.message ?? "Símbolo inválido";

  const takeProfit = levelSchema.safeParse(formData.get("takeProfit"));
  if (!takeProfit.success) return "Indica el nivel de take profit";

  const stopLoss = levelSchema.safeParse(formData.get("stopLoss"));
  if (!stopLoss.success) return "Indica el nivel de stop loss";

  const backtestResult = backtestResultSchema.safeParse(formData.get("backtestResult"));
  if (!backtestResult.success) return "Indica si el backtesting dio beneficios";

  const description = descriptionSchema.safeParse(formData.get("description"));
  if (!description.success) return description.error.issues[0]?.message ?? "Descripción inválida";

  const pineScriptRaw = formData.get("pineScript");
  const pineScript =
    typeof pineScriptRaw === "string" && pineScriptRaw.trim() ? pineScriptRaw.trim() : null;

  let blobUrl: string;
  try {
    const blob = await put(`playbook/${session.user.id}-${Date.now()}-${image.name}`, image, {
      access: "public",
      addRandomSuffix: true,
    });
    blobUrl = blob.url;
  } catch {
    return "No se pudo subir la imagen. ¿Está configurado el almacenamiento de Vercel Blob?";
  }

  let backtestBlobUrl: string | null = null;
  if (hasBacktestImage) {
    try {
      const blob = await put(
        `playbook/backtest-${session.user.id}-${Date.now()}-${backtestImage.name}`,
        backtestImage,
        { access: "public", addRandomSuffix: true }
      );
      backtestBlobUrl = blob.url;
    } catch {
      return "No se pudo subir la segunda imagen. ¿Está configurado el almacenamiento de Vercel Blob?";
    }
  }

  await prisma.strategyVerification.create({
    data: {
      strategyId: strategy.id,
      imageUrl: blobUrl,
      backtestImageUrl: backtestBlobUrl,
      symbol: symbol.data,
      takeProfit: takeProfit.data,
      stopLoss: stopLoss.data,
      backtestResult: backtestResult.data,
      description: description.data,
      pineScript,
      createdById: session.user.id,
    },
  });

  revalidatePath(`/playbook/${strategy.id}`);
  redirect(`/playbook/${strategy.id}`);
}

/** Quien creó la verificación, o un admin, puede eliminarla. */
export async function deleteVerification(id: string) {
  const session = await requireSession();

  const verification = await prisma.strategyVerification.findUnique({ where: { id } });
  if (!verification) throw new Error("Verificación no encontrada");

  const isOwner = verification.createdById === session.user.id;
  if (!isOwner && session.user.role !== "ADMIN") {
    throw new Error("No tienes permiso para eliminar esta verificación");
  }

  await prisma.strategyVerification.delete({ where: { id } });

  // Best-effort, igual que en deleteAlert — cada una en su propio try/catch
  // para que un fallo en una no impida intentar borrar la otra. La segunda
  // imagen es opcional, así que puede no haber nada que borrar.
  try {
    await del(verification.imageUrl);
  } catch {
    // ignorado a propósito
  }
  if (verification.backtestImageUrl) {
    try {
      await del(verification.backtestImageUrl);
    } catch {
      // ignorado a propósito
    }
  }

  revalidatePath(`/playbook/${verification.strategyId}`);
}
