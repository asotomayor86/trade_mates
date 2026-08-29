import { requireAdmin } from "@/lib/auth-helpers";

// Marcador mínimo: el panel de admin completo (invitaciones, gestión de
// usuarios) es la Fase 3. Existe ya para que el enlace de navegación no
// dé 404 mientras tanto.
export default async function AdminPage() {
  await requireAdmin();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-2 p-4">
      <h1 className="seccion-titulo text-xl">Administración</h1>
      <p className="text-sm text-muted-foreground">
        Próximamente: invitaciones de un solo uso y gestión de usuarios.
      </p>
    </div>
  );
}
