"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteVerification } from "@/lib/actions/strategies";
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

/** Visible para quien creó la verificación o un admin. Vive en la página
 * propia de la verificación (no ya en el listado de la estrategia), así que
 * tras borrar hay que navegar de vuelta a la estrategia — mismo patrón que
 * DeleteStrategyButton. */
export function DeleteVerificationButton({
  verificationId,
  strategyId,
}: {
  verificationId: string;
  strategyId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteVerification(verificationId);
        router.push(`/playbook/${strategyId}`);
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
              <Trash2 className="size-4" /> Eliminar
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta verificación?</AlertDialogTitle>
            <AlertDialogDescription>
              Se borra el registro de este backtesting y su imagen. No se
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
