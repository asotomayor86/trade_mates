"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { LayoutGrid, List as ListIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AlertCard, type AlertCardData } from "@/components/alerts/alert-card";
import { AlertListItem } from "@/components/alerts/alert-list-item";

type ViewMode = "tarjetas" | "lista";

// Mismo corte que el menú hamburguesa de la cabecera (sm:640px). Vía
// useSyncExternalStore en vez de useState+useEffect: evita setState
// síncrono dentro de un efecto (react-hooks/set-state-in-effect) y de paso
// reacciona a un resize real, no solo al valor inicial.
const MOBILE_QUERY = "(max-width: 639px)";
function subscribeToMobile(callback: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getIsMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}
function getIsMobileServerSnapshot() {
  return false; // SSR: escritorio por defecto, igual que el modo inicial "tarjetas".
}

/**
 * Página de Alertas: cabecera (título, selector tarjetas/lista y "Nueva
 * alerta" a la misma altura) y el listado en cuatro grupos: las de otros
 * (por si las has visto o no, que es lo que importa para ellas) primero, y
 * las mías al final (por si ya las he verificado o no — marcarme "visto" mi
 * propia alerta no tiene sentido, así que ese estado no aplica aquí). El
 * selector de vista solo tiene sentido si hay alertas que mostrar, pero la
 * cabecera con "Nueva alerta" siempre está.
 */
export function AlertsView({ alerts }: { alerts: AlertCardData[] }) {
  // null = el usuario no ha tocado el selector todavía: el modo por
  // defecto sigue al ancho de pantalla (Lista en móvil, Tarjetas si no).
  // En cuanto elige uno a mano, ese pasa a mandar y ya no se le pisa.
  const [manualMode, setManualMode] = useState<ViewMode | null>(null);
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getIsMobileSnapshot,
    getIsMobileServerSnapshot
  );
  const mode: ViewMode = manualMode ?? (isMobile ? "lista" : "tarjetas");
  const hasAlerts = alerts.length > 0;

  const deOtros = alerts.filter((a) => !a.isMine);
  const mias = alerts.filter((a) => a.isMine);

  const otrosNoVistas = deOtros.filter((a) => !a.seenByMe);
  const otrosVistas = deOtros.filter((a) => a.seenByMe);
  const miasNoVerificadas = mias.filter((a) => !a.verdict);
  const miasVerificadas = mias.filter((a) => a.verdict);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="seccion-titulo text-xl">Alertas</h1>
        <div className="flex items-center gap-2">
          {hasAlerts && (
            <div className="flex items-center gap-1 rounded-lg border border-[var(--borde)] bg-[var(--superficie-2)] p-1">
              <Button
                type="button"
                size="sm"
                variant={mode === "tarjetas" ? "default" : "ghost"}
                onClick={() => setManualMode("tarjetas")}
              >
                <LayoutGrid className="size-4" /> Tarjetas
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "lista" ? "default" : "ghost"}
                onClick={() => setManualMode("lista")}
              >
                <ListIcon className="size-4" /> Lista
              </Button>
            </div>
          )}
          <Button
            nativeButton={false}
            render={<Link href="/alertas/nueva">Nueva alerta</Link>}
          />
        </div>
      </div>

      {hasAlerts ? (
        <>
          <AlertGroup
            title="Otros · no vistas"
            alerts={otrosNoVistas}
            mode={mode}
            emptyText="No hay alertas de otros pendientes de ver."
          />
          <AlertGroup
            title="Otros · vistas"
            alerts={otrosVistas}
            mode={mode}
            emptyText="Todavía no has marcado ninguna alerta de otros como vista."
          />
          <AlertGroup
            title="Mías · no verificadas"
            alerts={miasNoVerificadas}
            mode={mode}
            emptyText="No tienes alertas propias pendientes de verificar."
          />
          <AlertGroup
            title="Mías · verificadas"
            alerts={miasVerificadas}
            mode={mode}
            emptyText="Todavía no has verificado ninguna alerta tuya."
          />
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nadie ha publicado ninguna alerta todavía.
        </p>
      )}
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
