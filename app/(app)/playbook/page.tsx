import Link from "next/link";

import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { StrategyCard, type StrategyCardData } from "@/components/playbook/strategy-card";

export const dynamic = "force-dynamic";

export default async function PlaybookPage() {
  const session = await requireSession();
  const isAdmin = session.user.role === "ADMIN";

  const strategies = await prisma.strategy.findMany({
    // Los usuarios normales solo ven las publicadas; un admin las ve todas,
    // con las ocultas primero (son las que tiene pendientes de revisar).
    where: isAdmin ? {} : { visible: true },
    orderBy: [{ visible: "asc" }, { createdAt: "asc" }],
    include: {
      createdBy: { select: { displayName: true } },
      _count: { select: { verifications: true } },
    },
  });

  const data: StrategyCardData[] = strategies.map((s) => ({
    id: s.id,
    code: s.code,
    name: s.name,
    resumen: s.resumen,
    visible: s.visible,
    createdBy: s.createdBy,
    createdAt: s.createdAt,
    verificationCount: s._count.verifications,
  }));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="seccion-titulo text-xl">Playbook de estrategias</h1>
          <p className="text-sm text-muted-foreground">
            Estrategias explicadas para aprender juntos, con backtesting real de cada una.
          </p>
        </div>
        {isAdmin && (
          <Button
            nativeButton={false}
            render={<Link href="/playbook/nueva">Nueva estrategia</Link>}
          />
        )}
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no hay estrategias en el playbook.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((strategy) => (
            <StrategyCard key={strategy.id} strategy={strategy} />
          ))}
        </div>
      )}
    </div>
  );
}
