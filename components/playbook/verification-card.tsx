import { Card } from "@/components/ui/card";
import { DeleteVerificationButton } from "@/components/playbook/delete-verification-button";
import { shortDateTime } from "@/lib/format-date";

export type VerificationCardData = {
  id: string;
  imageUrl: string;
  symbol: string;
  takeProfit: string;
  stopLoss: string;
  description: string;
  pineScript: string | null;
  createdAt: Date;
  createdBy: { displayName: string } | null;
  canDelete: boolean;
};

export function VerificationCard({ verification }: { verification: VerificationCardData }) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={verification.imageUrl}
        alt="Captura del backtest"
        className="w-full border-b border-[var(--borde)] object-contain"
      />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">{verification.symbol}</span>
          <span className="text-xs text-muted-foreground">
            {verification.createdBy?.displayName ?? "usuario eliminado"} ·{" "}
            {shortDateTime(verification.createdAt)}
          </span>
        </div>

        <div className="flex gap-4 text-xs">
          <span className="text-[var(--verde)]">TP: {verification.takeProfit}</span>
          <span className="text-[var(--rojo)]">SL: {verification.stopLoss}</span>
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
