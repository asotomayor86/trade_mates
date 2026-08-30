import { TrendingUp, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Sentido } from "@/lib/alert-options";

/** Chip visual (icono + palabra) para escanear rápido si una alerta es alcista o bajista. */
export function SentidoBadge({ sentido }: { sentido: Sentido }) {
  const alcista = sentido === "ALCISTA";
  return (
    <Badge
      className={
        alcista
          ? "bg-[var(--verde)]/15 text-[var(--verde)]"
          : "bg-[var(--rojo)]/15 text-[var(--rojo)]"
      }
    >
      {alcista ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
      {alcista ? "Alcista" : "Bajista"}
    </Badge>
  );
}
