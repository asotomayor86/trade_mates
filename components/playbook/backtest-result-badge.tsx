import { Badge } from "@/components/ui/badge";
import { BACKTEST_RESULT_OPTIONS, type BacktestResultValue } from "@/lib/strategy-options";

const COLOR_CLASS: Record<BacktestResultValue, string> = {
  CON_BENEFICIOS: "bg-[var(--verde)]/15 text-[var(--verde)]",
  NEUTRA: "bg-[var(--oro)]/15 text-[var(--oro)]",
  SIN_BENEFICIOS: "bg-[var(--rojo)]/15 text-[var(--rojo)]",
};

export function BacktestResultBadge({ value }: { value: BacktestResultValue }) {
  const label = BACKTEST_RESULT_OPTIONS.find((o) => o.value === value)?.label ?? value;
  return <Badge className={COLOR_CLASS[value]}>{label}</Badge>;
}
