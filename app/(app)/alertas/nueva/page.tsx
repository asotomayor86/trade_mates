import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertForm } from "@/components/alerts/alert-form";

export default function NuevaAlertaPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 p-4">
      <h1 className="seccion-titulo text-xl">Nueva alerta</h1>
      <Card>
        <CardHeader>
          <CardTitle>Comparte lo que estás viendo</CardTitle>
          <CardDescription>
            Sube la captura de Snapshot y avisa a los demás.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertForm />
        </CardContent>
      </Card>
    </div>
  );
}
