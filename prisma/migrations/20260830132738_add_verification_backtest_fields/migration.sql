/*
  Warnings:

  - Added the required column `backtestResult` to the `StrategyVerification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BacktestResult" AS ENUM ('CON_BENEFICIOS', 'NEUTRA', 'SIN_BENEFICIOS');

-- AlterTable
ALTER TABLE "StrategyVerification" ADD COLUMN     "backtestImageUrl" TEXT,
ADD COLUMN     "backtestResult" "BacktestResult" NOT NULL;
