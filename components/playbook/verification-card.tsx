import { Card } from "@/components/ui/card";
import { DeleteVerificationButton } from "@/components/playbook/delete-verification-button";
import { BacktestResultBadge } from "@/components/playbook/backtest-result-badge";
import { shortDateTime } from "@/lib/format-date";
import type { BacktestResultValue } from "@/lib/strategy-options";

export type VerificationCardData = {
  id: string;
  strategyId: string;
  imageUrl: string;
  backtestImageUrl: string | null;
  symbol: string;
  takeProfit: string;
  stopLoss: string;
  backtestResult: BacktestResultValue;
  description: string;
  pineScript: string | null;
  createdAt: Date;
  createdBy: { displayName: string } | null;
  canDelete: boolean;
};

/** Contenido completo de una verificación — vive en su propia página
 * (app/(app)/playbook/[id]/[verificationId]/page.tsx), a todo el ancho que
 * le deje esa página. El listado de la estrategia solo enlaza aquí; ver
 * VerificationRow para la fila compacta. */
export function VerificationCard({ verification }: { verification: VerificationCardData }) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      {verification.backtestImageUrl ? (
        // Una encima de la otra, cada una a todo el ancho de la página —
        // sin grid a dos columnas ni límite de alto: cada gráfico se ve a
        // su tamaño natural, no encajado en una caja pequeña.
        <div className="flex flex-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={verification.imageUrl}
            alt="Captura del gráfico"
            className="w-full border-b border-[var(--borde)] object-contain"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={verification.backtestImageUrl}
            alt="Captura de resultados del backtesting"
            className="w-full border-b border-[var(--borde)] object-contain"
          />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={verification.imageUrl}
          alt="Captura del gráfico"
          className="w-full border-b border-[var(--borde)] object-contain"
        />
      )}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">{verification.symbol}</span>
          <span className="text-xs text-muted-foreground">
            {verification.createdBy?.displayName ?? "usuario eliminado"} ·{" "}
            {shortDateTime(verification.createdAt)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-[var(--verde)]">TP: {verification.takeProfit}</span>
          <span className="text-[var(--rojo)]">SL: {verification.stopLoss}</span>
          <BacktestResultBadge value={verification.backtestResult} />
        </div>

        <p className="whitespace-pre-wrap text-sm">{verification.description}</p>

        {verification.pineScript && (
          <details className="rounded-md border border-[var(--borde)] bg-[var(--superficie-2)] p-2">
            <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
              Código Pine Script
            </summary>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs">
              {verification.pineScript}
            </pre>
          </details>
        )}

        {verification.canDelete && (
          <div className="flex justify-end border-t border-[var(--borde)] pt-3">
            <DeleteVerificationButton
              verificationId={verification.id}
              strategyId={verification.strategyId}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
