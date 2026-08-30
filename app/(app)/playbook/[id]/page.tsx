import { notFound } from "next/navigation";
import Link from "next/link";

import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VerificationCard } from "@/components/playbook/verification-card";
import { DeleteStrategyButton } from "@/components/playbook/delete-strategy-button";
import { shortDateTime } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export default async function StrategyDetailPage(props: PageProps<"/playbook/[id]">) {
  const { id } = await props.params;
  const session = await requireSession();

  const strategy = await prisma.strategy.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, displayName: true } },
      verifications: {
        orderBy: { createdAt: "desc" },
        include: { createdBy: { select: { displayName: true } } },
      },
    },
  });

  if (!strategy) notFound();

  const isOwner = strategy.createdById === session.user.id;
  const canDelete = isOwner || session.user.role === "ADMIN";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4">
      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge className="bg-[var(--superficie-2)] font-mono text-[10px] text-muted-foreground">
              {strategy.code}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {strategy.createdBy?.displayName ?? "Estrategia base"} ·{" "}
              {shortDateTime(strategy.createdAt)}
            </span>
          </div>

          <h1 className="text-xl font-semibold text-foreground">{strategy.name}</h1>
          <p className="whitespace-pre-wrap text-sm">{strategy.explicacion}</p>

          {canDelete && (
            <div className="flex justify-end border-t border-[var(--borde)] pt-3">
              <DeleteStrategyButton strategyId={strategy.id} />
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
        <div className="flex flex-col gap-4">
          {strategy.verifications.map((v) => (
            <VerificationCard
              key={v.id}
              verification={{
                id: v.id,
                imageUrl: v.imageUrl,
                symbol: v.symbol,
                takeProfit: v.takeProfit,
                stopLoss: v.stopLoss,
                description: v.description,
                pineScript: v.pineScript,
                createdAt: v.createdAt,
                createdBy: v.createdBy,
                canDelete: v.createdById === session.user.id || session.user.role === "ADMIN",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
