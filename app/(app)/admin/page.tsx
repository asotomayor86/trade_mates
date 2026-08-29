import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InvitationsManager } from "@/components/admin/invitations-manager";
import { UsersManager } from "@/components/admin/users-manager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireAdmin();

  const [users, invitations] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, username: true, displayName: true, role: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.invitation.findMany({
      select: {
        id: true,
        token: true,
        role: true,
        createdAt: true,
        usedAt: true,
        user: { select: { displayName: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4">
      <h1 className="seccion-titulo text-xl">Administración</h1>

      <Card className="gap-0 p-0">
        <CardHeader className="border-b border-[var(--borde)] py-3">
          <CardTitle>Invitaciones</CardTitle>
          <CardDescription>
            Genera un enlace de un solo uso y compártelo a mano (WhatsApp, etc.).
          </CardDescription>
        </CardHeader>
        <div className="p-4">
          <InvitationsManager invitations={invitations} />
        </div>
      </Card>

      <Card className="gap-0 p-0">
        <CardHeader className="border-b border-[var(--borde)] py-3">
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>{users.length} en total</CardDescription>
        </CardHeader>
        <div className="p-4">
          <UsersManager users={users} currentUserId={session.user.id} />
        </div>
      </Card>
    </div>
  );
}
