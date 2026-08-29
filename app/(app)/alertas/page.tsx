import Link from "next/link";

import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { AlertCard, type AlertCardData } from "@/components/alerts/alert-card";

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
