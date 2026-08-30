"use server";

import { z } from "zod";
import { put } from "@vercel/blob";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-helpers";
import { REVIEW_OPTIONS } from "@/lib/alert-options";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

const VALID_REVIEW_MINUTES = REVIEW_OPTIONS.map((o) => o.minutes);

const reviewMinutesSchema = z
  .string()
  .transform(Number)
  .refine((n) => VALID_REVIEW_MINUTES.includes(n as (typeof VALID_REVIEW_MINUTES)[number]));

const commentSchema = z.string().min(1, "Escribe un comentario").max(4000);
const symbolSchema = z.string().trim().min(1, "Indica el símbolo o valor").max(40);
const sentidoSchema = z.enum(["ALCISTA", "BAJISTA"]);
const basadoEnSchema = z.enum(["SOPORTES_RESISTENCIAS", "ONDAS", "INDICADORES"]);

/** Crea una alerta: sube la imagen a Vercel Blob y guarda el registro. */
export async function createAlert(_prev: string | null, formData: FormData): Promise<string | null> {
  const session = await requireSession();

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

  const comment = commentSchema.safeParse(formData.get("comment"));
  if (!comment.success) {
    return comment.error.issues[0]?.message ?? "Comentario inválido";
  }

  const symbol = symbolSchema.safeParse(formData.get("symbol"));
  if (!symbol.success) {
    return symbol.error.issues[0]?.message ?? "Símbolo inválido";
  }

  const sentido = sentidoSchema.safeParse(formData.get("sentido"));
  if (!sentido.success) {
    return "Indica si es alcista o bajista";
  }

  const basadoEn = basadoEnSchema.safeParse(formData.get("basadoEn"));
  if (!basadoEn.success) {
    return "Indica en qué basas la alerta";
  }

  const reviewMinutes = reviewMinutesSchema.safeParse(formData.get("reviewMinutes"));
  if (!reviewMinutes.success) {
    return "Plazo de revisión inválido";
  }

  let blobUrl: string;
  try {
    const blob = await put(`alertas/${session.user.id}-${Date.now()}-${image.name}`, image, {
      access: "public",
      addRandomSuffix: true,
    });
    blobUrl = blob.url;
  } catch {
    return "No se pudo subir la imagen. ¿Está configurado el almacenamiento de Vercel Blob?";
  }

  const reviewAt = new Date(Date.now() + reviewMinutes.data * 60_000);

  await prisma.alert.create({
    data: {
      imageUrl: blobUrl,
      comment: comment.data,
      symbol: symbol.data,
      sentido: sentido.data,
      basadoEn: basadoEn.data,
      reviewAt,
      createdById: session.user.id,
    },
  });

  revalidatePath("/alertas");
  redirect("/alertas");
}

/** Alterna la marca de "visto" del usuario actual para una alerta. */
export async function toggleSeen(alertId: string) {
  const session = await requireSession();

  const existing = await prisma.alertSeen.findUnique({
    where: { alertId_userId: { alertId, userId: session.user.id } },
  });

  if (existing) {
    await prisma.alertSeen.delete({ where: { id: existing.id } });
  } else {
    await prisma.alertSeen.create({
      data: { alertId, userId: session.user.id },
    });
  }

  revalidatePath("/alertas");
  revalidatePath(`/alertas/${alertId}`);
}

const verdictSchema = z.enum(["CIERTA", "INCIERTA"]);

/**
 * Solo quien creó la alerta puede valorarla (ni siquiera un admin, a
 * propósito: es una autorrevisión) y solo una vez ha pasado su propio plazo
 * de revisión. Se comprueba aquí también, no solo ocultando el botón en el
 * cliente — VerdictButtons ya no debería ser alcanzable en esas condiciones,
 * pero esta acción es la que de verdad lo impide.
 */
export async function setVerdict(alertId: string, verdictInput: string) {
  const session = await requireSession();

  const parsed = verdictSchema.safeParse(verdictInput);
  if (!parsed.success) throw new Error("Veredicto inválido");

  const alert = await prisma.alert.findUnique({ where: { id: alertId } });
  if (!alert) throw new Error("Alerta no encontrada");

  if (alert.createdById !== session.user.id) {
    throw new Error("Solo quien creó la alerta puede valorarla");
  }

  if (alert.reviewAt.getTime() > Date.now()) {
    throw new Error("Todavía no ha pasado el plazo de revisión");
  }

  await prisma.alert.update({
    where: { id: alertId },
    data: { verdict: parsed.data, verdictAt: new Date() },
  });

  revalidatePath("/alertas");
  revalidatePath(`/alertas/${alertId}`);
}
