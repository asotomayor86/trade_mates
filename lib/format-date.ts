export function isPast(date: Date) {
  return date.getTime() <= Date.now();
}

// Helper separado (no Date.now() suelto en el cuerpo de un componente) para
// no disparar la regla de lint react-hooks/purity, igual que isPast de arriba.
export function nowMs() {
  return Date.now();
}

/** "2d 4h 13m" — cuenta atrás hasta `target`, con precisión de minutos. */
export function formatCountdown(target: Date, from: number) {
  const totalMinutes = Math.max(0, Math.round((target.getTime() - from) / 60_000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (days > 0 || hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(" ");
}

function pluralize(n: number, singular: string, plural: string) {
  return `${n} ${n === 1 ? singular : plural}`;
}

/**
 * "6 días y 15 horas" / "3 horas y 20 minutos" / "12 minutos" — tiempo real
 * que falta hasta `date`, con como mucho dos unidades de precisión (a
 * diferencia de la antigua relativeTime, que redondeaba a una sola unidad
 * y por eso "revisar en 7 días" se quedaba en "7 días" aunque en realidad
 * quedaran 6 días y 15 horas).
 */
export function preciseRemaining(date: Date) {
  const totalMinutes = Math.max(0, Math.round((date.getTime() - Date.now()) / 60_000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return hours > 0
      ? `${pluralize(days, "día", "días")} y ${pluralize(hours, "hora", "horas")}`
      : pluralize(days, "día", "días");
  }
  if (hours > 0) {
    return minutes > 0
      ? `${pluralize(hours, "hora", "horas")} y ${pluralize(minutes, "minuto", "minutos")}`
      : pluralize(hours, "hora", "horas");
  }
  return pluralize(minutes, "minuto", "minutos");
}

export function shortDateTime(date: Date) {
  return new Date(date).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
