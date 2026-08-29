"use client";

import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";

import { setVerdict } from "@/lib/actions/alerts";
import { Button } from "@/components/ui/button";

export function VerdictButtons({ alertId }: { alertId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function vote(verdict: "CIERTA" | "INCIERTA") {
    setError(null);
    startTransition(async () => {
      try {
        await setVerdict(alertId, verdict);
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo guardar");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm text-muted-foreground">
        Toca revisarla: ¿fue cierta o incierta?
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onClick={() => vote("CIERTA")}
          className="bg-[var(--verde)] text-white hover:bg-[var(--verde)]/90"
        >
          <Check className="size-4" /> Cierta
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => vote("INCIERTA")}
        >
          <X className="size-4" /> Incierta
        </Button>
      </div>
      {error && <p className="text-sm text-[var(--rojo)]">{error}</p>}
    </div>
  );
}
