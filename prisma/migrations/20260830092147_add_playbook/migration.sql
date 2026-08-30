-- CreateTable
CREATE TABLE "Strategy" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "resumen" TEXT NOT NULL,
    "explicacion" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyVerification" (
    "id" TEXT NOT NULL,
    "strategyId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "takeProfit" TEXT NOT NULL,
    "stopLoss" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pineScript" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrategyVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Strategy_code_key" ON "Strategy"("code");

-- CreateIndex
CREATE INDEX "Strategy_createdById_idx" ON "Strategy"("createdById");

-- CreateIndex
CREATE INDEX "StrategyVerification_strategyId_idx" ON "StrategyVerification"("strategyId");

-- CreateIndex
CREATE INDEX "StrategyVerification_createdById_idx" ON "StrategyVerification"("createdById");

-- AddForeignKey
ALTER TABLE "Strategy" ADD CONSTRAINT "Strategy_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyVerification" ADD CONSTRAINT "StrategyVerification_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyVerification" ADD CONSTRAINT "StrategyVerification_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
