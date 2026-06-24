import { prisma } from "./prisma";
import { RANKS, SUITS, Card, cardToString } from "./cards";
import { analyzeFlop } from "./flopClassifier";

function deck(): Card[] {
  const cards: Card[] = [];
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      cards.push({ rank, suit });
    }
  }
  return cards;
}

function shuffle<T>(arr: T[]): T[] {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export async function getRandomUncoveredFlop(spotType: string) {
  for (let i = 0; i < 300; i++) {
    const d = shuffle(deck());
    const flop = [d[0], d[1], d[2]];
    const analysis = analyzeFlop(flop);

    const exists = await prisma.strategy.findFirst({
      where: {
        spotType: spotType as any,
        OR: [
          { exactFlop: analysis.normalizedFlop },
          { classKey: analysis.classKey },
        ],
      },
    });

    if (!exists) {
      return {
        flop,
        flopString: flop.map(cardToString).join(" "),
        analysis,
      };
    }
  }

  return null;
}
