"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// No es un evento estándar (solo Chrome/Edge/Android lo disparan) — TS no
// trae un tipo para él.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // Safari/iOS: no dispara beforeinstallprompt, pero expone este flag no
    // estándar cuando la PWA ya se abrió "Añadida a inicio".
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * "Instalar aplicación" en el menú (al final, ver app-header.tsx y
 * mobile-nav.tsx). Solo Chrome/Edge (escritorio y Android) disparan
 * `beforeinstallprompt` — lo capturamos para poder ofrecerlo como una opción
 * de menú normal en vez del mini-infobar del navegador. Si la app ya está
 * instalada (o el navegador no ofrece el evento, p. ej. Safari/Firefox), no
 * hay nada que hacer al pulsar, así que aparece en gris y deshabilitada.
 */
export function InstallAppButton({
  variant,
  onAfterAction,
}: {
  variant: "desktop" | "mobile";
  onAfterAction?: () => void;
}) {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  // Lazy initializer (no una llamada suelta en el cuerpo de un efecto): la
  // primera vez que importa este valor ya es en el propio render inicial —
  // como disabled = installed || !installEvent, y installEvent siempre
  // arranca en null, el HTML del primer render es idéntico (deshabilitado)
  // tanto si isStandalone() da true como false, así que no hay riesgo de
  // desajuste de hidratación aunque el server siempre vea `window` como
  // indefinido.
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    }
    function onAppInstalled() {
      setInstalled(true);
      setInstallEvent(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  async function onClick() {
    if (!installEvent) return;
    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
    } catch {
      // El evento solo se puede usar una vez; si algo falla, simplemente no
      // queda un prompt disponible hasta que el navegador ofrezca otro.
    }
    setInstallEvent(null);
    onAfterAction?.();
  }

  const disabled = installed || !installEvent;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-disabled={disabled}
      className={cn(
        "rounded-md text-left text-sm transition-colors",
        variant === "desktop" ? "px-2.5 py-1.5" : "px-3 py-2",
        disabled
          ? "cursor-not-allowed text-muted-foreground/50"
          : "text-muted-foreground hover:bg-[var(--superficie-2)] hover:text-foreground"
      )}
    >
      Instalar aplicación
    </button>
  );
}
