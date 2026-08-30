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
  usuario. El creador (o un admin) valora después si fue cierta o
  incierta.
- **Alertas — título estructurado y vistas** — 3 campos nuevos (símbolo,
  sentido alcista/bajista, basado en soportes-resistencias/ondas/
  indicadores) que componen el título de la alerta (p. ej. "Bitcoin
  alcista basado en soportes y resistencias"), con previsualización en
  vivo en el formulario. Listado con selector Tarjetas/Lista y separación
  en secciones "No vistas" / "Vistas".
- Logo e identidad de marca (trademates) en cabecera, login y favicon.
- Desplegado en producción: https://trade-mates.vercel.app

## Pendiente

- **Bloquear el veredicto hasta que pase el plazo de revisión.** Ahora
  mismo los botones "Cierta"/"Incierta" están activos desde el momento de
  creación de la alerta. Falta: deshabilitarlos (mostrarlos en gris) hasta
  que `reviewAt` haya pasado, y mientras tanto mostrar una cuenta atrás
  ("faltan 2 días 4h") en vez del botón. Solo afecta a quien puede
  valorar (el creador, o un admin) — el resto de usuarios no ve botones de
  veredicto de todos modos.
- Cambiar la contraseña por defecto del admin en producción
  (`admin`/`changeme123`) — sigue siendo la de la siembra inicial.
- Sin pantalla de "cambiar mi contraseña" ni de "resetear la contraseña de
  otro usuario" — si alguien la olvida, hoy no hay forma de recuperarla
  salvo tocar la base de datos a mano.
- Watchlist / selector de varios símbolos en Snapshot (hoy solo S&P 500).
- Sin manifest/PWA (instalar como app en el móvil).
- Sin paginación en las tablas de usuarios/invitaciones del panel admin
  (irrelevante mientras el grupo sea pequeño).
