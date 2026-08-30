import Link from "next/link";

import { Card } from "@/components/ui/card";
import { BacktestResultBadge } from "@/components/playbook/backtest-result-badge";
import type { BacktestResultValue } from "@/lib/strategy-options";

export type VerificationRowData = {
  id: string;
  symbol: string;
  takeProfit: string;
  stopLoss: string;
  backtestResult: BacktestResultValue;
};

/**
 * Fila de una línea para el listado dentro de la estrategia: nada de
 * imágenes ni descripción aquí a propósito, solo lo justo para escanear de
 * un vistazo — símbolo, TP/SL y si dio beneficios. El resto (gráficos,
 * comentarios, Pine Script) vive en la página propia de la verificación.
 */
export function VerificationRow({
  verification,
  strategyId,
}: {
  verification: VerificationRowData;
  strategyId: string;
}) {
  return (
    <Link href={`/playbook/${strategyId}/${verification.id}`} className="block">
      <Card className="gap-0 overflow-hidden p-0 transition-colors hover:bg-[var(--superficie-2)]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 text-sm">
          <span className="font-semibold text-foreground">{verification.symbol}</span>
          <span className="text-[var(--verde)]">TP: {verification.takeProfit}</span>
          <span className="text-[var(--rojo)]">SL: {verification.stopLoss}</span>
          <span className="ml-auto">
            <BacktestResultBadge value={verification.backtestResult} />
          </span>
        </div>
      </Card>
    </Link>
  );
}
