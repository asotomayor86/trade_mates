import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { VerificationCard } from "@/components/playbook/verification-card";

export const dynamic = "force-dynamic";

export default async function VerificationDetailPage(
  props: PageProps<"/playbook/[id]/[verificationId]">
) {
  const { id, verificationId } = await props.params;
  const session = await requireSession();

  const verification = await prisma.strategyVerification.findUnique({
    where: { id: verificationId },
    include: {
      strategy: { select: { id: true, name: true, visible: true } },
      createdBy: { select: { displayName: true } },
    },
  });

  // No solo "no existe": también si el id de estrategia en la URL no es el
  // suyo (enlace manipulado a mano) — evita una verificación mostrada bajo
  // una estrategia que no es la propia.
  if (!verification || verification.strategy.id !== id) notFound();

  const isAdmin = session.user.role === "ADMIN";
  // Misma regla que en la propia estrategia: oculta = no existe para quien
  // no sea admin.
  if (!verification.strategy.visible && !isAdmin) notFound();

  const canDelete = verification.createdById === session.user.id || isAdmin;

  return (
    // Más ancho que el resto de páginas del Playbook a propósito: aquí lo
    // importante son los gráficos, que se aprovechan de todo el espacio.
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4">
      <Link
        href={`/playbook/${verification.strategy.id}`}
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {verification.strategy.name}
      </Link>

      <VerificationCard
        verification={{
          id: verification.id,
          strategyId: verification.strategy.id,
          imageUrl: verification.imageUrl,
          backtestImageUrl: verification.backtestImageUrl,
          symbol: verification.symbol,
          takeProfit: verification.takeProfit,
          stopLoss: verification.stopLoss,
          backtestResult: verification.backtestResult,
          description: verification.description,
          pineScript: verification.pineScript,
          createdAt: verification.createdAt,
          createdBy: verification.createdBy,
          canDelete,
        }}
      />
    </div>
  );
}
