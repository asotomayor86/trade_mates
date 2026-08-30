import Link from "next/link";

import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { type AlertCardData } from "@/components/alerts/alert-card";
import { AlertsView } from "@/components/alerts/alerts-view";
import { composeAlertTitle } from "@/lib/alert-options";

export const dynamic = "force-dynamic";

export default async function AlertasPage() {
  const session = await requireSession();

  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: { displayName: true } },
      seenBy: { where: { userId: session.user.id }, select: { id: true } },
      _count: { select: { seenBy: true } },
    },
  });

  const data: AlertCardData[] = alerts.map((a) => ({
    id: a.id,
    imageUrl: a.imageUrl,
    comment: a.comment,
    symbol: a.symbol,
    sentido: a.sentido,
    basadoEn: a.basadoEn,
    title: composeAlertTitle(a.symbol, a.sentido, a.basadoEn),
    reviewAt: a.reviewAt,
    verdict: a.verdict,
    createdAt: a.createdAt,
    createdBy: a.createdBy,
    seenByMe: a.seenBy.length > 0,
    seenCount: a._count.seenBy,
  }));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="seccion-titulo text-xl">Alertas</h1>
        <Button
          nativeButton={false}
          render={<Link href="/alertas/nueva">Nueva alerta</Link>}
        />
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nadie ha publicado ninguna alerta todavía.
        </p>
      ) : (
        <AlertsView alerts={data} />
      )}
    </div>
  );
}
