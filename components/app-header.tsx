import Link from "next/link";

import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { InstallAppButton } from "@/components/install-app-button";
import { EditDisplayNameButton } from "@/components/edit-display-name-button";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/dashboard", label: "Snapshot" },
  { href: "/alertas", label: "Alertas" },
  { href: "/playbook", label: "Playbook" },
];

/**
 * Cabecera del área protegida — mismo lenguaje visual que el Nav del hub de
 * juegos: barra "glass" fija arriba, wordmark con icono a la izquierda.
 * A partir de `sm` (640px), enlaces/usuario/logout en línea a la derecha;
 * por debajo, se sustituyen por un menú desplegable (hamburguesa) — mismo
 * patrón que el drawer móvil de su Nav.
 */
export function AppHeader({
  displayName,
  isAdmin,
}: {
  displayName: string;
  isAdmin: boolean;
}) {
  const items = isAdmin
    ? [...enlaces, { href: "/admin", label: "Administración" }]
    : enlaces;

  return (
    <header className="glass-header sticky top-0 z-10 relative border-x-0 border-t-0">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-x-4 px-4">
        <Link href="/" aria-label="trademates" className="flex items-center">
          <Logo withTagline={false} className="h-[40px] w-auto" />
        </Link>

        <nav className="hidden translate-y-[5px] items-center gap-1 sm:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-[var(--superficie-2)] hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <InstallAppButton variant="desktop" />
        </nav>

        <div className="ml-auto hidden translate-y-[5px] items-center gap-3 sm:flex">
          <EditDisplayNameButton displayName={displayName} className="max-w-[10rem]" />
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Salir
            </Button>
          </form>
        </div>

        <MobileNav items={items} displayName={displayName} />
      </div>
    </header>
  );
}
