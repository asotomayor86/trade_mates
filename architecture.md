# Arquitectura — trademates

Documento de contexto para sesiones futuras. Mantener actualizado cuando
cambie la estructura, el modelo de datos o las decisiones de diseño.

## Visión general

App de trading en equipo para un grupo cerrado de amigos: gráficos de
mercado (TradingView) y un tablón de "Alertas" donde cualquiera avisa a los
demás de lo que está viendo, con capturas y autorrevisión pasado un tiempo.

- **Snapshot** (`/dashboard`) — gráfico de TradingView (velas + indicadores).
- **Alertas** (`/alertas`) — subir una captura + comentario, marcarla como
  vista, y que quien la creó valore después si acertó.
- **Administración** (`/admin`, solo ADMIN) — invitaciones de un solo uso y
  gestión de usuarios.

Sin registro abierto: entras por invitación de un admin.

## Stack

| Capa             | Tecnología                                              |
| ---------------- | -------------------------------------------------------- |
| Framework        | Next.js 16 (App Router) + TypeScript                     |
| UI               | Tailwind CSS v4 + shadcn/ui (base Base UI), Barlow Semi Condensed |
| Autenticación    | Auth.js / NextAuth v5 (credentials, sesión JWT)           |
| ORM / BD         | Prisma 6 + PostgreSQL (Neon, vía integración nativa de Vercel) |
| Almacenamiento   | Vercel Blob (imágenes de las Alertas)                     |
| Hash contraseñas | bcryptjs                                                  |
| Validación       | zod                                                       |
| Despliegue       | Vercel — https://trade-mates.vercel.app                   |

## Estilo visual

Inspirado en el hub de juegos familiar del usuario ("Assemble"): fondo
violeta oscuro con degradados fijos, paneles "glass" (translúcidos +
`backdrop-filter: blur`), tipografía condensada. Ver `app/globals.css`
(variables `--fondo`, `--superficie`, `--acento`, `--oro`, `--verde`,
`--rojo`) y la clase `.glass` / `.seccion-titulo`.

Logo de marca (`components/logo.tsx`): SVG incrustado en línea (no
`<img src>`) para heredar la fuente Barlow ya cargada por la app — como
imagen externa, el navegador no puede aplicarle esa fuente y cae a una
serif genérica.

## Estructura de carpetas

```
trade_mates/
├── prisma/
│   ├── schema.prisma          # User, Invitation, Alert, AlertSeen
│   ├── seed.ts                # admin inicial (idempotente, envs saneadas)
│   └── migrations/
├── app/
│   ├── layout.tsx             # fuente Barlow, sin cabecera (la pone (app))
│   ├── page.tsx                → redirige a /dashboard
│   ├── login/
│   ├── invite/[token]/        # activar cuenta desde una invitación
│   ├── icon.svg                # favicon (icono circular de marca)
│   ├── api/auth/[...nextauth]/route.ts
│   └── (app)/                  # grupo protegido (requiere sesión)
│       ├── layout.tsx          # guard de sesión + AppHeader
│       ├── dashboard/          # Snapshot (gráfico TradingView)
│       ├── alertas/
│       │   ├── page.tsx        # listado
│       │   ├── nueva/          # crear alerta
│       │   └── [id]/           # detalle (visto, veredicto)
│       └── admin/              # solo ADMIN: invitaciones + usuarios
├── components/
│   ├── app-header.tsx          # cabecera + MobileNav (drawer <640px)
│   ├── logo.tsx
│   ├── mobile-nav.tsx
│   ├── charts/tradingview-widget.tsx
│   ├── dashboard/snapshot-view.tsx
│   ├── alerts/                 # alert-form, alert-card, seen-toggle, ...
│   ├── admin/                  # invitations-manager, users-manager
│   └── ui/                     # shadcn/ui
├── lib/
│   ├── prisma.ts               # singleton de PrismaClient
│   ├── password.ts             # hash/verify, generateInvitationToken
│   ├── auth-helpers.ts         # requireSession / requireAdmin
│   ├── alert-options.ts        # REVIEW_OPTIONS (fuera de actions/, ver nota)
│   ├── format-date.ts          # relativeTime, isPast, shortDateTime
│   └── actions/                # server actions: auth, invitations, users, alerts
├── types/next-auth.d.ts        # augmentación de sesión/JWT
├── auth.config.ts              # edge-safe (sin Prisma/bcrypt), para proxy.ts
├── auth.ts                     # proveedor credentials (Prisma/bcrypt)
├── proxy.ts                    # guard de rutas (antes "middleware")
├── next.config.ts              # bodySizeLimit 8mb (subida de imágenes)
├── .env.example
├── architecture.md              # (este documento)
└── backlog.md
```

