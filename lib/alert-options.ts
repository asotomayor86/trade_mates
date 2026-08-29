// Constante compartida entre el formulario (cliente) y la server action.
// No puede vivir dentro de lib/actions/alerts.ts: un archivo "use server"
// solo puede exportar funciones async — cualquier otro export (como este
// array) se rompe en tiempo de ejecución al importarlo desde un Client
// Component, porque Next.js convierte todos sus exports en referencias de
// server action.
//
// Periodos largos a propósito: la app es para ideas de swing/posición, no
// intradía — de 3 días a 1 mes.
const DIA = 24 * 60;

export const REVIEW_OPTIONS = [
  { minutes: 3 * DIA, label: "3 días" },
  { minutes: 5 * DIA, label: "5 días" },
  { minutes: 7 * DIA, label: "7 días" },
  { minutes: 14 * DIA, label: "14 días" },
  { minutes: 30 * DIA, label: "30 días" },
] as const;
