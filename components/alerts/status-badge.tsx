import { Badge } from "@/components/ui/badge";
import { relativeTime, isPast } from "@/lib/format-date";

type Props = {
  verdict: "CIERTA" | "INCIERTA" | null;
  reviewAt: Date;
};

export function StatusBadge({ verdict, reviewAt }: Props) {
  if (verdict === "CIERTA") {
    return (
      <Badge className="bg-[var(--verde)]/15 text-[var(--verde)]">
        ✓ Cierta
      </Badge>
    );
  }
  if (verdict === "INCIERTA") {
    return (
      <Badge className="bg-[var(--rojo)]/15 text-[var(--rojo)]">
        ✗ Incierta
      </Badge>
    );
  }

  const due = isPast(reviewAt);
  return (
    <Badge
      className={
        due
          ? "bg-[var(--oro)]/15 text-[var(--oro)]"
          : "bg-[var(--superficie-2)] text-muted-foreground"
      }
    >
      {due ? "Lista para revisar" : `Revisar ${relativeTime(reviewAt)}`}
    </Badge>
  );
}
