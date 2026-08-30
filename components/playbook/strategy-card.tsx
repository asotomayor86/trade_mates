import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { shortDateTime } from "@/lib/format-date";

export type StrategyCardData = {
  id: string;
  code: string;
  name: string;
  resumen: string;
  createdBy: { displayName: string } | null;
  createdAt: Date;
  verificationCount: number;
};

export function StrategyCard({ strategy }: { strategy: StrategyCardData }) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge className="bg-[var(--superficie-2)] font-mono text-[10px] text-muted-foreground">
            {strategy.code}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {strategy.verificationCount}{" "}
            {strategy.verificationCount === 1 ? "verificación" : "verificaciones"}
          </span>
        </div>
        <Link href={`/playbook/${strategy.id}`} className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground hover:underline">
            {strategy.name}
          </p>
          <p className="line-clamp-3 text-xs text-muted-foreground">{strategy.resumen}</p>
        </Link>
        <span className="mt-1 text-xs text-muted-foreground">
          {strategy.createdBy?.displayName ?? "Estrategia base"} ·{" "}
          {shortDateTime(strategy.createdAt)}
        </span>
      </div>
    </Card>
  );
}
