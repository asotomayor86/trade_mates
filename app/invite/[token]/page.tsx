import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { prisma } from "@/lib/prisma";
import { AcceptInvitationForm } from "./accept-form";

export const dynamic = "force-dynamic";

export default async function InvitePage(props: PageProps<"/invite/[token]">) {
  const { token } = await props.params;

  const invitation = await prisma.invitation.findUnique({ where: { token } });
  const isValid =
    !!invitation &&
    !invitation.usedAt &&
    (!invitation.expiresAt || invitation.expiresAt > new Date());

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-6 p-6">
      <Logo className="h-24 w-auto" />

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>{isValid ? "Únete al equipo" : "Invitación no válida"}</CardTitle>
          <CardDescription>
            {isValid
              ? "Elige tu usuario y contraseña para activar tu cuenta."
              : "Este enlace ya se usó, caducó, o no existe. Pide uno nuevo a un administrador."}
          </CardDescription>
        </CardHeader>
        {isValid && (
          <CardContent>
            <AcceptInvitationForm token={token} />
          </CardContent>
        )}
      </Card>
    </main>
  );
}
