"use client";

import { useState, useTransition } from "react";

import { updateUserRole, deleteUser } from "@/lib/actions/users";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

type UserRow = {
  id: string;
  username: string;
  displayName: string;
  role: "ADMIN" | "USER";
};

export function UsersManager({
  users,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserRowItem
            key={user.id}
            user={user}
            isSelf={user.id === currentUserId}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function UserRowItem({ user, isSelf }: { user: UserRow; isSelf: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onRoleChange(role: string | null) {
    if (!role) return;
    setError(null);
    startTransition(async () => {
      try {
        await updateUserRole(user.id, role);
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo cambiar el rol");
      }
    });
  }

  function onDelete() {
    startTransition(async () => {
      try {
        await deleteUser(user.id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo eliminar");
      }
    });
  }

  return (
    <TableRow>
      <TableCell>{user.username}</TableCell>
      <TableCell>
        {user.displayName}
        {isSelf && <span className="text-muted-foreground"> (tú)</span>}
      </TableCell>
      <TableCell>
        <Select
          value={user.role}
          onValueChange={onRoleChange}
          disabled={isSelf || pending}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">Usuario</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
        {error && <p className="mt-1 text-xs text-[var(--rojo)]">{error}</p>}
      </TableCell>
      <TableCell className="text-right">
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button size="sm" variant="outline" disabled={isSelf || pending}>
                Eliminar
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar a {user.displayName}?</AlertDialogTitle>
              <AlertDialogDescription>
                Perderá el acceso inmediatamente. No se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
