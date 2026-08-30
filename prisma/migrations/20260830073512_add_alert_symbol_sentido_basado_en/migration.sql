-- CreateEnum
CREATE TYPE "AlertSentido" AS ENUM ('ALCISTA', 'BAJISTA');

-- CreateEnum
CREATE TYPE "AlertBasadoEn" AS ENUM ('SOPORTES_RESISTENCIAS', 'ONDAS', 'INDICADORES');

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "basadoEn" "AlertBasadoEn" NOT NULL DEFAULT 'INDICADORES',
ADD COLUMN     "sentido" "AlertSentido" NOT NULL DEFAULT 'ALCISTA',
ADD COLUMN     "symbol" TEXT NOT NULL DEFAULT 'Sin especificar';
