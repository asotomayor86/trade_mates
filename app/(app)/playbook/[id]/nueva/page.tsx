import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-helpers";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { VerificationForm } from "@/components/playbook/verification-form";

export default async function NuevaVerificacionPage(props: PageProps<"/playbook/[id]/nueva">) {
  const { id } = await props.params;
  const session = await requireSession();

  const strategy = await prisma.strategy.findUnique({
    where: { id },
    select: { id: true, name: true, visible: true },
  });
  if (!strategy) notFound();
  // Misma regla que en la página de detalle: oculta = no existe para quien
  // no sea admin.
  if (!strategy.visible && session.user.role !== "ADMIN") notFound();

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 p-4">
      <h1 className="seccion-titulo text-xl">Nueva verificación</h1>
      <Card>
        <CardHeader>
          <CardTitle>{strategy.name}</CardTitle>
          <CardDescription>
            Sube la captura del backtest en TradingView y cuenta cómo ha ido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerificationForm strategyId={strategy.id} />
        </CardContent>
      </Card>
    </div>
  );
}
