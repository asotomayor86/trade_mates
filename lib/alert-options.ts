// Constante compartida entre el formulario (cliente) y la server action.
// No puede vivir dentro de lib/actions/alerts.ts: un archivo "use server"
// solo puede exportar funciones async — cualquier otro export (como este
// array) se rompe en tiempo de ejecución al importarlo desde un Client
// Component, porque Next.js convierte todos sus exports en referencias de
// server action.
export const REVIEW_OPTIONS = [
  { minutes: 15, label: "15 minutos" },
  { minutes: 30, label: "30 minutos" },
  { minutes: 60, label: "1 hora" },
  { minutes: 240, label: "4 horas" },
  { minutes: 1440, label: "1 día" },
  { minutes: 4320, label: "3 días" },
] as const;
