"use client";

import { useActionState, useState } from "react";

import { createInvitation, revokeInvitation } from "@/lib/actions/invitations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type InvitationRow = {
  id: string;
  token: string;
  role: "ADMIN" | "USER";
  createdAt: Date;
  usedAt: Date | null;
  user: { displayName: string } | null;
};

const fmt = (d: Date) =>
  new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });

export function InvitationsManager({
  invitations,
}: {
  invitations: InvitationRow[];
}) {
  const [state, formAction, pending] = useActionState(createInvitation, null);
  const pendingList = invitations.filter((i) => !i.usedAt);
  const usedList = invitations.filter((i) => i.usedAt);

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">Rol de la invitación</Label>
          <Select name="role" defaultValue="USER">
            <SelectTrigger id="role" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">Usuario</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Generando…" : "Generar invitación"}
        </Button>
      </form>
      {state && !state.ok && (
        <p className="text-sm text-[var(--rojo)]">{state.error}</p>
      )}

      {pendingList.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay invitaciones pendientes.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {pendingList.map((invitation) => (
            <InvitationItem key={invitation.id} invitation={invitation} />
          ))}
        </ul>
      )}

      {usedList.length > 0 && (
        <details className="text-sm text-muted-foreground">
          <summary className="cursor-pointer select-none">
            Historial de invitaciones usadas ({usedList.length})
          </summary>
          <ul className="mt-2 flex flex-col gap-1 pl-1">
            {usedList.map((invitation) => (
              <li key={invitation.id}>
                {invitation.user?.displayName ?? "usuario eliminado"} ·{" "}
                {invitation.role} · {invitation.usedAt && fmt(invitation.usedAt)}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function InvitationItem({ invitation }: { invitation: InvitationRow }) {
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function copyLink() {
    const url = `${window.location.origin}/invite/${invitation.token}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function revoke() {
    setRevoking(true);
    try {
      await revokeInvitation(invitation.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo revocar");
      setRevoking(false);
    }
  }

  return (
    <li className="flex items-center justify-between gap-2 rounded-md border border-[var(--borde)] px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        <Badge className="bg-[var(--superficie-2)] text-[var(--acento)]">
          {invitation.role}
        </Badge>
        <span className="text-muted-foreground">
          creada el {fmt(invitation.createdAt)}
        </span>
        {error && <span className="text-[var(--rojo)]">{error}</span>}
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={copyLink} type="button">
          {copied ? "¡Copiado!" : "Copiar enlace"}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button size="sm" variant="outline" disabled={revoking} type="button">
                Revocar
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Revocar esta invitación?</AlertDialogTitle>
              <AlertDialogDescription>
                El enlace dejará de funcionar. No se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={revoke}>Revocar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}
