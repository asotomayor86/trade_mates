"use client";

import { useState, useTransition } from "react";
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

/** Visible para quien creó la verificación o un admin. A diferencia de
 * DeleteStrategyButton, no hace falta navegar tras borrar: se sigue en la
 * misma página de la estrategia, solo desaparece esta verificación de la
 * lista (revalidatePath ya lo refresca). */
export function DeleteVerificationButton({ verificationId }: { verificationId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteVerification(verificationId);
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
