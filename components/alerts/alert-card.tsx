import Link from "next/link";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/alerts/status-badge";
import { SeenToggle } from "@/components/alerts/seen-toggle";
import { SentidoBadge } from "@/components/alerts/sentido-badge";
import { shortDateTime } from "@/lib/format-date";
import type { Sentido, BasadoEn } from "@/lib/alert-options";

export type AlertCardData = {
  id: string;
  imageUrl: string;
  comment: string;
  symbol: string;
  sentido: Sentido;
  basadoEn: BasadoEn;
  title: string;
  reviewAt: Date;
  verdict: "CIERTA" | "INCIERTA" | null;
  createdAt: Date;
  createdBy: { displayName: string } | null;
  seenByMe: boolean;
  seenCount: number;
  // La ve el propio creador: sin sentido marcarse "visto" algo que uno mismo
  // ha publicado, así que el botón de vista/no vista se oculta para él.
  isMine: boolean;
};

export function AlertCard({ alert }: { alert: AlertCardData }) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <Link href={`/alertas/${alert.id}`} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={alert.imageUrl}
          alt="Captura de la alerta"
          className="h-48 w-full border-b border-[var(--borde)] object-cover"
        />
      </Link>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <StatusBadge verdict={alert.verdict} reviewAt={alert.reviewAt} />
          <span className="text-xs text-muted-foreground">
            {alert.createdBy?.displayName ?? "usuario eliminado"} ·{" "}
            {shortDateTime(alert.createdAt)}
          </span>
        </div>
        <Link href={`/alertas/${alert.id}`} className="flex flex-col gap-1">
          <SentidoBadge sentido={alert.sentido} />
          <p className="text-sm font-semibold text-foreground hover:underline">
            {alert.title}
          </p>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {alert.comment}
          </p>
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Visto por {alert.seenCount}
          </span>
          {!alert.isMine && <SeenToggle alertId={alert.id} seen={alert.seenByMe} />}
        </div>
      </div>
    </Card>
  );
}
