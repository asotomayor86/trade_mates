import { notFound } from "next/navigation";
import Link from "next/link";

import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VerificationRow } from "@/components/playbook/verification-row";
import { DeleteStrategyButton } from "@/components/playbook/delete-strategy-button";
import { StrategyVisibilityToggle } from "@/components/playbook/strategy-visibility-toggle";
import { shortDateTime } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export default async function StrategyDetailPage(props: PageProps<"/playbook/[id]">) {
  const { id } = await props.params;
  const session = await requireSession();

  const strategy = await prisma.strategy.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, displayName: true } },
      // Solo lo que pinta VerificationRow (fila compacta, sin imágenes ni
      // descripción) — el resto se carga aparte en la página propia de
      // cada verificación.
      verifications: {
        orderBy: { createdAt: "desc" },
        select: { id: true, symbol: true, takeProfit: true, stopLoss: true, backtestResult: true },
      },
    },
  });

  if (!strategy) notFound();

  const isAdmin = session.user.role === "ADMIN";
  // Una estrategia oculta es "no existe" para cualquiera que no sea admin
  // — ni siquiera por enlace directo, igual que en createVerification.
  if (!strategy.visible && !isAdmin) notFound();

  const isOwner = strategy.createdById === session.user.id;
  const canDelete = isOwner || isAdmin;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4">
      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge className="bg-[var(--superficie-2)] font-mono text-[10px] text-muted-foreground">
                {strategy.code}
              </Badge>
              {!strategy.visible && (
                <Badge className="bg-[var(--oro)]/15 text-[var(--oro)]">Oculta</Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {strategy.createdBy?.displayName ?? "Estrategia base"} ·{" "}
              {shortDateTime(strategy.createdAt)}
            </span>
          </div>

          <h1 className="text-xl font-semibold text-foreground">{strategy.name}</h1>
          <p className="whitespace-pre-wrap text-sm">{strategy.explicacion}</p>

          {/* canDelete ya implica isAdmin cuando isAdmin es true (isOwner||isAdmin) */}
          {canDelete && (
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[var(--borde)] pt-3">
              {isAdmin && (
                <StrategyVisibilityToggle strategyId={strategy.id} visible={strategy.visible} />
              )}
              {canDelete && <DeleteStrategyButton strategyId={strategy.id} />}
            </div>
          )}
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="seccion-titulo text-lg">
          Verificaciones · {strategy.verifications.length}
        </h2>
        <Button
          nativeButton={false}
          render={<Link href={`/playbook/${strategy.id}/nueva`}>Nueva verificación</Link>}
        />
      </div>

      {strategy.verifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nadie ha probado esta estrategia todavía. Sé el primero en hacer un backtesting.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {strategy.verifications.map((v) => (
            <VerificationRow key={v.id} verification={v} strategyId={strategy.id} />
          ))}
        </div>
      )}
    </div>
  );
}
