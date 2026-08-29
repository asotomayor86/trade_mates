import { LineChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-6 p-6">
      <div className="flex items-center gap-2 text-lg font-bold">
        <LineChart className="size-7 text-[var(--acento)]" />
        Trade Mates
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Accede con tu usuario y contraseña.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>

      <p className="max-w-sm text-center text-sm text-muted-foreground">
        No hay registro abierto. Pide a un administrador que te invite.
      </p>
    </main>
  );
}
