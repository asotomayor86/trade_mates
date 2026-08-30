"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { updateDisplayName } from "@/lib/actions/profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * Nombre del usuario en la cabecera — ahora clicable: abre un diálogo para
 * cambiarlo (ver lib/actions/profile.ts). Mismo patrón useTransition +
 * throw/catch que el resto de acciones sencillas del proyecto (p. ej.
 * StrategyVisibilityToggle), no useActionState con FormData.
 */
export function EditDisplayNameButton({
  displayName,
  className,
  onOpenChange,
}: {
  displayName: string;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(displayName);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    onOpenChange?.(next);
    if (next) {
      // Siempre arranca desde el nombre actual, no desde lo que quedara
      // escrito (sin guardar) la última vez que se abrió.
      setName(displayName);
      setError(null);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await updateDisplayName(name);
        setOpen(false);
        // La sesión es JWT: unstable_update() ya deja la cookie actualizada,
        // pero el propio render que acompaña a esta Server Action todavía
        // usa la cookie con la que empezó la petición. Sin este refresh
        // explícito (una petición nueva, ya con la cookie puesta al día),
        // la cabecera seguiría mostrando el nombre viejo hasta la próxima
        // navegación.
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo cambiar el nombre");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <button
            type="button"
            title="Cambiar nombre"
            className={cn(
              "group/name flex items-center gap-1 truncate text-sm text-muted-foreground transition-colors hover:text-foreground",
              className
            )}
          >
            <span className="truncate">{displayName}</span>
            <Pencil className="size-3 shrink-0 opacity-0 transition-opacity group-hover/name:opacity-70" />
          </button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar tu nombre</DialogTitle>
          <DialogDescription>
            Es el nombre que ve el resto del grupo en alertas y verificaciones.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-display-name">Nombre</Label>
            <Input
              id="edit-display-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              autoFocus
              required
            />
          </div>
          {error && <p className="text-xs text-[var(--rojo)]">{error}</p>}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
