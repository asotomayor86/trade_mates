import { notFound } from "next/navigation";

import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/alerts/status-badge";
import { SeenToggle } from "@/components/alerts/seen-toggle";
import { VerdictButtons } from "@/components/alerts/verdict-buttons";
import { shortDateTime } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export default async function AlertaDetailPage(props: PageProps<"/alertas/[id]">) {
  const { id } = await props.params;
  const session = await requireSession();

  const alert = await prisma.alert.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, displayName: true } },
      seenBy: {
        select: { userId: true, seenAt: true, user: { select: { displayName: true } } },
        orderBy: { seenAt: "asc" },
      },
    },
  });

  if (!alert) notFound();

  const seenByMe = alert.seenBy.some((s) => s.userId === session.user.id);
  const isOwner = alert.createdById === session.user.id;
  const canJudge = (isOwner || session.user.role === "ADMIN") && !alert.verdict;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
      <Card className="gap-0 overflow-hidden p-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={alert.imageUrl}
          alt="Captura de la alerta"
          className="w-full border-b border-[var(--borde)] object-contain"
        />
        <div className="flex flex-col gap-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <StatusBadge verdict={alert.verdict} reviewAt={alert.reviewAt} />
            <span className="text-xs text-muted-foreground">
              {alert.createdBy?.displayName ?? "usuario eliminado"} ·{" "}
              {shortDateTime(alert.createdAt)}
            </span>
          </div>

          <p className="whitespace-pre-wrap text-sm">{alert.comment}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Visto por {alert.seenBy.length}
              {alert.seenBy.length > 0 &&
                `: ${alert.seenBy.map((s) => s.user.displayName).join(", ")}`}
            </span>
            <SeenToggle alertId={alert.id} seen={seenByMe} />
          </div>

          {canJudge && <VerdictButtons alertId={alert.id} />}
        </div>
      </Card>
    </div>
  );
}
