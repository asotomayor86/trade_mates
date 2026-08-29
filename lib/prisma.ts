import { PrismaClient } from "@prisma/client";

// Singleton de PrismaClient: en dev, Next.js recarga módulos con cada
// cambio (HMR) y crearía una conexión nueva cada vez sin este patrón.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
