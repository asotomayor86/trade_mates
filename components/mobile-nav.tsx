"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { InstallAppButton } from "@/components/install-app-button";

/**
 * Menú desplegable para móvil: sustituye los enlaces/usuario/logout de la
 * cabecera (visibles en línea a partir de `sm:`) por un botón de hamburguesa
 * arriba a la derecha que despliega un panel con los mismos elementos
 * apilados. Mismo patrón que el drawer del Nav del hub de juegos.
 */
export function MobileNav({
  items,
  displayName,
}: {
  items: { href: string; label: string }[];
  displayName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="ml-auto sm:hidden">
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex size-9 items-center justify-center rounded-md text-foreground hover:bg-[var(--superficie-2)]"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full flex flex-col gap-1 border-t border-[var(--borde)] bg-[var(--fondo)] p-3 shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-[var(--superficie-2)] hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <InstallAppButton variant="mobile" onAfterAction={() => setOpen(false)} />
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-[var(--borde)] px-3 pt-3">
            <span className="truncate text-sm text-muted-foreground">
              {displayName}
            </span>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">
                Salir
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
