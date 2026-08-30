import Link from "next/link";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/alerts/status-badge";
import { SeenToggle } from "@/components/alerts/seen-toggle";
import { SentidoBadge } from "@/components/alerts/sentido-badge";
import { shortDateTime } from "@/lib/format-date";
import type { AlertCardData } from "@/components/alerts/alert-card";

/** Fila compacta para la vista en lista: misma información que AlertCard, más densa. */
export function AlertListItem({ alert }: { alert: AlertCardData }) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="flex items-center gap-3 p-3">
        <Link href={`/alertas/${alert.id}`} className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={alert.imageUrl}
            alt="Captura de la alerta"
            className="size-16 rounded-md border border-[var(--borde)] object-cover"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <SentidoBadge sentido={alert.sentido} />
            <Link
              href={`/alertas/${alert.id}`}
              className="truncate text-sm font-semibold text-foreground hover:underline"
            >
              {alert.title}
            </Link>
          </div>
          <p className="truncate text-xs text-muted-foreground">{alert.comment}</p>
          <span className="text-[11px] text-muted-foreground">
            {alert.createdBy?.displayName ?? "usuario eliminado"} ·{" "}
            {shortDateTime(alert.createdAt)} · Visto por {alert.seenCount}
          </span>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <StatusBadge verdict={alert.verdict} reviewAt={alert.reviewAt} />
          <SeenToggle alertId={alert.id} seen={alert.seenByMe} />
        </div>
      </div>
    </Card>
  );
}
