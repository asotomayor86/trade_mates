import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

// create-only: si el admin ya existe, no lo toca (idempotente entre
// despliegues) — mismo criterio que el resto del stack de referencia.
async function main() {
  const username = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";
  const displayName = process.env.SEED_ADMIN_DISPLAYNAME ?? "Admin";

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
