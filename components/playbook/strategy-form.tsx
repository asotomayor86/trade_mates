"use client";

import { useActionState } from "react";

import { createStrategy } from "@/lib/actions/strategies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function StrategyForm() {
  const [error, formAction, pending] = useActionState(createStrategy, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          required
          maxLength={120}
          placeholder="p. ej. Tendencia clásica - Largo"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="resumen">Resumen (una línea)</Label>
        <Input
          id="resumen"
          name="resumen"
          required
          maxLength={300}
          placeholder="En qué consiste, en pocas palabras"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="explicacion">Explicación completa</Label>
        <Textarea
          id="explicacion"
          name="explicacion"
          required
          rows={10}
          placeholder="Explica la entrada, la salida, el stop, y cuándo funciona mejor — recuerda que la idea es que el grupo aprenda de esto."
        />
      </div>

      {error && <p className="text-sm text-[var(--rojo)]">{error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Publicando…" : "Publicar estrategia"}
      </Button>
    </form>
  );
}
