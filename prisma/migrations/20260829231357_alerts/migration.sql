-- CreateEnum
CREATE TYPE "AlertVerdict" AS ENUM ('CIERTA', 'INCIERTA');

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "reviewAt" TIMESTAMP(3) NOT NULL,
    "verdict" "AlertVerdict",
    "verdictAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertSeen" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertSeen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Alert_createdById_idx" ON "Alert"("createdById");

-- CreateIndex
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AlertSeen_alertId_userId_key" ON "AlertSeen"("alertId", "userId");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertSeen" ADD CONSTRAINT "AlertSeen_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertSeen" ADD CONSTRAINT "AlertSeen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
