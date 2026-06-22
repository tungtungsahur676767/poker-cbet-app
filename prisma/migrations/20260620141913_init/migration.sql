-- CreateEnum
CREATE TYPE "SpotType" AS ENUM ('SRP', 'BET3', 'BET4');

-- CreateEnum
CREATE TYPE "StrategyScope" AS ENUM ('EXACT', 'CLASS', 'CUSTOM');

-- CreateTable
CREATE TABLE "Strategy" (
    "id" TEXT NOT NULL,
    "spotType" "SpotType" NOT NULL,
    "scope" "StrategyScope" NOT NULL,
    "title" TEXT,
    "strategyText" TEXT NOT NULL,
    "classKey" TEXT,
    "exactFlop" TEXT,
    "exampleFlop" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Strategy_spotType_classKey_idx" ON "Strategy"("spotType", "classKey");

-- CreateIndex
CREATE INDEX "Strategy_spotType_exactFlop_idx" ON "Strategy"("spotType", "exactFlop");
