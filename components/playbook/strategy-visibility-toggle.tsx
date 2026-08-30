"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";

import { setStrategyVisible } from "@/lib/actions/strategies";
import { Button } from "@/components/ui/button";

/** Solo admin: publica u oculta la estrategia — es la revisión antes de que
 * la vea el resto del grupo. Mismo lenguaje visual (Eye/EyeOff) que el
 * SeenToggle de Alertas, aunque el significado aquí es distinto. */
export function StrategyVisibilityToggle({
  strategyId,
  visible,
}: {
  strategyId: string;
  visible: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onToggle() {
    setError(null);
    startTransition(async () => {
      try {
        await setStrategyVisible(strategyId, !visible);
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo cambiar la visibilidad");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" variant="outline" size="sm" disabled={pending} onClick={onToggle}>
        {visible ? (
          <>
            <Eye className="size-4" /> Visible — pasar a oculta
          </>
        ) : (
          <>
            <EyeOff className="size-4" /> Oculta — publicar
          </>
        )}
      </Button>
      {error && <p className="text-xs text-[var(--rojo)]">{error}</p>}
    </div>
  );
}
