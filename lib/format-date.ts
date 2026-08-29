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

export function shortDateTime(date: Date) {
  return new Date(date).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
