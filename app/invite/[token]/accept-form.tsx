"use client";

import { useActionState } from "react";

import { acceptInvitation } from "@/lib/actions/invitations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AcceptInvitationForm({ token }: { token: string }) {
  const boundAction = acceptInvitation.bind(null, token);
  const [error, formAction, pending] = useActionState(boundAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="displayName">Tu nombre</Label>
        <Input id="displayName" name="displayName" required autoFocus />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Usuario</Label>
        <Input id="username" name="username" autoComplete="username" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm">Repite la contraseña</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      {error && (
        <p role="status" className="text-sm text-[var(--rojo)]">
          {error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creando cuenta…" : "Crear cuenta y entrar"}
      </Button>
    </form>
  );
}
