import Link from "next/link";
import { LineChart } from "lucide-react";

import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

const enlaces = [{ href: "/dashboard", label: "Mercados" }];

/**
 * Cabecera del área protegida — mismo lenguaje visual que el Nav del hub de
 * juegos: barra "glass" fija arriba, wordmark con icono a la izquierda,
 * enlaces, nombre de usuario y "Salir" a la derecha. Sin drawer móvil
 * todavía: con uno o dos enlaces cabe bien envolviendo con flex-wrap: se
 * añadirá cuando la navegación crezca (Fase 3, panel admin).
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
    <header className="glass sticky top-0 z-10 border-x-0 border-t-0">
      <div className="mx-auto flex h-14 max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <LineChart className="size-6 text-[var(--acento)]" />
          Trade Mates
        </Link>

        <nav className="flex items-center gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-[var(--superficie-2)] hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="max-w-[10rem] truncate text-sm text-muted-foreground">
            {displayName}
          </span>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Salir
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
