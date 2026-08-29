import { TriangleAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TradingViewWidget from "@/components/charts/tradingview-widget";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4">
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <h1 className="seccion-titulo text-xl">S&amp;P 500</h1>
        <Badge className="bg-[var(--superficie-2)] text-[var(--acento)]">
          CFD
        </Badge>
      </div>
      <p className="-mt-2 text-sm text-muted-foreground">
        Velas e indicadores en tiempo real vía TradingView.
      </p>

      <div role="status" className="flex items-start gap-1.5 text-sm text-[var(--oro)]">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
        <details className="group">
          <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            Esto no es el índice oficial: mostramos un CFD que replica el
            S&amp;P 500.{" "}
            <span className="underline underline-offset-2 group-open:hidden">
              Más información
            </span>
          </summary>
          <p className="mt-1 text-muted-foreground">
            El widget gratuito de TradingView bloquea el símbolo del índice
            puro (<code>SP:SPX</code>) para visitantes anónimos. Este gráfico
            muestra en su lugar <strong className="text-foreground">FOREXCOM:SPXUSD</strong>,
            un CFD que replica el S&amp;P 500 casi 1:1 pero cotiza en un
            mercado distinto (24/5, sin las pausas del NYSE) y puede diferir
            ligeramente del índice oficial en precio y horario.
          </p>
        </details>
      </div>

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
        <CardHeader className="border-b border-[var(--borde)] py-3">
          <CardTitle>Índice S&amp;P 500</CardTitle>
          <CardDescription>FOREXCOM · SPXUSD · Diario</CardDescription>
        </CardHeader>
        <div className="min-h-0 flex-1">
          <TradingViewWidget symbol="FOREXCOM:SPXUSD" />
        </div>
      </Card>
    </div>
  );
}
