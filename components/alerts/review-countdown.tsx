"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { nowMs, formatCountdown } from "@/lib/format-date";

/**
 * Se muestra en vez de VerdictButtons mientras no ha pasado reviewAt:
 * los botones aparecen en gris/deshabilitados y debajo una cuenta atrás
 * que se actualiza sola. En cuanto llega a cero, refresca la página (es un
 * Server Component) para que el padre pase a mostrar VerdictButtons de
 * verdad, sin que haga falta recargar a mano.
 */
export function ReviewCountdown({ reviewAt }: { reviewAt: Date }) {
  const router = useRouter();
  const [now, setNow] = useState(nowMs);

  useEffect(() => {
    const id = setInterval(() => setNow(nowMs()), 30_000);
    return () => clearInterval(id);
  }, []);

  const remainingMs = reviewAt.getTime() - now;

  useEffect(() => {
    if (remainingMs <= 0) router.refresh();
  }, [remainingMs, router]);

  if (remainingMs <= 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm text-muted-foreground">
        Podrás valorarla dentro de {formatCountdown(reviewAt, now)}.
      </p>
      <div className="flex gap-2">
        <Button type="button" size="sm" disabled className="bg-[var(--verde)] text-white">
          <Check className="size-4" /> Cierta
        </Button>
        <Button type="button" size="sm" variant="outline" disabled>
          <X className="size-4" /> Incierta
        </Button>
      </div>
    </div>
  );
}
