import Link from "next/link";

import { requireSession } from "@/lib/auth-helpers";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "trademates",
};

/**
 * Página de bienvenida — sustituye al antiguo redirect directo a /dashboard
 * (ver git history de app/page.tsx). Es lo primero que ve cualquiera al
 * abrir la app: qué es cada sección y cómo encajan entre sí, con un vídeo
 * de ejemplo del recorrido completo Snapshot → Alertas (grabado de verdad
 * contra la propia app, no una maqueta).
 */
export default async function HomePage() {
  const session = await requireSession();
  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 p-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="seccion-titulo text-2xl">
          Bienvenido, {session.user.displayName}
        </h1>
        <p className="text-muted-foreground">
          trademates es el panel de trading del grupo: mira el mercado,
          comparte lo que ves con una alerta, y aprende con estrategias
          explicadas y su backtesting real. Así encajan las tres secciones.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Snapshot — mira el mercado</CardTitle>
          <CardDescription>
            Elige un valor o índice, aplica tu marco temporal y añade tus
            indicadores, canales o líneas de soporte/resistencia con las
            herramientas de TradingView. Cuando veas algo que merezca la
            pena, haz una captura de esa vista para tu próxima alerta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            nativeButton={false}
            variant="outline"
            size="sm"
            render={<Link href="/dashboard">Ir al Snapshot →</Link>}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alertas — avisa al grupo</CardTitle>
          <CardDescription>
            Sube esa captura con un comentario, el símbolo, el sentido
            (alcista o bajista) y en qué te basas. Elige un plazo de
            revisión: pasado ese tiempo, tú mismo vuelves a marcar si se
            cumplió o no. Mientras tanto, el resto del grupo la ve y puede
            marcarla como vista.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <figure className="flex flex-col gap-2">
            <video
              src="/docs/snapshot-a-alerta.webm"
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full rounded-lg border border-[var(--borde)]"
            />
            <figcaption className="text-xs text-muted-foreground">
              De un Snapshot a una alerta publicada, de principio a fin.
            </figcaption>
          </figure>
          <Button
            nativeButton={false}
            variant="outline"
            size="sm"
            className="self-start"
            render={<Link href="/alertas">Ir a Alertas →</Link>}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Playbook — aprende estrategias</CardTitle>
          <CardDescription>
            Una biblioteca compartida de estrategias de trading explicadas en
            detalle. Cualquiera puede añadir verificaciones — backtesting
            manual sobre un valor, con capturas, take profit/stop loss y una
            descripción de cómo fue — para ver qué funciona de verdad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            nativeButton={false}
            variant="outline"
            size="sm"
            render={<Link href="/playbook">Ir al Playbook →</Link>}
          />
        </CardContent>
      </Card>

      {isAdmin && (
        <p className="text-sm text-muted-foreground">
          Como administrador, también gestionas invitaciones y usuarios desde{" "}
          <Link href="/admin" className="underline underline-offset-2 hover:text-foreground">
            Administración
          </Link>
          .
        </p>
      )}
    </div>
  );
}
