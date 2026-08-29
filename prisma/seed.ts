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
async function main() {
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