## Modelo de datos

```
User                                   Invitation
────────────────────────────           ────────────────────────────
id            String (cuid, PK)        id          String (cuid, PK)
username      String (único)           token       String (único)
passwordHash  String? (null hasta      role        Role (con el que nace el user)
              aceptar invitación)      expiresAt   DateTime? (sin usar por ahora)
displayName   String                   usedAt      DateTime?
role          Role (ADMIN|USER)        createdById String? (FK→User, SetNull)
createdAt     DateTime                 userId      String? (FK→User, único, SetNull)
                                        createdAt   DateTime

Alert                                   AlertSeen
────────────────────────────           ────────────────────────────
id          String (cuid, PK)          id       String (cuid, PK)
imageUrl    String (Vercel Blob)       alertId  FK→Alert (cascade)
comment     String (@db.Text)          userId   FK→User (cascade)
symbol      String                     seenAt   DateTime
sentido     AlertSentido (ALCISTA|BAJISTA)       @@unique([alertId, userId])
basadoEn    AlertBasadoEn (SOPORTES_RESISTENCIAS|ONDAS|INDICADORES)
reviewAt    DateTime (creador la fija)
verdict     AlertVerdict? (CIERTA|INCIERTA)
verdictAt   DateTime?
createdById String? (FK→User, SetNull)
createdAt   DateTime
```

- **symbol/sentido/basadoEn** componen el título de la alerta (p. ej.
  "Bitcoin alcista basado en soportes y resistencias") vía
  `composeAlertTitle()` en `lib/alert-options.ts` — no se guarda un campo
  `title` aparte, se recalcula siempre a partir de los tres, igual que
  `REVIEW_OPTIONS` viven ahí por no poder exportarse desde un archivo
  `"use server"`. Llevan `@default(...)` en el esquema porque al añadirlos
  ya existía al menos una alerta en producción sin estos datos (quedó con
  los valores por defecto: symbol "Sin especificar", ALCISTA, INDICADORES).

- **SetNull, no Cascade**, en `createdById` de `Invitation` y `Alert`: si se
  borra el admin/usuario que las creó, sobreviven como registro histórico
  (incluida una invitación aún pendiente, que seguiría siendo válida).
- **AlertSeen**: "visto" manual e independiente por usuario — no tiene
  relación con el veredicto del creador.

## Decisiones de diseño

- **Sin email, login por username** — mismo criterio que otros proyectos
  del usuario: grupo cerrado de amigos, más simple.
- **Invitaciones de un solo uso, sin caducidad por defecto** (`expiresAt`
  existe en el esquema pero no se usa todavía) — se revocan a mano si
  sobra alguna.
- **Salvaguardas de integridad**: no se puede eliminar/degradar al último
  ADMIN, ni eliminarte a ti mismo (`lib/actions/users.ts`).
- **TradingView**: el widget gratuito ("Advanced Real-Time Chart", vía
  `s3.tradingview.com/external-embedding/...`) **bloquea los índices
  puros** (`SP:SPX`, `NASDAQ:IXIC`, futuros `CME_MINI:ES1!`) para
  visitantes anónimos — verificado probando varios símbolos. Se usa en su
  lugar el CFD `FOREXCOM:SPXUSD`, que sigue al índice casi 1:1. Se evaluó
  Investing.com como alternativa para los índices bloqueados, pero su
  generador de widgets exige pasar por su propia web (no automatizable) y
  sus propios gráficos van "Powered by TradingView" — mismo motor, mismas
  dudas. Se descartó.
