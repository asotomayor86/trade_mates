"use client";

import { useState } from "react";
import { LayoutGrid, List as ListIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AlertCard, type AlertCardData } from "@/components/alerts/alert-card";
import { AlertListItem } from "@/components/alerts/alert-list-item";

type ViewMode = "tarjetas" | "lista";

/**
 * Envuelve el listado de Alertas: selector tarjetas/lista arriba, y separa
 * las alertas en "No vistas" (primero, requieren atención) y "Vistas".
 */
export function AlertsView({ alerts }: { alerts: AlertCardData[] }) {
  const [mode, setMode] = useState<ViewMode>("tarjetas");

  const noVistas = alerts.filter((a) => !a.seenByMe);
  const vistas = alerts.filter((a) => a.seenByMe);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-1 self-end rounded-lg border border-[var(--borde)] bg-[var(--superficie-2)] p-1">
        <Button
          type="button"
          size="sm"
          variant={mode === "tarjetas" ? "default" : "ghost"}
          onClick={() => setMode("tarjetas")}
        >
          <LayoutGrid className="size-4" /> Tarjetas
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "lista" ? "default" : "ghost"}
          onClick={() => setMode("lista")}
        >
          <ListIcon className="size-4" /> Lista
        </Button>
      </div>

      <AlertGroup
        title="No vistas"
        alerts={noVistas}
        mode={mode}
        emptyText="No hay alertas pendientes de ver."
      />
      <AlertGroup
        title="Vistas"
        alerts={vistas}
        mode={mode}
        emptyText="Todavía no has marcado ninguna alerta como vista."
      />
    </div>
  );
}

function AlertGroup({
  title,
  alerts,
  mode,
  emptyText,
}: {
  title: string;
  alerts: AlertCardData[];
  mode: ViewMode;
  emptyText: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="seccion-titulo text-sm text-muted-foreground">
        {title} · {alerts.length}
      </h2>
      {alerts.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : mode === "tarjetas" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {alerts.map((alert) => (
            <AlertListItem key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </section>
  );
}
