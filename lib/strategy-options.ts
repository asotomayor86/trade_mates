// Constantes compartidas entre el formulario (cliente) y la server action de
// lib/actions/strategies.ts. No pueden vivir ahí: un archivo "use server"
// solo puede exportar funciones async — cualquier otro export (como este
// array) se rompe en tiempo de ejecución al importarlo desde un Client
// Component. Mismo criterio que REVIEW_OPTIONS en lib/alert-options.ts.

export const BACKTEST_RESULT_OPTIONS = [
  { value: "CON_BENEFICIOS", label: "Con beneficios" },
  { value: "NEUTRA", label: "Neutra" },
  { value: "SIN_BENEFICIOS", label: "Sin beneficios" },
] as const;

export type BacktestResultValue = (typeof BACKTEST_RESULT_OPTIONS)[number]["value"];
