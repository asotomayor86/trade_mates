# Backlog — trademates

Estado de tareas. Ver también [architecture.md](architecture.md) si existe, o
el propio código para el detalle de cada fase ya construida.

## Hecho

- **Fase 0** — Dashboard "Snapshot" con gráfico de TradingView (S&P 500 vía
  CFD `FOREXCOM:SPXUSD`; el índice puro está bloqueado para visitantes
  anónimos). Aviso de que no es el índice oficial, dinámico: desaparece si
  el usuario cambia de símbolo dentro del propio gráfico.
- **Fase 1** — Prisma 6 + Neon (Vercel) + Auth.js v5 (credentials, JWT).
  Roles `ADMIN`/`USER`. `proxy.ts` protege todas las rutas salvo
  `/login` e `/invite/*`.
- **Fase 3** — Invitaciones de un solo uso (generar, copiar enlace,
  revocar) y panel de administración (usuarios: cambiar rol, eliminar,
  con salvaguardas de no quedarte sin admins).
- **Alertas** — Subir captura de Snapshot (Vercel Blob) + comentario +
  plazo de autorrevisión (3/5/7/14/30 días). Marca de "visto" manual por
  usuario. El creador valora después si fue cierta o incierta.
- **Alertas — título estructurado y vistas** — 3 campos nuevos (símbolo,
  sentido alcista/bajista, basado en soportes-resistencias/ondas/
  indicadores) que componen el título de la alerta (p. ej. "Bitcoin
  alcista basado en soportes y resistencias"), con previsualización en
  vivo en el formulario. Listado con selector Tarjetas/Lista y separación
  en secciones "No vistas" / "Vistas".
- **Alertas — veredicto solo del creador y bloqueado hasta el plazo** —
  corregido: un admin que no creó la alerta ya no puede valorarla (antes
  sí, por error); y ni siquiera el propio creador puede hacerlo antes de
  que pase `reviewAt` — mientras tanto ve los botones en gris y una
  cuenta atrás en vivo ("Podrás valorarla dentro de 2d 23h 57m"). También
  reforzado en el servidor (`setVerdict`), no solo ocultando el botón.
- **Alertas — eliminar y cabecera** — el creador de una alerta, o
  cualquier admin, puede eliminarla (con confirmación; borra también la
  imagen en Blob, best-effort). Selector Tarjetas/Lista movido a la misma
  fila que "Nueva alerta" (antes iba en una fila aparte).
- Logo e identidad de marca (trademates) en cabecera, login y favicon.
- Desplegado en producción: https://trade-mates.vercel.app

## Pendiente

- Cambiar la contraseña por defecto del admin en producción
  (`admin`/`changeme123`) — sigue siendo la de la siembra inicial.
- Sin pantalla de "cambiar mi contraseña" ni de "resetear la contraseña de
  otro usuario" — si alguien la olvida, hoy no hay forma de recuperarla
  salvo tocar la base de datos a mano.
- Watchlist / selector de varios símbolos en Snapshot (hoy solo S&P 500).
- Sin manifest/PWA (instalar como app en el móvil).
- Sin paginación en las tablas de usuarios/invitaciones del panel admin
  (irrelevante mientras el grupo sea pequeño).
