import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

// Vercel puede dejar estas variables declaradas pero VACÍAS (p. ej. si se
// crearon como plantilla al importar el proyecto sin rellenarlas) — "??"
// no las trata como "sin definir" porque "" no es null/undefined. Un
// admin con usuario o contraseña vacíos es un fallo de seguridad real, así
// que aquí una cadena vacía cuenta como "no puesta".
function envOrDefault(value: string | undefined, fallback: string) {
  return value && value.trim() !== "" ? value : fallback;
}

// create-only: si el admin ya existe, no lo toca (idempotente entre
// despliegues) — mismo criterio que el resto del stack de referencia.
async function seedAdmin() {
  const username = envOrDefault(process.env.SEED_ADMIN_USERNAME, "admin");
  const password = envOrDefault(process.env.SEED_ADMIN_PASSWORD, "changeme123");
  const displayName = envOrDefault(process.env.SEED_ADMIN_DISPLAYNAME, "Admin");

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log(`El usuario "${username}" ya existe — nada que hacer.`);
    return;
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({
    data: { username, passwordHash, displayName, role: "ADMIN" },
  });

  console.log(`Admin inicial creado: usuario="${username}"`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`Contraseña por defecto: "${password}" — cámbiala.`);
  }
}

// Conjunto inicial de estrategias del Playbook — mismas 7 de referencia que
// ya se usaban en trade_sim, pero aquí con una explicación completa pensada
// para enseñar (trade_sim las ejecuta programáticamente; aquí son solo
// contenido de referencia + backtesting manual, así que no se copian los
// campos estructurados de entrada/salida, se explican en prosa).
const PLAYBOOK_STRATEGIES = [
  {
    code: "TND-LONG",
    name: "Tendencia clásica - Largo",
    resumen: "Compra cuando EMA20 cruza al alza EMA50 con MACD positivo.",
    explicacion: `Estrategia de seguimiento de tendencia para entrar en un movimiento alcista ya confirmado, no en el arranque.

Entrada: se opera cuando la media móvil exponencial de 20 periodos (EMA20) cruza al alza a la de 50 periodos (EMA50) — el cruce dorado clásico — y además el MACD está en territorio positivo, confirmando que el impulso alcista es real y no solo un cruce de medias sin fuerza detrás. Esto filtra bastantes falsas señales que aparecen en mercados laterales, donde las medias se cruzan varias veces sin que haya una tendencia real.

Gestión: objetivo de +3% y stop de -1.5% — un ratio riesgo/beneficio de 2:1, así que hace falta acertar algo más de 1 de cada 3 veces para ser rentable a largo plazo.

Cuándo usarla: mejor en marcos temporales de horas o días, en valores con tendencia clara y volumen sostenido. En rangos laterales o baja volatilidad da muchas señales falsas — antes de entrar, comprueba que el precio no lleva mucho tiempo lateral justo antes del cruce.`,
  },
  {
    code: "TND-SHORT",
    name: "Tendencia clásica - Corto",
    resumen: "Vende cuando EMA20 cruza a la baja EMA50 con MACD negativo.",
    explicacion: `La versión bajista de la Tendencia clásica: buscar entradas en un movimiento a la baja ya confirmado.

Entrada: la EMA20 cruza a la baja la EMA50 (el cruce de la muerte) con el MACD en territorio negativo, confirmando que hay presión vendedora real detrás del cruce y no un simple ruido de corto plazo.

Gestión: mismo ratio 2:1 que su versión larga — objetivo de +3% a favor de la caída y stop de -1.5%.

Cuándo usarla: igual que en largo, funciona mejor en tendencias bajistas claras con volumen. Cuidado con aplicarla justo después de una subida larga: el primer cruce bajista real suele generar bastante ruido y falsas señales antes de confirmarse de verdad.`,
  },
  {
    code: "RSB-BNC",
    name: "Rebote sobreventa - Bounce",
    resumen:
      "Compra en zona de sobreventa extrema cuando RSI < 30 y precio toca banda inferior de Bollinger.",
    explicacion: `Estrategia de reversión a la media: busca el rebote técnico después de una caída que ha dejado el valor sobrevendido.

Entrada: se activa cuando el RSI cae por debajo de 30 (zona de sobreventa) Y, a la vez, el precio toca la banda inferior de Bollinger (20 periodos) — exigir las dos condiciones a la vez evita entrar solo porque el RSI esté bajo en una tendencia bajista fuerte que puede seguir cayendo bastante más.

Gestión: el objetivo no es un porcentaje fijo, sino la banda media de Bollinger (la media móvil de 20 periodos) — se apunta a que el precio vuelva a su "zona normal", no a un rebote enorme. El stop es un -2% por si la caída continúa y el rebote no llega.

Cuándo usarla: es una estrategia de contra-tendencia, así que funciona mejor en valores que oscilan dentro de un rango, no en tendencias bajistas muy fuertes (ahí la sobreventa puede durar mucho sin que llegue el rebote). Vigila el volumen: una sobreventa con volumen de pánico suele rebotar peor que una caída tranquila.`,
  },
  {
    code: "BRK-UP",
    name: "Breakout alcista",
    resumen:
      "Compra en ruptura de banda superior de Bollinger con volumen mayor a 1.5× la media.",
    explicacion: `Estrategia de ruptura: busca capturar el arranque de un movimiento fuerte cuando el precio rompe su rango de volatilidad reciente.

Entrada: el precio rompe al alza la banda superior de Bollinger (20 periodos) con un volumen superior a 1.5 veces la media — el volumen es la parte clave: una ruptura sin volumen suele ser una falsa ruptura que vuelve rápido dentro del rango.

Gestión: objetivo de +4% y stop en la banda media de Bollinger — si el precio vuelve a caer hasta la media después de romper al alza, la ruptura probablemente ha fallado y toca salir.

Cuándo usarla: mejor tras periodos de baja volatilidad (bandas de Bollinger estrechas) — un breakout después de una compresión suele ser más fiable que uno en mitad de un rango amplio. Cuidado con las rupturas en horarios de baja liquidez, donde el volumen puede parecer alto sin serlo realmente.`,
  },
  {
    code: "BRK-DN",
    name: "Breakout bajista",
    resumen:
      "Vende en ruptura de banda inferior de Bollinger con volumen mayor a 1.5× la media.",
    explicacion: `La versión bajista del Breakout: capturar el arranque de una caída fuerte cuando el precio rompe su rango hacia abajo.

Entrada: el precio rompe a la baja la banda inferior de Bollinger (20 periodos) con volumen superior a 1.5 veces la media, confirmando que hay presión vendedora real detrás de la ruptura y no es ruido.

Gestión: objetivo de +4% a favor de la caída y stop en la banda media de Bollinger, igual que en la versión alcista.

Cuándo usarla: igual que en la ruptura alcista, funciona mejor tras compresiones de volatilidad. Es fácil confundir una ruptura bajista real con un simple barrido de stops antes de un rebote — el volumen sostenido en las velas siguientes ayuda a distinguirlas.`,
  },
  {
    code: "SCP-LONG",
    name: "Scalping rápido - Largo",
    resumen:
      "Compra cuando precio está sobre EMA9 y Estocástico cruza al alza desde zona de sobreventa.",
    explicacion: `Estrategia de scalping: operativa rápida en marcos temporales muy cortos, pensada para pequeños movimientos, no para capturar una tendencia larga.

Entrada: el precio está por encima de la EMA9 (contexto de corto plazo alcista) y el oscilador Estocástico cruza al alza desde su zona de sobreventa (por debajo de 20) — busca el momento exacto en que un pequeño retroceso dentro de una subida de corto plazo empieza a girar de nuevo al alza.

Gestión: objetivo pequeño de +1% y stop ajustado de -0.5% — ratio 2:1 igual que la Tendencia clásica, pero a una escala mucho menor porque se opera en marcos de minutos.

Cuándo usarla: exige atención constante y buena liquidez (spreads ajustados), porque el margen de error es pequeño. No es una estrategia para dejar corriendo sin vigilancia — los movimientos que busca duran poco y el stop es estrecho, así que las comisiones y el spread pueden comerse buena parte del beneficio si el valor no es muy líquido.`,
  },
  {
    code: "VWP-BNC",
    name: "Reversión a VWAP - Bounce",
    resumen: "Compra cuando precio está > 1% por debajo del VWAP con RSI < 40.",
    explicacion: `Estrategia de reversión a la media, pero usando el VWAP (precio medio ponderado por volumen) como referencia de "precio justo" del día en vez de una media móvil clásica.

Entrada: el precio se desvía más de un 1% por debajo del VWAP y el RSI cae por debajo de 40 — la idea es entrar cuando el precio se ha alejado más de la cuenta del nivel donde se ha concentrado el volumen del día, algo que institucionalmente tiende a corregirse.

Gestión: el objetivo es el propio VWAP (no un porcentaje fijo, varía según cuánto se haya desviado el precio) y el stop es un -1.5% por si la desviación no se corrige y el precio sigue cayendo.

Cuándo usarla: es una estrategia intradía por naturaleza — el VWAP se reinicia cada sesión, así que solo tiene sentido dentro del mismo día de negociación. Funciona mejor en valores con volumen alto y repartido a lo largo de la sesión; en valores con poco volumen el VWAP se vuelve poco fiable como referencia.`,
  },
];

// create-only por code, igual que el admin: si alguna ya existe no se toca,
// así una edición manual futura desde la app no se pierde en el próximo
// despliegue.
async function seedPlaybook() {
  for (const s of PLAYBOOK_STRATEGIES) {
    const existing = await prisma.strategy.findUnique({ where: { code: s.code } });
    if (existing) continue;
    await prisma.strategy.create({ data: s });
    console.log(`Estrategia del playbook creada: ${s.code} — ${s.name}`);
  }
}

async function main() {
  await seedAdmin();
  await seedPlaybook();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
