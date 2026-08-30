import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { StrategyForm } from "@/components/playbook/strategy-form";
import { requireAdmin } from "@/lib/auth-helpers";

// Solo admin: el playbook base debe quedar curado. Las verificaciones
// (backtesting) sí las puede añadir cualquiera, ver [id]/nueva/page.tsx.
export default async function NuevaEstrategiaPage() {
  await requireAdmin();

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 p-4">
      <h1 className="seccion-titulo text-xl">Nueva estrategia</h1>
      <Card>
        <CardHeader>
          <CardTitle>Comparte una estrategia con el grupo</CardTitle>
          <CardDescription>
            Explícala bien: entrada, salida, stop y cuándo funciona mejor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StrategyForm />
        </CardContent>
      </Card>
    </div>
  );
}
