import { Card } from "@/components/ui/card";
import { DeleteVerificationButton } from "@/components/playbook/delete-verification-button";
import { BacktestResultBadge } from "@/components/playbook/backtest-result-badge";
import { shortDateTime } from "@/lib/format-date";
import type { BacktestResultValue } from "@/lib/strategy-options";

export type VerificationCardData = {
  id: string;
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

export function VerificationCard({ verification }: { verification: VerificationCardData }) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      {verification.backtestImageUrl ? (
        <div className="grid grid-cols-1 border-b border-[var(--borde)] sm:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={verification.imageUrl}
            alt="Captura del gráfico"
            className="h-56 w-full border-b border-[var(--borde)] object-contain sm:border-r sm:border-b-0"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={verification.backtestImageUrl}
            alt="Captura de resultados del backtesting"
            className="h-56 w-full object-contain"
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
            <DeleteVerificationButton verificationId={verification.id} />
          </div>
        )}
      </div>
    </Card>
  );
}
