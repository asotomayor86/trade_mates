"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TradingViewWidget from "@/components/charts/tradingview-widget";

export function SnapshotView() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4">
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <h1 className="seccion-titulo text-xl">Snapshot</h1>
        <Badge className="bg-[var(--superficie-2)] text-[var(--acento)]">
          CFD
        </Badge>
      </div>
      <p className="-mt-2 text-sm text-muted-foreground">
        Selecciona tu valor o índice, aplica tu marco temporal, añade tus
        indicadores, canales, soportes o resistencias con las herramientas de
        TradingView y guarda el snapshot para subirlo posteriormente a
        Alertas.
      </p>

      {/*
        Altura explícita (no flex-1): el script de TradingView sobreescribe
        el estilo de su contenedor a height:100%, y ese 100% solo se resuelve
        si el padre tiene una altura CSS definida — una altura derivada de
        flex-grow no cuenta como "definida" a efectos de porcentajes
        anidados. Usamos dvh en el primer tramo para que los navegadores
        móviles (barra de direcciones que aparece/desaparece) no recorten el
        gráfico, y vh a partir de sm/lg donde ese problema no existe.
      */}
      <Card className="h-[58dvh] min-h-[360px] gap-0 p-0 sm:h-[64vh] lg:h-[72vh]">
        <div className="min-h-0 flex-1">
          <TradingViewWidget symbol="FOREXCOM:SPXUSD" />
        </div>
      </Card>
    </div>
  );
}