- **Detección de cambio de símbolo dentro del widget**: es un iframe de
  otro dominio (sin acceso a su DOM), pero emite eventos `postMessage`
  (`quoteUpdate`) con el símbolo actual en cada actualización de
  cotización — se compara contra el primero recibido para saber si el
  usuario cambió de valor, y así ocultar el aviso del CFD. Ver
  `components/charts/tradingview-widget.tsx`.
- **Vista de Alertas (`components/alerts/alerts-view.tsx`)**: selector
  Tarjetas/Lista (estado de cliente, no persistido) y separación en
  secciones "No vistas" / "Vistas" según `AlertSeen` del usuario actual —
  las no vistas van primero por ser las que requieren atención. Tarjetas
  reutiliza `AlertCard` (grid); Lista usa `AlertListItem`, una fila
  horizontal compacta con la misma información.
- **`REVIEW_OPTIONS` vive en `lib/alert-options.ts`, no en
  `lib/actions/alerts.ts`** — un archivo `"use server"` solo puede
  exportar funciones async; cualquier otro export (como esta constante) se
  rompe en tiempo de ejecución al importarlo desde un Client Component,
  porque Next.js convierte todos sus exports en referencias de server
  action.
- **`SelectValue` de Base UI con `children` función** (no automático): por
  defecto resuelve la etiqueta buscando el `SelectItem` ya montado, y como
  `SelectContent` vive en un portal que no está montado hasta abrirlo, caía
  al valor crudo (p. ej. minutos en vez de "3 días"). Se le pasa la
  etiqueta explícitamente.
- **Prisma 6, no 7** (evita *driver adapters* y `prisma.config.ts`).
- **Mutaciones vía Server Actions**, validadas con zod, con
  `revalidatePath` tras escribir.

## Variables de entorno

| Variable                  | Uso                                                      |
| -------------------------- | --------------------------------------------------------- |
| `DATABASE_URL`              | Postgres con pooling (la inyecta Neon en Vercel)          |
| `DATABASE_URL_UNPOOLED`     | Conexión directa, la usa Prisma Migrate (no "DIRECT_URL") |
| `AUTH_SECRET`               | Secreto de Auth.js para firmar el JWT                     |
| `BLOB_READ_WRITE_TOKEN`     | Subida de imágenes de Alertas (Vercel Blob)               |
| `SEED_ADMIN_USERNAME/PASSWORD/DISPLAYNAME` | Admin inicial (opcional; ver `prisma/seed.ts`) |

**Nota de seguridad real ya corregida**: el seed usaba `??` para los
valores por defecto, que no trata `""` (variable presente pero vacía,
como las deja a veces el asistente de importación de Vercel) como "sin
definir" — esto creó un admin fantasma con usuario y contraseña vacíos en
producción. Corregido (`envOrDefault` en `seed.ts` trata cadenas vacías
como no puestas) y la cuenta ya se eliminó de la base de datos.

**`BLOB_READ_WRITE_TOKEN` no se puede descargar con `vercel env pull`**
(sale vacío) aunque esté bien conectado al proyecto — Vercel lo trata como
variable sensible/encriptada, igual que pasó al principio con las
variables de la base de datos. Está disponible igualmente dentro del
propio entorno de ejecución de Vercel (verificado subiendo una imagen real
contra producción). Para probarlo en local, copiar el valor a mano desde
el panel de Vercel a `.env`.

## Despliegue

Cada push a `main` dispara un deploy en Vercel. El `build` ejecuta
`prisma generate && prisma migrate deploy && prisma db seed && next build`
— aplica migraciones pendientes y asegura el admin (seed es create-only,
idempotente) en cada despliegue.

Repo: https://github.com/asotomayor86/trade_mates
Producción: https://trade-mates.vercel.app
