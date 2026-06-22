import { SpotType, Strategy } from "@prisma/client";
import { prisma } from "./prisma";
import { analyzeFlop } from "./flopClassifier";
import { Card } from "./cards";

export async function findStrategy(cards: Card[], spotType: SpotType) {
  const analysis = analyzeFlop(cards);

  const exact = await prisma.strategy.findFirst({
    where: {
      spotType,
      exactFlop: analysis.normalizedFlop,
    },
    orderBy: { updatedAt: "desc" },
  });

  if (exact) {
    return {
      matchType: "EXACT",
      analysis,
      strategy: exact,
    };
  }

  const classMatch = await prisma.strategy.findFirst({
    where: {
      spotType,
      classKey: analysis.classKey,
    },
    orderBy: { updatedAt: "desc" },
  });

  if (classMatch) {
    return {
      matchType: "CLASS",
      analysis,
      strategy: classMatch,
    };
  }

  const fallback = await findLooseFallback(analysis.classKey, spotType);

  if (fallback) {
    return {
      matchType: "FALLBACK",
      analysis,
      strategy: fallback,
    };
  }

  return {
    matchType: "NONE",
    analysis,
    strategy: null,
  };
}

async function findLooseFallback(classKey: string, spotType: SpotType): Promise<Strategy | null> {
  const parts = classKey.split("_");
  if (parts.length < 2) return null;

  const texture = parts[parts.length - 1];
  const prefix = parts[0];

  const candidates = await prisma.strategy.findMany({
    where: {
      spotType,
      classKey: {
        startsWith: prefix,
        endsWith: texture,
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  return candidates[0] ?? null;
}
