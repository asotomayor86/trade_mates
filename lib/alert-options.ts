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

// Mismos valores que los enums AlertSentido / AlertBasadoEn de prisma/schema.prisma
// (no se importa el tipo generado por Prisma aquí para no arrastrar
// @prisma/client a componentes de cliente; son cadenas literales idénticas).
export const SENTIDO_OPTIONS = [
  { value: "ALCISTA", label: "Alcista" },
  { value: "BAJISTA", label: "Bajista" },
] as const;

export const BASADO_EN_OPTIONS = [
  { value: "SOPORTES_RESISTENCIAS", label: "Soportes y resistencias" },
  { value: "ONDAS", label: "Ondas" },
  { value: "INDICADORES", label: "Indicadores" },
] as const;

export type Sentido = (typeof SENTIDO_OPTIONS)[number]["value"];
export type BasadoEn = (typeof BASADO_EN_OPTIONS)[number]["value"];

/**
 * Compone el título de una alerta a partir de sus tres campos, p. ej.
 * symbol="Bitcoin", sentido="ALCISTA", basadoEn="SOPORTES_RESISTENCIAS" →
 * "Bitcoin alcista basado en soportes y resistencias".
 */
export function composeAlertTitle(symbol: string, sentido: Sentido, basadoEn: BasadoEn) {
  const sentidoLabel = SENTIDO_OPTIONS.find((o) => o.value === sentido)?.label ?? sentido;
  const basadoEnLabel = BASADO_EN_OPTIONS.find((o) => o.value === basadoEn)?.label ?? basadoEn;
  return `${symbol} ${sentidoLabel.toLowerCase()} basado en ${basadoEnLabel.toLowerCase()}`;
}
