"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteStrategy } from "@/lib/actions/strategies";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/** Visible para el creador de la estrategia o un admin. Mismo patrón que
 * DeleteAlertButton: la acción no redirige (evita el redirect() de servidor
 * atrapado por nuestro propio try/catch), navegamos nosotros tras borrar. */
export function DeleteStrategyButton({ strategyId }: { strategyId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteStrategy(strategyId);
        router.push("/playbook");
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo eliminar");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button type="button" size="sm" variant="destructive" disabled={pending}>
              <Trash2 className="size-4" /> Eliminar estrategia
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta estrategia?</AlertDialogTitle>
            <AlertDialogDescription>
              Se borran también todas sus verificaciones (backtesting). No se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-[var(--rojo)]/15 text-[var(--rojo)] hover:bg-[var(--rojo)]/25"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {error && <p className="text-xs text-[var(--rojo)]">{error}</p>}
    </div>
  );
}
