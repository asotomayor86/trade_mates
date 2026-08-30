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
- **Alertas — cuatro grupos (de otros / mías)** — el listado separa las
  alertas de otros (no vistas / vistas, que es lo que le importa a quien
  las lee) de las propias (no verificadas / verificadas, que es lo que le
  importa a quien las creó). El botón de marcar visto desaparece en las
  alertas propias (para su creador; el resto de usuarios lo siguen viendo
  con normalidad en sus propias alertas ajenas).
- **Alertas — vista móvil y cuenta atrás precisa** — en pantallas <640px
  el listado arranca en Lista en vez de Tarjetas (se puede cambiar a
  mano). El badge "Revisar en…" ya no redondea a una sola unidad (antes
  "Revisar dentro de 7 días" aunque solo quedasen 6 días y pico); ahora
  muestra el tiempo real con dos unidades de precisión, p. ej. "Revisar
  en 6 días y 15 horas".
- **Playbook de estrategias** (`/playbook`) — nueva sección: estrategias
  explicadas en detalle para que el grupo aprenda (sembradas con las 7 de
  referencia: Tendencia clásica largo/corto, Rebote sobreventa, Breakout
  alcista/bajista, Scalping rápido, Reversión a VWAP); crear una estrategia
  nueva es solo de admin, para mantener el contenido base curado. Cada
  estrategia admite N "verificaciones", que sí puede añadir cualquier
  usuario: backtesting manual sobre un valor concreto con captura de
  TradingView, niveles de take profit/stop loss, descripción de cómo fue,
  y código Pine Script opcional — mismas mecánicas ya probadas en Alertas
  (Blob, permisos creador-o-admin para borrar).
- **Playbook — revisión antes de publicar** — una estrategia nueva nace
  oculta; el admin la revisa en su página de detalle y decide cuándo
  publicarla. Mientras está oculta, el resto de usuarios no la ve en
  ningún sitio (ni en el listado, ni por enlace directo, ni pueden
  añadirle verificaciones) — solo el admin la ve, marcada con una
  insignia "Oculta" y por delante de las ya publicadas.
- **Playbook — segunda imagen y resultado del backtesting** — una
  verificación admite ahora una segunda captura opcional (los resultados
  del backtesting, además del gráfico) y un campo obligatorio "Beneficios
  backtesting" (Con beneficios / Neutra / Sin beneficios), con badge de
  color a juego.
- **Playbook — verificación en fila compacta + página propia** — dentro de
  una estrategia, cada verificación es ahora una línea (símbolo, TP, SL,
  resultado, sin imágenes) para poder escanear muchas de un vistazo; al
  pinchar se abre su propia página, más ancha que el resto del Playbook,
  con las imágenes a buen tamaño, la descripción completa y el Pine
  Script.
- **"Instalar aplicación"** al final del menú (escritorio y móvil):
  manifest + iconos reales, se deshabilita solo si el navegador ya la
  tiene instalada (o no ofrece la opción).
- **Cambiar el nombre propio desde la cabecera** — el nombre en la cabecera
  (escritorio y móvil) es ahora clicable: abre un diálogo para cambiarlo.
  La sesión es JWT, así que además de guardar en base de datos se refresca
  el token (`unstable_update` de Auth.js) y se fuerza un `router.refresh()`
  para que la cabecera lo recoja al momento, sin re-login.
- **Cabecera menos transparente al hacer scroll** — usaba el mismo `.glass`
  (55% opacidad) que las cards, pensado para verse contra el fondo con
  degradado; al ser fija arriba, el contenido real deslizándose debajo la
  hacía difícil de leer. Clase propia `.glass-header`, más opaca (92%),
  sin tocar `.glass` (las cards se quedan igual).
- **Página de bienvenida** (`/`) — sustituye al redirect directo a
  `/dashboard`: ahora es lo primero que se ve al entrar, con una tarjeta
  por sección (Snapshot, Alertas, Playbook) explicando qué hace cada una y
  un enlace directo. La tarjeta de Alertas incluye un vídeo real (grabado
  contra la propia app en producción, no una maqueta) del recorrido
  completo Snapshot → captura → Nueva alerta → publicar. "Inicio" al
  principio del menú (antes de Snapshot) para poder volver a verla cuando
  se quiera, no solo la primera vez que se entra.
- Logo e identidad de marca (trademates) en cabecera, login y favicon.
- Desplegado en producción: https://trade-mates.vercel.app

## Pendiente

- Cambiar la contraseña por defecto del admin en producción
  (`admin`/`changeme123`) — sigue siendo la de la siembra inicial.
- Sin pantalla de "cambiar mi contraseña" ni de "resetear la contraseña de
  otro usuario" — si alguien la olvida, hoy no hay forma de recuperarla
  salvo tocar la base de datos a mano.
- Watchlist / selector de varios símbolos en Snapshot (hoy solo S&P 500).
- Sin paginación en las tablas de usuarios/invitaciones del panel admin
  (irrelevante mientras el grupo sea pequeño).
- Playbook: sin edición de una estrategia o verificación ya creada (solo
  crear/borrar, igual que Alertas) — si hace falta corregir algo hoy toca
  borrar y volver a crearlo.
