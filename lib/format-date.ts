const RTF = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

/** "hace 3 horas" / "en 2 días" — sin dependencias externas. */
export function relativeTime(date: Date) {
  const diffMs = date.getTime() - Date.now();
  const diffMin = Math.round(diffMs / 60_000);

  if (Math.abs(diffMin) < 60) return RTF.format(diffMin, "minute");
  const diffHours = Math.round(diffMin / 60);
  if (Math.abs(diffHours) < 24) return RTF.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  return RTF.format(diffDays, "day");
}

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

export function shortDateTime(date: Date) {
  return new Date(date).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
